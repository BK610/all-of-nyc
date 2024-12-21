import { NextResponse } from "next/server";
import Papa from "papaparse";
import { createClient } from "@supabase/supabase-js";

let cachedData = null;
let lastFetchedTime = 0;

// Cache for 5 minutes (adjust as needed)
const CACHE_DURATION_MS = 5 * 60 * 1000;

export async function GET(request) {
  // Pagination and Search info from the request parameters
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1", 10);
  const pageSize = parseInt(
    request.nextUrl.searchParams.get("pageSize") || "15",
    10
  );
  const searchQuery =
    request.nextUrl.searchParams.get("search")?.toLowerCase() || "";

  const currentTime = Date.now();

  // Check if cached data is still valid
  if (cachedData && currentTime - lastFetchedTime < CACHE_DURATION_MS) {
    console.log("Using cached data");

    const filteredData = filterData(searchQuery);

    return paginateData(filteredData, page, pageSize);
  }

  console.log("Fetching new data...");
  try {
    const data = await fetchData();
    // const data = await fetchData();
    cachedData = data;
    lastFetchedTime = currentTime;

    const filteredData = filterData(searchQuery);

    return paginateData(filteredData, page, pageSize);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function fetchData() {
  const supabase_client = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  let index = 0;
  const count = await getTableCount(supabase_client);

  let allData = [];

  while (index < count) {
    console.log("Fetching rows", index, "to", index + 999);

    const { data, error } = await supabase_client
      .from("enriched_url_data")
      .select("*")
      .range(index, index + 999)
      .csv();

    if (error) {
      console.error("Error fetching data:", error);
      return null;
    }

    const newData = Papa.parse(data, {
      header: true,
      skipEmptyLines: true,
    }).data;

    allData = allData.concat(newData);

    index += 1000;
  }

  return allData;
}

// async function fetchCSVData() {
//   const response = await fetch(GOOGLE_SHEET_URL);

//   if (!response.ok) throw new Error("Failed to fetch data");

//   // Read the response as text (CSV content)
//   const csvText = await response.text();

//   // Parse the CSV data using PapaParse
//   const parsedData = Papa.parse(csvText, {
//     header: true,
//     skipEmptyLines: true,
//   }).data;

//   return parsedData;
// }

// Get the total count of rows in the table
async function getTableCount(supabase_client) {
  const { count, error } = await supabase_client
    .from("enriched_url_data")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error fetching table count:", error);
    return null;
  }

  console.log("Table count:", count);

  return count;
}

// Filter data based on search query
function filterData(searchQuery) {
  const filteredData = searchQuery
    ? cachedData.filter((row) =>
        row.domain_name?.toLowerCase().includes(searchQuery)
      )
    : cachedData;

  return filteredData;
}

// Handle pagination of data
function paginateData(data, page, pageSize) {
  // Pagination indices
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedData = data.slice(startIndex, endIndex);

  return NextResponse.json({
    urls: paginatedData,
    total: data.length,
    currentPage: page,
    totalPages: Math.ceil(data.length / pageSize),
  });
}
