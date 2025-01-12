import Home from "./components/home";
import { createClient } from "@supabase/supabase-js";

export default async function Page() {
  return <Home />;
}

const supabaseClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// The following code represents an attempt to fetch all data from Supabase server-side,
// to improve the client experience by improved performance. Unfortunately, the amount of
// data that was requested to be fetched server-side (i.e. the entire database) exceeds
// Vercel's limit of ~20MB (see https://vercel.link/oversized-isr-page), so building
// fails. Instead, a simplified, lightweight API route in app/api/route.js reduces the
// complexity of the site and provides a still-fast client experience.

// /** Fetch all available data from Supabase.
//  *
//  * Fetches data in batches of 1000 rows, as Supabase has a default limit of 1000 rows per request.
//  * Repeats until all data is fetched.
//  */
// async function fetchData() {
//   let index = 0;
//   const increment = 10000;
//   const count = await getTableCount();

//   let allData = [];

//   while (index < count) {
//     console.log(
//       "Fetching rows",
//       index,
//       "to",
//       Math.min(index + increment - 1, count)
//     );

//     const { data, error } = await supabaseClient
//       .from("enriched_url_data")
//       .select("*")
//       .range(index, index + increment - 1)
//       .csv();

//     if (error) {
//       console.error("Error fetching data:", error);
//       return null;
//     }

//     const newData = Papa.parse(data, {
//       header: true,
//       skipEmptyLines: true,
//     }).data;

//     allData = allData.concat(newData);

//     index += increment;
//   }

//   return allData;
// }

// /** Helper function to get the total count of rows in the table. */
// async function getTableCount() {
//   const { count, error } = await supabaseClient
//     .from("enriched_url_data")
//     .select("*", { count: "exact", head: true });

//   if (error) {
//     console.error("Error fetching table count:", error);
//     return null;
//   }

//   console.log("Table row count:", count);

//   return count;
// }
