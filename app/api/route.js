import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const page = parseInt(request.nextUrl.searchParams.get('page') || '1', 10);
  const pageSize = parseInt(request.nextUrl.searchParams.get('pageSize') || '20', 10);
  const searchQuery = request.nextUrl.searchParams.get('search')?.toLowerCase() || '';

  const filePath = path.join(process.cwd(), '/nyc_Domain_Registrations_20241115.csv');
  const fileContent = fs.readFileSync(filePath, 'utf8');

  // Parse CSV data
  const { data } = Papa.parse(fileContent, { header: true });

  // Filter data based on search query if provided
  const filteredData = searchQuery
    ? data.filter((row) => row.url?.toLowerCase().includes(searchQuery))
    : data;

  // Pagination logic
  const startIndex = (page - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  return NextResponse.json({
    urls: paginatedData,
    total: filteredData.length,
  });
}
