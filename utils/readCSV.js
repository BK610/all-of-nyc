import fs from 'fs';
import Papa from 'papaparse';
import path from 'path';

export function getUrlsFromCSV(page = 1, pageSize = 15) {
  const filePath = path.join(process.cwd(), '/nyc_Domain_Registrations_20241115.csv');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  // Parse CSV data
  const { data } = Papa.parse(fileContent, { header: true });

  // Paginate the data
  const startIndex = (page - 1) * pageSize;
  const paginatedData = data.slice(startIndex, startIndex + pageSize);

  return {
    urls: paginatedData,
    total: data.length,
  };
};
