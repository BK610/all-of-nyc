import { useState, useEffect } from "react";

/**
 * One thing that's tough about this codebase is that it's not typescript.
 * That puts more pressure on the variables names to communicate
 * their types.
 *
 * See my feedback on pages about how to make these more clear.
 * I think something like "currentPageIndex" is much more clear
 * than currentPage.
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [inputPage, setInputPage] = useState(currentPage); // it seems like it would be better to make this a string right away, so it's not a mix of types

  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

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
    if (isNaN(parsedPageNumber)) return currentPage;

    return clamp(1, totalPages, parsedPageNumber);
  };

  return (
    <div className="flex items-center justify-center space-x-4 mb-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 bg-nyc-orange text-white rounded-lg ${
          currentPage === 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-orange-700"
        }`}
      >
        Previous
      </button>

      {/* Page Input */}
      <form onSubmit={handlePageSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          value={inputPage}
          onChange={handleInputChange}
          className="w-16 text-center border border-gray-300 rounded-md p-2"
        />
        <span> of {totalPages}</span>
        <button
          type="submit"
          className="px-4 py-2 bg-nyc-orange text-white rounded-lg hover:bg-orange-700"
        >
          Go
        </button>
      </form>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 bg-nyc-orange text-white rounded-lg ${
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-orange-700"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
