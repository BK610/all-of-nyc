import { useState, useEffect } from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [inputPage, setInputPage] = useState(currentPage);

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
    let pageNumber = parseInt(inputPage, 10);

    // Adjust the page number if out of bounds
    if (isNaN(pageNumber)) pageNumber = currentPage;
    if (pageNumber < 1) pageNumber = 1;
    if (pageNumber > totalPages) pageNumber = totalPages;

    setInputPage(pageNumber); // Update the input field with the adjusted value
    onPageChange(pageNumber);
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
