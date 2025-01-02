import Home from "./components/home";
import Papa from "papaparse";
import { createClient } from "@supabase/supabase-js";

export default async function Page() {
  const initialUrls = await fetchData();
  // const initialUrls = [
  //   { url: "a" },
  //   { url: "a" },
  //   { url: "a" },
  //   { url: "a" },
  //   { url: "a" },
  //   { url: "a" },
  //   { url: "a" },
  //   { url: "a" },
  //   { url: "a" },
  //   { url: "a" },
  //   { url: "a" },
  //   { url: "a" },
  //   { url: "a" },
  //   { url: "a" },
  //   { url: "a" },
  //   { url: "a" },
  //   { url: "a" },
  //   { url: "a" },
  //   { url: "a" },
  //   { url: "a" },
  //   { url: "a" },
  //   { url: "a" },
  //   { url: "a" },
  //   { url: "a" },
  //   { url: "a" },
  //   { url: "a" },
  //   { url: "a" },
  //   { url: "a" },
  //   { url: "a" },
  // ];

  return <Home initialUrls={initialUrls} />;
}

const supabase_client = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/** Fetch all available data from Supabase.
 *
 * Fetches data in batches of 1000 rows, as Supabase has a default limit of 1000 rows per request.
 * Repeats until all data is fetched.
 */
async function fetchData() {
  let index = 0;
  const increment = 1000;
  const count = await getTableCount();

  let allData = [];

  while (index < count) {
    console.log("Fetching rows", index, "to", index + increment - 1);

    const { data, error } = await supabase_client
      .from("enriched_url_data")
      .select("*")
      .range(index, index + increment - 1)
      .csv();

    if (error) {
      console.error("Error fetching data:", error);
      return null;
    }

    const newData = Papa.parse(data, {
      header: true,
      skipEmptyLines: true,
    }).data;

    allData = allData.concat(newData);

    index += increment;
  }

  return allData;
}

/** Helper function to get the total count of rows in the table. */
async function getTableCount() {
  const { count, error } = await supabase_client
    .from("enriched_url_data")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error fetching table count:", error);
    return null;
  }

  console.log("Table row count:", count);

  return count;
}
