import { useState } from "react";

const Search = ({onSearch}) => {
    const [search, setSearch] = useState('');

    // Handle search submission
    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(search);
    };

    return (
      <form onSubmit={handleSearch} className="mb-2 flex justify-center items-center gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search URLs..."
          className="w-8/12 md:w-1/3 px-4 py-2 border border-nyc-light-gray rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring focus:ring-nyc-blue"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-nyc-orange text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Search
        </button>
      </form>
  );
};

export default Search;