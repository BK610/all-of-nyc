import { NextResponse } from "next/server";
import Papa from "papaparse";

const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_URL;

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

    // Filter data based on search query if provided
    const filteredData = searchQuery
      ? cachedData.filter((row) => row.url?.toLowerCase().includes(searchQuery))
      : cachedData;

    return paginateData(filteredData, page, pageSize);
  }

  console.log("Fetching new data...");
  try {
    const data = await fetchCSVData();
    cachedData = data;
    lastFetchedTime = currentTime;

    // Filter data based on search query if provided
    const filteredData = searchQuery
      ? cachedData.filter((row) => row.url?.toLowerCase().includes(searchQuery))
      : cachedData;

    return paginateData(filteredData, page, pageSize);
  } catch (error) {
    console.error("Error fetching Google Sheet CSV:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function fetchCSVData() {
  const response = await fetch(GOOGLE_SHEET_CSV_URL);
  if (!response.ok) throw new Error("Failed to fetch data");

  // Read the response as text (CSV content)
  const csvText = await response.text();

  // Parse the CSV data using PapaParse
  const parsedData = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  }).data;

  return parsedData;
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
