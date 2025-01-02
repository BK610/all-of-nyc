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

/** Defines an endpoint at `https://allof.nyc/api?{URL parameters}/` to get the list of URLs
 * from the Supabase database, using the provided URL parameters.
 *
 * The URL parameters include:
 * @param pageIndex: The index of the page to return. Primarily used during pagination. New searches reset this to 1.
 * @param pageSize: The number of URLs to return per page.
 * @param query: The provided search query to filter the returned URLs.
 *
 * @deprecated This endpoint is deprecated in favor of performing data fetching server-side.
 */
export async function GET(request) {
  const [pageIndex, pageSize, query] = getUrlParams(request);

  const currentTime = Date.now();
  let filteredData = [];
  let paginatedData = [];

  // Use cached data if still valid
  if (cachedData && currentTime - lastFetchedTime < CACHE_DURATION_MS) {
    console.log("Using cached data");

    filteredData = filterData(query);
    paginatedData = paginateData(filteredData, pageIndex, pageSize);
  } else {
    // Fetch new data if cache is invalid
    try {
      console.log("Fetching new data...");
      const data = await fetchData();
      cachedData = data;
      lastFetchedTime = currentTime;

      filteredData = filterData(query);
      paginatedData = paginateData(filteredData, pageIndex, pageSize);
    } catch (error) {
      console.error("Error fetching data:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({
    urls: paginatedData,
    total: filteredData.length,
    currentPage: pageIndex,
    totalPages: Math.ceil(filteredData.length / pageSize),
  });
}

/** Fetch all available data from Supabase.
 *
 * Fetches data in batches of 1000 rows, as Supabase has a default limit of 1000 rows per request.
 * Repeats until all data is fetched.
 */
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

/** Helper function to get the URL parameter values from the provided request. */
function getUrlParams(request) {
  const pageIndex = parseInt(
    request.nextUrl.searchParams.get("pageIndex") || "1"
  );
  const pageSize = parseInt(
    request.nextUrl.searchParams.get("pageSize") || "15"
  );
  const query = request.nextUrl.searchParams.get("query")?.toLowerCase() || "";

  return [pageIndex, pageSize, query];
}

/** Helper function to get the total count of rows in the table. */
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

/** Helper function to filter data based on query. */
function filterData(query) {
  const filteredData = query
    ? cachedData.filter((row) => row.domain_name?.toLowerCase().includes(query))
    : cachedData;

  return filteredData;
}

/** Helper function to handle pagination of data. */
function paginateData(data, page, pageSize) {
  // Pagination indices
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedData = data.slice(startIndex, endIndex);

  return paginatedData;
}
