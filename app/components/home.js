"use client";

import { useEffect, useState, useCallback } from "react";
import HomeLayout from "./homeLayout";
import HomeHeader from "./homeHeader";
import Filter from "./filter";
import Search from "./search";
import Pagination from "./pagination";
import QueryResultsList from "./queryResultsList";
import NotebookEmbed from "./notebookEmbed";

export default function Home({ initialUrls, initialTotalCount }) {
  // const [urls, setUrls] = useState(initialUrls); // Avoiding using this for now. Weird behavior on initial load
  const [urls, setUrls] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  // const [totalResultsCount, setTotalResultsCount] = useState(0);
  const [pageSize] = useState(15);
  const [totalPagesCount, setTotalPagesCount] = useState(
    Math.ceil(initialTotalCount / pageSize)
  );
  const [currentFilters, setCurrentFilters] = useState({
    status: "is_complete",
  });
  const [currentQuery, setCurrentQuery] = useState("");

  /** Fetches a list of URLs with the currentPageIndex, pageSize, and currentQuery values.
   *
   * Uses the base GET endpoint defined in api/route.js.
   */
  const fetchUrls = useCallback(
    async (currentPageIndex, currentQuery, currentFilters) => {
      try {
        const response = await fetch(
          `/api?pageIndex=${currentPageIndex}&pageSize=${pageSize}&query=${currentQuery}&status=${currentFilters.status}`
        );
        const result = await response.json();
        setUrls(result.urls);
        // setTotalResultsCount(result.total);
        setTotalPagesCount(result.totalPages);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    [pageSize]
  );

  // Reminder: useEffect runs on initial page load and when the page changes.
  useEffect(() => {
    fetchUrls(currentPageIndex, currentQuery, currentFilters);
  }, [fetchUrls, pageSize, currentPageIndex, currentQuery, currentFilters]);

  const handleFilter = (filters) => {
    resetPaginationToFirstPage();
    setCurrentFilters(filters);
  };

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
      <Filter onFilter={handleFilter} />
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
        src={"/Results.html"}
        fallbackUrl={
          "https://github.com/BK610/all-of-nyc/blob/main/jupyter/Results.ipynb"
        }
      />
    </HomeLayout>
  );
}
