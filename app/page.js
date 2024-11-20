'use client'

import { useEffect, useState } from 'react';
import Pagination from './components/pagination';
import NotebookEmbed from './components/notebookEmbed';

export default function Home() {
const [urls, setUrls] = useState([]);
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [pageSize] = useState(15);
const [search, setSearch] = useState('');
const [query, setQuery] = useState('');

  // Fetch data from the server
  const fetchUrls = async (currentPage, currentQuery) => {
    try {
      const res = await fetch(`/api?page=${currentPage}&pageSize=${pageSize}&search=${currentQuery}`);
      const result = await res.json();
      setUrls(result.urls);
      setTotalPages(result.totalPages);
      // setTotal(total);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch data on initial load and when page changes
  useEffect(() => {
    fetchUrls(page, query);
  }, [page, query]);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to the first page on new search
    setQuery(search);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
    <div className="border-b-2 pb-6">
      <h1 className="text-3xl font-bold text-nyc-blue text-center mb-8">
        All of .nyc
      </h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8 flex justify-center items-center gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search URLs..."
          className="w-1/3 px-4 py-2 border border-nyc-light-gray rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring focus:ring-nyc-blue"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-nyc-orange text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
          Search
        </button>
      </form>

      {/* URL Cards */}
      {urls.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {urls.map((url, index) => (
           <a
           key={index}
           href={url.url}
           target="_blank"
           rel="noopener noreferrer"
           className="block bg-white shadow-lg rounded-lg p-6 border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-xl"
         >
           <h2 className="text-nyc-blue text-xl font-semibold mb-2">
             {url.url}
           </h2>
            <p className="text-gray-600 mt-2">
              {/* Display additional metadata here*/}
              Registered: {url.registration_date}
            </p>
          </a>
        ))}
      </div>
      ) : (
        <p className="text-center">Loading some sweet, sweet data...</p>
      )}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(page) => setPage(page)}
        />
      <h2></h2>
      </div>
      <NotebookEmbed
        src={"Results.html"}
        fallbackUrl={"https://github.com/BK610/all-of-nyc/blob/main/jupyter/Results.ipynb"}
      />
    </div>
  );
}