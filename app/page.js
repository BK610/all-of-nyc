"use client";

import { useEffect, useState, useCallback } from "react";
import Search from "./components/search";
import Card from "./components/card";
import Pagination from "./components/pagination";
import NotebookEmbed from "./components/notebookEmbed";

export default function Home() {
  const [urls, setUrls] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(15);
  const [query, setQuery] = useState("");

  // Fetch data from the server
  const fetchUrls = useCallback(
    async (currentPage, currentQuery) => {
      try {
        const res = await fetch(
          `/api?page=${currentPage}&pageSize=${pageSize}&search=${currentQuery}`
        );
        const result = await res.json();
        setUrls(result.urls);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    [pageSize]
  );

  // Fetch data on initial load and when page changes
  useEffect(() => {
    fetchUrls(page, query);
  }, [fetchUrls, page, query]);

  // Handle search submission
  const handleSearch = (search) => {
    setPage(1); // Reset to the first page on search
    setQuery(search);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="border-b-2 pb-6">
        <h1 className="text-3xl font-bold text-nyc-blue text-center mb-2">
          All of .nyc
        </h1>
        <p className="text-center mb-4">
          Discover how .nyc domains are being used.
        </p>
        {/* Search Form */}
        <Search onSearch={handleSearch} />

        <p className="text-center mb-2">Found {total} URLs</p>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(page) => setPage(page)}
        />
        {/* URL Cards */}
        {urls.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-5">
            {urls.map((url, index) => (
              <Card key={index} url={url} />
            ))}
          </div>
        ) : (
          <p className="text-center">Loading some sweet, sweet data...</p>
        )}
      </div>
      <NotebookEmbed
        src={"Results.html"}
        fallbackUrl={
          "https://github.com/BK610/all-of-nyc/blob/main/jupyter/Results.ipynb"
        }
      />
    </div>
  );
}
