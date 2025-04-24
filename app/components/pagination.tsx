import { useState, useEffect } from "react";
import { clamp } from "@/utils/math.utils";
import Button from "@/app/components/button";
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";

export default function Pagination({
  currentPageIndex,
  totalPages,
  onPageChange,
}): React.ReactElement {
  const [inputPage, setInputPage] = useState(currentPageIndex); // it seems like it would be better to make this a string right away, so it's not a mix of types

  useEffect(() => {
    setInputPage(currentPageIndex);
  }, [currentPageIndex]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^[0-9\b]+$/.test(value)) {
      setInputPage(value);
    }
  };

  const handlePageSubmit = (e) => {
    e.preventDefault();

    const pageNumber = getValidPageNumber(inputPage);

    setInputPage(pageNumber);
    onPageChange(pageNumber);
  };

  /* Code Feedback
   * Here's a kind of function that gets a little more clear.
   *
   * 1) It has a descriptive name that tells you what it does.
   * 2) It's a pure function, so it's easy to test.
   * 3) It follows a guard clause pattern, avoiding "let" and multiple if statements that change the value. That can be hard to track.
   *
   * If you want to have a first function to write tests for in your codebase, this is a good one.
   *
   * I think it's worthwhile to add tests because reviewers look for that kind of thing. Just by having a "tests" folder or files, you'll show
   * people that you're thinking about it.
   *
   * I had someone review my thing one time, and they were like "awesome you have tests", and I said, "there's like 2 in there", and they
   * were like, "that's way better than most people" and were still impressed. In some areas, the bar is low; you just need to know it's there.
   */
  const getValidPageNumber = (maybePageNumber) => {
    const parsedPageNumber = parseInt(maybePageNumber, 10);
    if (isNaN(parsedPageNumber)) return currentPageIndex;

    return clamp(1, totalPages, parsedPageNumber);
  };

  return (
    <PaginationComponent className="pb-2">
      <PaginationContent className="gap-4">
        <PaginationItem>
          <PaginationPrevious
            onClick={() =>
              onPageChange(getValidPageNumber(currentPageIndex - 1))
            }
            className="cursor-pointer bg-nyc-blue text-white hover:bg-nyc-blue/80 hover:text-white focus:outline-nyc-orange"
            tabIndex={0}
          />
        </PaginationItem>
        <PaginationItem className="inline-flex items-center text-sm">
          <form onSubmit={handlePageSubmit} className="flex items-center">
            <span>Page&nbsp;</span>
            <Input
              value={inputPage}
              onChange={handleInputChange}
              className="w-16 text-center rounded-md transition-all duration-75
          bg-gray-50 hover:bg-white focus:bg-white
          outline-2 outline-nyc-medium-gray actiasdfve:outline-4 focus:outline-nyc-orange"
            />
            <span>&nbsp;of {totalPages}</span>
          </form>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            onClick={() =>
              onPageChange(getValidPageNumber(currentPageIndex + 1))
            }
            className="cursor-pointer bg-nyc-blue text-white hover:bg-nyc-blue/80 hover:text-white"
            tabIndex={0}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationComponent>
  );
}
