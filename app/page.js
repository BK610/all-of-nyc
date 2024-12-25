"use client";

import { useEffect, useState, useCallback } from "react";
import HomeLayout from "./components/homeLayout";
import HomeHeader from "./components/homeHeader";
import Search from "./components/search";
import Pagination from "./components/pagination";
import QueryResultsList from "./components/queryResultsList";
import NotebookEmbed from "./components/notebookEmbed";

export default function Home() {
  const [urls, setUrls] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  // const [totalResultsCount, setTotalResultsCount] = useState(0);
  const [totalPagesCount, setTotalPagesCount] = useState(1);
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
        // setTotalResultsCount(result.total);
        setTotalPagesCount(result.totalPages);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    [pageSize]
  );

  // Fetch data on initial load and when page changes
  useEffect(() => {
    fetchUrls(currentPageIndex, query);
  }, [fetchUrls, currentPageIndex, query]);

  /** Code Feedback - Avoid the same name for multiple concepts. Notice that the verb form and noun form of a word are separate concepts.
   *
   * "search" in the previous implementation is kind of ambiguous because it
   * could refer to the *action* of searching, but you used it to refer to the *search term*.
   *
   * Above, you call the query string the "query". That's a good name to stick with and be consistent with.
   */
  const handleSearch = (query) => {
    resetPaginationToFirstPage();
    setQuery(query);
  };

  /**
   * Code Feedback - Avoid comments that are just restating the code
   *
   * If you think something is complicated enough to need a comment,
   * it's probably better to refactor it into a function with a descriptive name.
   * The exception is when you can't make it simpler or you need to something unintuitive.
   * When the code *can't* be clear, that's comments are most appropriate.
   *
   * The other main reason to use comments is documentation for other developers who
   * won't be able to read (or shouldn't be expected to) read the source code. For example,
   * when you're publishing an npm package, you want the exposed functions to be especially
   * well documented. That's an interface people will be interacting with often, and they are
   * unlikely to read the source code, so gratuitous comments are more appropriate.
   */
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
