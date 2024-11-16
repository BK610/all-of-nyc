'use client'

import { useEffect, useState } from 'react';

export default function Home() {
const [urls, setUrls] = useState([]);
const [page, setPage] = useState(1);
// const [total, setTotal] = useState(0);
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

  // Pagination handlers
  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };
  
  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to the first page on new search
    setQuery(search);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-nyc-blue dark:text-white text-center mb-8">
        All of .nyc
      </h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8 flex justify-center items-center gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search URLs..."
          className="w-1/3 px-4 py-2 border border-nyc-light-gray dark:border-dark-card rounded-lg text-gray-900 placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring focus:ring-nyc-blue dark:focus:ring-nyc-orange"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-nyc-orange dark:bg-nyc-blue text-white rounded-lg hover:bg-orange-700 dark:hover:bg-blue-700 transition-colors"
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
           className="block bg-white dark:bg-dark-card shadow-lg rounded-lg p-6 border border-gray-200 dark:border-nyc-light-gray transition-transform transform hover:scale-105 hover:shadow-xl"
         >
           <h2 className="text-nyc-blue dark:text-soft-blue text-xl font-semibold mb-2">
             {url.url}
           </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {/* Display additional metadata here*/}
              Registered: {url.registration_date}
            </p>
          </a>
        ))}
      </div>
      ) : (
        <p className="text-center">Loading some sweet, sweet data...</p>
      )}

      {/* <div className="mt-12 flex items-center justify-center space-x-6">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className={`px-4 py-2 bg-nyc-orange dark:bg-nyc-blue text-white rounded-lg ${
            page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-700 dark:hover:bg-blue-700'
          }`}
        >
          Previous
        </button>
        <span className="text-lg font-semibold">
          Page
        </span>
        <input
          type="integer"
          value={page}
          max="5000"
          min={1}
          step={1}
          onChange={(e) => setPage(e.target.value)}
          placeholder={page}
          className="w-1/12 px-4 py-2 border border-nyc-light-gray dark:border-dark-card rounded-lg text-gray-900 placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring focus:ring-nyc-blue dark:focus:ring-nyc-orange"
        />
        <span className="text-lg font-semibold">
          of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className={`px-4 py-2 bg-nyc-orange dark:bg-nyc-blue text-white rounded-lg ${
            page === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-700 dark:hover:bg-blue-700'
          }`}
        >
          Next
        </button>
      </div> */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(page) => setPage(page)}
        />

    </div>
  );
}

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [inputPage, setInputPage] = useState(currentPage);

  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^[0-9\b]+$/.test(value)) {
      setInputPage(value);
    }
  };

  const handlePageSubmit = (e) => {
    e.preventDefault();    
    let pageNumber = parseInt(inputPage, 10);

    // Adjust the page number if out of bounds
    if (isNaN(pageNumber)) pageNumber = currentPage;
    if (pageNumber < 1) pageNumber = 1;
    if (pageNumber > totalPages) pageNumber = totalPages;

    setInputPage(pageNumber); // Update the input field with the adjusted value
    onPageChange(pageNumber);
  };

  return (
    <div className="flex items-center justify-center space-x-4 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 bg-nyc-orange dark:bg-nyc-blue text-white rounded-lg ${
          currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-700 dark:hover:bg-blue-700'
        }`}      >
        Previous
      </button>

      {/* Page Input */}
      <form onSubmit={handlePageSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          value={inputPage}
          onChange={handleInputChange}
          className="w-16 text-center border border-gray-300 rounded-md p-2 dark:bg-gray-800 dark:text-white"
        />
        <span> of {totalPages}</span>
        <button type="submit" className="px-4 py-2 bg-nyc-orange dark:bg-nyc-blue text-white rounded-lg hover:bg-orange-700 dark:hover:bg-blue-700">
          Go
        </button>
      </form>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 bg-nyc-orange dark:bg-nyc-blue text-white rounded-lg ${
          currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-700 dark:hover:bg-blue-700'
        }`}
      >
        Next
      </button>
    </div>
  );
};
