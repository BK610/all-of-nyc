import Home from "./components/home";
import { createClient } from "@supabase/supabase-js";

export default async function Page(): Promise<React.ReactElement> {
  const initialUrls = await fetchInitialData();
  const initialTotalCount = await getTableCount();

  return (
    <Home initialUrls={initialUrls} initialTotalCount={initialTotalCount} />
  );
}

// The following code represents an attempt to fetch all data from Supabase server-side,
//   to improve the client experience by improved performance. Unfortunately, the amount of
//   data that was requested to be fetched server-side (i.e. the entire database) exceeds
//   Vercel's limit of ~20MB (see https://vercel.link/oversized-isr-page), so building
//   fails. Instead, a simplified, lightweight API route in app/api/route.js reduces the
//   complexity of the site and provides a still-fast client experience.
// Update, Jan 12 2025: Edited the original code for fetching all data server-side to
//   only fetch the first page of data.

const supabaseClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/** Fetch all available data from Supabase.
 *
 * Fetches data in batches of 1000 rows, as Supabase has a default limit of 1000 rows per request.
 * Repeats until all data is fetched.
 */
async function fetchInitialData(): Promise<[any]> {
  const { data, error } = await supabaseClient
    .from("enriched_url_data")
    .select("*")
    .range(0, 14)
    .csv();

  if (error) {
    console.error("Error fetching data:", error);
    return null;
  }

  // console.log("Fetched:", data);
  return [data];
}

/** Helper function to get the total count of rows in the table. */
async function getTableCount(): Promise<number> {
  const { count, error } = await supabaseClient
    .from("enriched_url_data")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error fetching table count:", error);
    return null;
  }

  // console.log("Table row count:", count);

  return count;
}
