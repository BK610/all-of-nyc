"use client";

import { useEffect, useState, useCallback } from "react";
// import { fetchUrls } from "./actions";
import HomeLayout from "./homeLayout";
import HomeHeader from "./homeHeader";
import Search from "./search";
import Pagination from "./pagination";
import QueryResultsList from "./queryResultsList";
import NotebookEmbed from "./notebookEmbed";

export default function Home() {
  const [urls, setUrls] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  // const [totalResultsCount, setTotalResultsCount] = useState(0);
  const [totalPagesCount, setTotalPagesCount] = useState(1);
  const [pageSize] = useState(15);
  const [currentQuery, setCurrentQuery] = useState("");

  /** Fetches a list of URLs with the currentPageIndex, pageSize, and currentQuery values.
   *
   * Uses the base GET endpoint defined in api/route.js.
   */
  const fetchUrls = useCallback(
    async (pageSize, currentPageIndex, currentQuery) => {
      try {
        const res = await fetch(
          `/api?pageIndex=${currentPageIndex}&pageSize=${pageSize}&query=${currentQuery}`
        );
        const result = await res.json();
        setUrls(result.urls);
        // setTotalResultsCount(result.total);
        setTotalPagesCount(result.totalPages);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    [pageSize]
  );

  // Reminder: useEffect runs when initial page load and when page changes.
  useEffect(() => {
    fetchUrls(pageSize, currentPageIndex, currentQuery);

    // const [ tempUrls, tempTotalPagesCount ] = fetchUrls(
    //   pageSize,
    //   currentPageIndex,
    //   currentQuery
    // );

    // console.log(tempUrls);
    // console.log(tempTotalPagesCount);

    // setUrls(tempUrls);
    // setTotalPagesCount(tempTotalPagesCount);
  }, [fetchUrls, pageSize, currentPageIndex, currentQuery]);

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
        currentPage={currentPageIndex}
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
