import axios from 'axios';

export default async function handler(req, res) {
  const { GOOGLE_SHEET_ID, GOOGLE_API_KEY } = process.env;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/Sheet1?key=${GOOGLE_API_KEY}`;

  try {
    const response = await axios.get(url);
    const rows = response.data.values;
    const urls = rows.slice(1).map(row => row[0]); // Assuming URLs are in the first column
    res.status(200).json({ urls });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
