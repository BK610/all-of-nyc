import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase_client = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/** Defines an endpoint at `https://allof.nyc/api?{URL parameters}/` to get the list of URLs
 * from the Supabase database, using the provided URL parameters.
 *
 * The URL parameters include:
 * @param pageIndex: The index of the page to return. Primarily used during pagination. New searches reset this to 1.
 * @param pageSize: The number of URLs to return per page.
 * @param query: The provided search query to filter the returned URLs.
 */
export async function GET(request) {
  const [pageIndex, pageSize, query] = getUrlParams(request);

  const urls = await fetchData(pageIndex, pageSize, query);
  const total = await getTableCount(query);
  const currentPage = pageIndex;
  const totalPages = Math.ceil(total / pageSize);

  return NextResponse.json({
    urls: urls,
    total: total,
    currentPage: currentPage,
    totalPages: totalPages,
  });
}

/** Helper function to get the URL parameter values from the provided request. */
function getUrlParams(request) {
  const pageIndex = parseInt(
    request.nextUrl.searchParams.get("pageIndex") || "1"
  );
  const pageSize = parseInt(
    request.nextUrl.searchParams.get("pageSize") || "15"
  );
  const query = request.nextUrl.searchParams.get("query")?.toLowerCase() || "";

  return [pageIndex, pageSize, query];
}

/** Fetch all available data from Supabase.
 *
 * Fetches data in batches of 1000 rows, as Supabase has a default limit of 1000 rows per request.
 * Repeats until all data is fetched.
 */
async function fetchData(pageIndex, pageSize, query) {
  const startSearchIndex = (pageIndex - 1) * pageSize;
  const endSearchIndex = startSearchIndex + (pageSize - 1);

  const { data, error } = await supabase_client
    .from("enriched_url_data")
    .select("*")
    .ilike("domain_name", `%${query}%`)
    .range(startSearchIndex, endSearchIndex);

  if (error) {
    console.error("Error fetching data:", error);
    return null;
  }

  return data;
}

/** Helper function to get the total count of rows that match the query. */
async function getTableCount(query) {
  const { count, error } = await supabase_client
    .from("enriched_url_data")
    .select("*", { count: "exact", head: true })
    .ilike("domain_name", `%${query}%`);

  if (error) {
    console.error("Error fetching table count:", error);
    return null;
  }

  //   console.log("Table row count:", count);

  return count;
}
