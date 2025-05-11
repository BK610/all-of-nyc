"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Inputs from "@/components/Inputs";
import QueryResultsList from "@/components/queryResultsList";
import DomainModal from "@/components/domainModal";
import { subscribeToSearchReset } from "@/utils/searchState";
// import NotebookEmbed from "@/components/notebookEmbed";

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
  const [totalUrlsCount, setTotalUrlsCount] = useState(0);
  const [currentFilters, setCurrentFilters] = useState({
    status: "is_complete",
  });
  const [currentQuery, setCurrentQuery] = useState(searchParams.get("q") || "");
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<any>(null);

  // Define resetPaginationToFirstPage function before it's used
  const resetPaginationToFirstPage = () => {
    setCurrentPageIndex(1);
  };

  // Add keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !e.shiftKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !e.metaKey
      ) {
        e.preventDefault();
        const searchInput = document.getElementById("search");
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Subscribe to search reset events
  useEffect(() => {
    const handleReset = () => {
      setCurrentQuery("");
      resetPaginationToFirstPage();
      // Clear the search query from URL
      const params = new URLSearchParams(searchParams);
      params.delete("q");
      router.push(`?${params.toString()}`);
    };

    const unsubscribe = subscribeToSearchReset(handleReset);
    return () => unsubscribe();
  }, [router, searchParams, resetPaginationToFirstPage]);

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
        setTotalUrlsCount(result.total);
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

  // Handle hash changes for modal
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith("#domain-")) {
        const domainName = hash.replace("#domain-", "");
        const domain = urls.find((url) => url.domain_name === domainName);
        if (domain) {
          setSelectedDomain(domain);
        }
      } else {
        setSelectedDomain(null);
      }
    };

    // Initial check
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [urls]);

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

  const handleCloseModal = () => {
    setSelectedDomain(null);
    // Remove the hash without triggering a page reload
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search
    );
  };

  return (
    <section>
      <Inputs
        onSearch={handleSearch}
        onPageChange={(page) => setCurrentPageIndex(page)}
        onFilter={handleFilter}
        currentPageIndex={currentPageIndex}
        totalPages={totalPagesCount}
        initialQuery={currentQuery}
      />
      <QueryResultsList
        urls={urls}
        loading={loading}
        totalUrlsCount={totalUrlsCount}
      />
      <DomainModal
        url={selectedDomain}
        isOpen={!!selectedDomain}
        onClose={handleCloseModal}
      />
      {/* <NotebookEmbed
        src={"/Results.html"}
        fallbackUrl={
          "https://github.com/BK610/all-of-nyc/blob/main/jupyter/Results.ipynb"
        }
      /> */}
    </section>
  );
}
