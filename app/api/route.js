import { NextResponse } from "next/server";
import Papa from "papaparse";
import { createClient } from "@supabase/supabase-js";

let cachedData = null;
let lastFetchedTime = 0;

// Cache for 5 minutes (adjust as needed)
const CACHE_DURATION_MS = 5 * 60 * 1000;

const supabase_client = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  const [page, pageSize, query] = getUrlParams(request);

  const currentTime = Date.now();

  // TODO: Upgrade caching solution. Caching in local variables seems to
  //   fail occasionally. Maybe periodic storage cleanup?
  // console.log("Cache info:");
  // console.log(cachedData);
  // console.log(lastFetchedTime);
  // console.log(currentTime);
  // console.log(CACHE_DURATION_MS);

  // Use cached data if still valid
  if (cachedData && currentTime - lastFetchedTime < CACHE_DURATION_MS) {
    console.log("Using cached data");

    const filteredData = filterData(query);

    return paginateData(filteredData, page, pageSize);
  }
  // Fetch new data if cache is invalid
  try {
    console.log("Fetching new data...");
    const data = await fetchData();
    cachedData = data;
    lastFetchedTime = currentTime;

    const filteredData = filterData(query);

    return paginateData(filteredData, page, pageSize);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Fetch all available data from Supabase
async function fetchData() {
  let index = 0;
  const count = await getTableCount();

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

// Get the request URL parameter values
function getUrlParams(request) {
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
  const pageSize = parseInt(
    request.nextUrl.searchParams.get("pageSize") || "15"
  );
  const query = request.nextUrl.searchParams.get("search")?.toLowerCase() || "";

  return [page, pageSize, query];
}

// Get the total count of rows in the table
async function getTableCount() {
  const { count, error } = await supabase_client
    .from("enriched_url_data")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error fetching table count:", error);
    return null;
  }

  console.log("Table row count:", count);

  return count;
}

// Filter data based on query
function filterData(query) {
  const filteredData = query
    ? cachedData.filter((row) => row.domain_name?.toLowerCase().includes(query))
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
