import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
} from "@/components/ui/form";
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { clamp } from "@/utils/math.utils";

interface SearchFormValues {
  query: string;
}

interface FilterFormValues {
  status: string;
}

interface PageFormValues {
  page: string;
}

/** Search component */

interface SearchProps {
  onSearch: (query: string) => void;
  currentQueryValue?: string;
}

function Search({ onSearch, currentQueryValue = "" }: SearchProps) {
  const searchForm = useForm<SearchFormValues>({
    defaultValues: {
      query: currentQueryValue,
    },
  });

  useEffect(() => {
    searchForm.setValue("query", currentQueryValue);
  }, [currentQueryValue, searchForm]);

  const handleSearch = (values: SearchFormValues) => {
    onSearch(values.query);
  };

  return (
    <Form {...searchForm}>
      <form
        onSubmit={searchForm.handleSubmit(handleSearch)}
        className="w-full h-fit"
      >
        <FormField
          control={searchForm.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <b className="text-gray-700">Search</b>(hint: type
                <kbd className="h-5 w-5 text-center border-2 border-b-gray-300 border-r-gray-300 rounded-sm bg-nyc-light-gray">
                  /
                </kbd>
                to focus the search bar)
              </FormLabel>
              <FormControl>
                <div className="h-10 w-full transition-all duration-75 rounded-lg flex outline hover:outline-nyc-blue hover:focus-within:outline-nyc-orange hover:focus-within:outline-4 focus-within:outline-4 focus-within:outline-nyc-orange focus-within:shadow-xl">
                  <Input
                    id="search"
                    type="text"
                    {...field}
                    autoFocus
                    placeholder="Search all .nyc domains"
                    className="h-full flex-1 px-4 py-2 rounded-l-lg rounded-r-none border-0 text-gray-900 placeholder-gray-600 bg-gray-50 hover:bg-white focus:bg-white"
                  />
                  <Button
                    tabIndex={-1}
                    className="font-semibold rounded-l-none h-full transition-all duration-75 hover:bg-nyc-blue/80 hover:cursor-pointer"
                    type="submit"
                  >
                    Search
                  </Button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

/** Filters component */

interface FiltersProps {
  onFilter: (filters: { status: string }) => void;
  currentFilterValue?: string;
}

function Filters({
  onFilter,
  currentFilterValue = "is_complete",
}: FiltersProps) {
  const filterForm = useForm<FilterFormValues>({
    defaultValues: {
      status: currentFilterValue,
    },
  });

  useEffect(() => {
    filterForm.setValue("status", currentFilterValue);
  }, [currentFilterValue, filterForm]);

  const handleFilter = (values: FilterFormValues) => {
    onFilter({ status: values.status });
  };

  return (
    <Form {...filterForm}>
      <form
        onSubmit={filterForm.handleSubmit(handleFilter)}
        className=" flex justify-center items-center"
      >
        <FormField
          control={filterForm.control}
          name="status"
          render={({ field }) => (
            <FormItem className="h-full">
              <FormLabel
                className="font-semibold text-sm text-gray-700"
                htmlFor="website-status-select"
              >
                Website status
              </FormLabel>
              <FormControl>
                <select
                  className="h-full transition-all duration-75 px-1 py-2 rounded-lg outline outline-nyc-medium-gray hover:outline-nyc-blue hover:focus-within:outline-nyc-orange focus-within:outline-4 focus-within:outline-nyc-orange bg-gray-50 hover:bg-white focus:bg-white text-sm"
                  id="status-select"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    filterForm.handleSubmit(handleFilter)();
                  }}
                >
                  <option value="is_complete">Complete ✅</option>
                  <option value="is_live">Live ❓</option>
                  <option value="is_down">Down 💀</option>
                  <option value="default">Show all</option>
                </select>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

/** Pagination component */

interface PaginationProps {
  onPageChange: (page: number) => void;
  currentPageIndex: number;
  totalPages: number;
}

function Pagination({
  onPageChange,
  currentPageIndex,
  totalPages,
}: PaginationProps) {
  const [inputPage, setInputPage] = useState<string | number>(currentPageIndex);
  const [isSticky, setIsSticky] = useState(false);
  const pageForm = useForm<PageFormValues>({
    defaultValues: {
      page: String(currentPageIndex),
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      const paginationElement = document.querySelector("[data-pagination]");
      if (paginationElement) {
        const rect = paginationElement.getBoundingClientRect();
        setIsSticky(rect.top < 20); // 20px threshold for when to show shadow
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setInputPage(currentPageIndex);
    pageForm.setValue("page", String(currentPageIndex));
  }, [currentPageIndex, pageForm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^[0-9\b]+$/.test(value)) {
      setInputPage(value);
    }
  };

  const handlePageSubmit = (values: PageFormValues) => {
    const pageNumber = getValidPageNumber(values.page);
    setInputPage(pageNumber);
    onPageChange(pageNumber);
  };

  const getValidPageNumber = (maybePageNumber: string | number) => {
    const parsedPageNumber = parseInt(String(maybePageNumber), 10);
    if (isNaN(parsedPageNumber)) return currentPageIndex;
    return clamp(1, totalPages, parsedPageNumber);
  };

  return (
    <PaginationComponent
      data-pagination
      className="mt-2 mb-1 sticky top-4 z-10"
    >
      <PaginationContent
        className={`p-2 bg-amber-50 rounded-md gap-4 ${
          isSticky && "shadow-lg"
        }`}
      >
        <PaginationItem>
          <PaginationPrevious
            onClick={() =>
              onPageChange(getValidPageNumber(currentPageIndex - 1))
            }
            className="cursor-pointer bg-nyc-blue font-semibold text-white hover:bg-nyc-blue/80 hover:text-white focus:outline-nyc-orange"
            tabIndex={0}
          />
        </PaginationItem>
        <PaginationItem className="inline-flex items-center text-sm">
          <Form {...pageForm}>
            <form
              onSubmit={pageForm.handleSubmit(handlePageSubmit)}
              className="flex items-center"
            >
              <FormField
                control={pageForm.control}
                name="page"
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormControl>
                      <div className="flex items-center">
                        <span>Page&nbsp;</span>
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleInputChange(e);
                          }}
                          className="w-16 text-center rounded-md transition-all duration-75 bg-gray-50 hover:bg-white focus:bg-white outline-2 outline-nyc-medium-gray focus:outline-4 focus:outline-nyc-orange"
                        />
                        <span>&nbsp;of {totalPages}</span>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            onClick={() =>
              onPageChange(getValidPageNumber(currentPageIndex + 1))
            }
            className="cursor-pointer bg-nyc-blue font-semibold text-white hover:bg-nyc-blue/80 hover:text-white"
            tabIndex={0}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationComponent>
  );
}

/** Consolidated Inputs component */

interface InputsProps {
  onSearch: (query: string) => void;
  onPageChange: (page: number) => void;
  onFilter: (filters: { status: string }) => void;
  currentPageIndex: number;
  totalPages: number;
  className?: string;
  currentQueryValue?: string;
  currentFilterValue?: string;
}

export default function Inputs({
  onSearch,
  onPageChange,
  onFilter,
  currentPageIndex,
  totalPages,
  className,
  currentQueryValue = "",
  currentFilterValue = "is_complete",
}: InputsProps): React.ReactElement {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2">
        <Search onSearch={onSearch} currentQueryValue={currentQueryValue} />
        <Filters onFilter={onFilter} currentFilterValue={currentFilterValue} />
      </div>
      <Pagination
        onPageChange={onPageChange}
        currentPageIndex={currentPageIndex}
        totalPages={totalPages}
      />
    </>
  );
}
