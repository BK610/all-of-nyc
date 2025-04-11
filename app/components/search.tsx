import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SearchProps {
  onSearch: (query: string) => void;
  className?: string;
}

const Search = ({ onSearch, className }: SearchProps): React.ReactElement => {
  const [query, setQuery] = useState("");

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSearch} className={`${className} mb-2 flex`}>
      <input
        id="search"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search all of .nyc"
        className="w-full px-4 py-2 border border-gray-300 rounded-l-lg text-gray-900 placeholder-gray-500"
      />

      <Button
        className="bg-nyc-orange font-semibold rounded-l-none h-full"
        type="submit"
      >
        Search
      </Button>
    </form>
  );
};

export default Search;
