import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Filter({ onFilter }) {
  const [filters, setFilters] = useState({
    status: "is_complete",
  });

  const handleFilter = (e) => {
    e.preventDefault();
    console.log("Filter component changed to:", filters);
    onFilter(filters);
  };

  return (
    <form
      onSubmit={handleFilter}
      className="mb-2 flex justify-center items-center gap-4"
    >
      {/* <div>Filters</div> */}
      <div className="p-2 flex flex-col justify-center border border-gray-300 rounded-lg">
        <label className="text-gray-500" htmlFor="website-status-select">
          Website status
        </label>
        <select
          className="px-2 py-2 border-b-2 border-gray-300 text-sm"
          name="status"
          id="status-select"
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="is_complete">✅ Complete</option>
          <option value="is_live">❓ Live</option>
          <option value="is_down">💀 Down</option>
          <option value="">Show all</option>
        </select>
      </div>
      <Button className="font-semibold" type="submit">
        Filter
      </Button>
    </form>
  );
}
