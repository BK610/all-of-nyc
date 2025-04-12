import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "./ui/label";

interface SearchProps {
  onSearch: (query: string) => void;
  className?: string;
  initialQuery?: string;
}

export default function Search({
  onSearch,
  className,
  initialQuery = "",
}: SearchProps): React.ReactElement {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSearch} className={`${className} mb-2 h-fit`}>
      <Label htmlFor="search" className="pb-2">
        <b className="text-gray-700">Search</b>(hint: type
        <kbd className="h-5 w-5 text-center border-2 border-b-gray-300 border-r-gray-300 rounded-sm bg-nyc-light-gray">
          /
        </kbd>
        to focus the search bar)
      </Label>
      <div
        className="h-10 w-full transition-all duration-75 rounded-lg flex
      outline-2 outline-nyc-medium-gray focus-within:outline-4 focus-within:outline-nyc-orange
      focus-within:shadow-xl"
      >
        <input
          id="search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          placeholder={"Search all .nyc domains"}
          className="h-full flex-1 px-4 py-2 rounded-l-lg text-gray-900 placeholder-gray-600
          bg-gray-50 hover:bg-white focus:bg-white"
        />

        <Button
          tabIndex={-1}
          className="font-semibold rounded-l-none h-full hover:cursor-pointer"
          type="submit"
        >
          Search
        </Button>
      </div>
    </form>
  );
}
