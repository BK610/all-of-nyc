"use client";

import { useEffect, useState, useCallback } from "react";
// import { fetchUrls } from "./actions";
import HomeLayout from "./homeLayout";
import HomeHeader from "./homeHeader";
import Search from "./search";
import Pagination from "./pagination";
import QueryResultsList from "./queryResultsList";
import NotebookEmbed from "./notebookEmbed";

export default function Home({ initialUrls }) {
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  // const [totalResultsCount, setTotalResultsCount] = useState(0);
  const [totalPagesCount, setTotalPagesCount] = useState(1);
  const [pageSize] = useState(15);
  const [urls, setUrls] = useState(initialUrls.slice(0, pageSize));
  const [currentQuery, setCurrentQuery] = useState("");

  // Reminder: useEffect runs on initial page load and when the page changes.
  useEffect(() => {
    const filteredUrls = initialUrls.filter((url) =>
      url.domain_name.toLowerCase().includes(currentQuery.toLowerCase())
    );

    const total = filteredUrls.length;
    const totalPages = Math.ceil(total / pageSize);

    const startIndex = (currentPageIndex - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedUrls = filteredUrls.slice(startIndex, endIndex);

    setUrls(paginatedUrls);
    setTotalPagesCount(totalPages);
  }, [pageSize, currentPageIndex, currentQuery, initialUrls]);

  const handleSearch = (query) => {
    resetPaginationToFirstPage();
    setCurrentQuery(query);
  };

  const resetPaginationToFirstPage = () => {
    setCurrentPageIndex(1);
  };

  return (
    <HomeLayout>
      <HomeHeader />
      {/* TODO: Consider combining Search, Pagination, and QueryResultsList into a single component.
       * State and logic could be handled on that level too.
       */}
      <Search onSearch={handleSearch} />
      <Pagination
        currentPageIndex={currentPageIndex}
        totalPages={totalPagesCount}
        onPageChange={(page) => setCurrentPageIndex(page)}
      />
      <QueryResultsList urls={urls} />
      <NotebookEmbed
        src={"Results.html"}
        fallbackUrl={
          "https://github.com/BK610/all-of-nyc/blob/main/jupyter/Results.ipynb"
        }
      />
    </HomeLayout>
  );
}
