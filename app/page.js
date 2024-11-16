'use client'

import { useEffect, useState } from 'react';

export default function Home() {
const [urls, setUrls] = useState([]);
const [page, setPage] = useState(1);
const [pageSize] = useState(20);
const [total, setTotal] = useState(0);

  // Fetch data from the server
  const fetchUrls = async (currentPage) => {
    const res = await fetch(`/api?page=${currentPage}&pageSize=${pageSize}`);
    const { urls, total } = await res.json();
    setUrls(urls);
    setTotal(total);
  };

  // Fetch data on initial load and when page changes
  useEffect(() => {
    fetchUrls(page);
  }, [page]);

  const totalPages = Math.ceil(total / pageSize);

    // Pagination handlers
    const handleNextPage = () => {
      if (page < totalPages) setPage((prev) => prev + 1);
    };
  
    const handlePrevPage = () => {
      if (page > 1) setPage((prev) => prev - 1);
    };  

  return (
    <div>
      <h1>URL Directory</h1>
      <ul>
        {urls.map((url, index) => (
          <li key={index}>
            <a href={url.url} target="_blank" rel="noopener noreferrer">
              {url.url}, {url.registration_date}
            </a>
          </li>
        ))}
      </ul>

      <div className>
        <button onClick={handlePrevPage} disabled={page === 1}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

// export async function getServerSideProps() {
//   const { getUrlsFromCSV } = await import('../utils/readCSV');
//   const urls = getUrlsFromCSV();

//   return {
//     props: { urls },
//   };
// }