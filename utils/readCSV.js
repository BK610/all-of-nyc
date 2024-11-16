import Papa from 'papaparse';
import path from 'path';

export const getUrlsFromCSV = () => {
  const fs = require('fs');
  const filePath = path.join(process.cwd(), '/nyc_Domain_Registrations_20241115.csv');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  const { data } = Papa.parse(fileContent, { header: true });
  return data;
};
