import { NextResponse } from 'next/server';
import Papa from 'papaparse';

const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTmO4zZCoQVROb9q_pRRLZG4voK03u3eIzAcsy69R9Q2bAqejFO41_1SzWSoA1m83p8HiNu3xJyiZ1J/pub?gid=1714697285&single=true&output=csv';

export async function GET(request) {
  try {
    // Pagination and Search info from the request parameters
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(request.nextUrl.searchParams.get('pageSize') || '20', 10);
    const searchQuery = request.nextUrl.searchParams.get('search')?.toLowerCase() || '';

    // Pagination indices
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // Fetch the CSV content from the Google Sheets URL
    const response = await fetch(GOOGLE_SHEET_CSV_URL, { method: 'GET' });
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }

    // Read the response as text (CSV content)
    const csvText = await response.text();

    // Parse the CSV data using PapaParse
    const parsedData = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      // worker: true,
    }).data;

    // Filter data based on search query if provided
    const filteredData = searchQuery
      ? parsedData.filter((row) => row.url?.toLowerCase().includes(searchQuery))
      : parsedData;

    // console.log(filteredData);

    // Pagination logic
    const paginatedData = filteredData.slice(startIndex, endIndex);

    // console.log(paginatedData);

    // console.log(response);
    // console.log(csvText);
    // console.log(parsedData);

    // Return the parsed data as a JSON response
    return NextResponse.json({
      urls: paginatedData,
      total: filteredData.length,
      currentPage: page,
      totalPages: Math.ceil(filteredData.length / pageSize,
    )});
  } catch (error) {
    console.error('Error fetching Google Sheet CSV:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}