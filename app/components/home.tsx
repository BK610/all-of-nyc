"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import HomeHeader from "@/components/homeHeader";
import Filter from "@/components/filter";
import Search from "@/components/search";
import Pagination from "@/components/pagination";
import QueryResultsList from "@/components/queryResultsList";
import NotebookEmbed from "@/components/notebookEmbed";
import { z } from "zod";

const formSchema = z.object({
  query: z.string(),
  status: z.enum(["is_complete", "is_live", "is_down", ""]),
});

interface HomeProps {
  initialUrls: [any];
  initialTotalCount: number;
}

export default function Home({
  initialUrls,
  initialTotalCount,
}: HomeProps): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [urls, setUrls] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [pageSize] = useState(15);
  const [totalPagesCount, setTotalPagesCount] = useState(
    Math.ceil(initialTotalCount / pageSize)
  );
  const [currentFilters, setCurrentFilters] = useState({
    status: "is_complete",
  });
  const [currentQuery, setCurrentQuery] = useState(searchParams.get("q") || "");
  const [loading, setLoading] = useState(true);

  /** Fetches a list of URLs with the currentPageIndex, pageSize, and currentQuery values.
   *
   * Uses the base GET endpoint defined in api/route.js.
   */
  const fetchUrls = useCallback(
    async (currentPageIndex, currentQuery, currentFilters) => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api?pageIndex=${currentPageIndex}&pageSize=${pageSize}&query=${currentQuery}&status=${currentFilters.status}`
        );
        const result = await response.json();
        setUrls(result.urls);
        setTotalPagesCount(result.totalPages);
        setLoading(false);
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

  // Handle focus and scrolling after domain cards are loaded
  useEffect(() => {
    if (!loading && urls.length > 0) {
      const hash = window.location.hash;
      if (hash) {
        // Small delay to ensure DOM is fully rendered
        setTimeout(() => {
          const element = document.getElementById(hash.substring(1));
          if (element) {
            element.focus();
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 100);
      }
    }
  }, [loading, urls]);

  const handleFilter = (filters) => {
    resetPaginationToFirstPage();
    setCurrentFilters(filters);
  };

  const handleSearch = (query) => {
    resetPaginationToFirstPage();
    setCurrentQuery(query);

    // Update URL with search query
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    router.push(`?${params.toString()}`);
  };

  const resetPaginationToFirstPage = () => {
    setCurrentPageIndex(1);
  };

  return (
    <>
      <HomeHeader />
      <div className="flex flex-col sm:flex-row gap-2">
        <Search
          className="w-full"
          onSearch={handleSearch}
          initialQuery={currentQuery}
        />
        <Filter onFilter={handleFilter} />
      </div>
      <Pagination
        currentPageIndex={currentPageIndex}
        totalPages={totalPagesCount}
        onPageChange={(page) => setCurrentPageIndex(page)}
      />
      <QueryResultsList urls={urls} loading={loading} />
      {/* <NotebookEmbed
        src={"/Results.html"}
        fallbackUrl={
          "https://github.com/BK610/all-of-nyc/blob/main/jupyter/Results.ipynb"
        }
      /> */}
    </>
  );
}
