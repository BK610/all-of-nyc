"use client";

import { useEffect, useState, useCallback } from "react";
import Search from "./components/search";
import Card from "./components/card";
import Pagination from "./components/pagination";
import NotebookEmbed from "./components/notebookEmbed";

export default function Home() {
  const [urls, setUrls] = useState([]);
  const [page, setPage] = useState(1); // Code Feedback - "page" is a little ambiguous. Maybe "currentPageIndex"?
  const [total, setTotal] = useState(0); // Code Feedback - "total" is a little ambiguous. Maybe "totalResultsCount"?
  const [totalPages, setTotalPages] = useState(1); // Code Feedback - "totalPages" isn't super ambiguous, but making it clear it's a count, not something else like a list of all pages, would be nice.
  const [pageSize] = useState(15);
  const [query, setQuery] = useState("");

  // Fetch data from the server
  const fetchUrls = useCallback(
    async (currentPage, currentQuery) => {
      try {
        const res = await fetch(
          `/api?page=${currentPage}&pageSize=${pageSize}&search=${currentQuery}`,
        );
        const result = await res.json();
        setUrls(result.urls);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    [pageSize],
  );

  // Fetch data on initial load and when page changes
  useEffect(() => {
    fetchUrls(page, query);
  }, [fetchUrls, page, query]);

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
    setPage(1);
  };

  /**
   * Code Feedback - This was pretty easy to read, but ideally, the top-level JSX
   * makes the structure of the page even clear.
   *
   * Mixing in HTML and CSS makes it harder to see the structure
   *
   * Something like this allows the reader to quickly see that you've structured your
   * page in a sane way.
   *
   * (You did structure you page in a sane way - it's just not 100% obvious at a glance.
   * That quick impression seems important for a project someone is using to evaluate you.)
   *
   * <div className="body">
   *   <Header/>
   *   <SearchForm/>
   *   <QueryResultsList/>
   *   <JupyterNotebook/>
   * </div>
   *
   * This might also help you move state down a bit. I could imagine a "QueryResultsList" component
   * that takes the list of URLs and displays them. That component could handle the pagination, making this
   * component even simpler.
   */
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
        {/* Code Feedback - This is a good example of a comment that points you towards a better organization. Make a component for the cards */}
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
