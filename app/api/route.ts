import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseClient: SupabaseClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

interface ApiResponseSignature {
  urls: Array<string>;
  total: number;
  currentPage: number;
  totalPages: number;
}

/** Defines an endpoint at `https://allof.nyc/api?{URL parameters}/` to get the list of URLs
 * from the Supabase database, using the provided URL parameters.
 *
 * The URL parameters include:
 * @param pageIndex: The index of the page to return. Primarily used during pagination. New searches reset this to 1.
 * @param pageSize: The number of URLs to return per page.
 * @param query: The provided search query to filter the returned URLs.
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponseSignature>> {
  const [pageIndex, pageSize, query, status] = getUrlParams(request);

  const urls = await fetchData(pageIndex, pageSize, query, status);
  const total = await getTableCount(query, status);
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
function getUrlParams(
  request: NextRequest
): [pageIndex: number, pageSize: number, query: string, status: string] {
  const pageIndex = parseInt(
    request.nextUrl.searchParams.get("pageIndex") || "1"
  );
  const pageSize = parseInt(
    request.nextUrl.searchParams.get("pageSize") || "15"
  );
  const query = request.nextUrl.searchParams.get("query")?.toLowerCase() || "";

  const statusSearchParam =
    request.nextUrl.searchParams.get("status")?.toLowerCase() || "";

  let status = "";

  if (statusSearchParam === "default") {
    status = "";
  } else {
    status = statusSearchParam;
  }

  return [pageIndex, pageSize, query, status];
}

/** Fetch all available data from Supabase.
 *
 * Fetches data in batches of 1000 rows, as Supabase has a default limit of 1000 rows per request.
 * Repeats until all data is fetched.
 */
async function fetchData(
  pageIndex: number,
  pageSize: number,
  query: string,
  status: string,
  sortBy: { fieldName: string; ascending: boolean } = {
    fieldName: "last_updated_at",
    ascending: false,
  }
): Promise<Array<any>> {
  const startSearchIndex = (pageIndex - 1) * pageSize;
  const endSearchIndex = startSearchIndex + (pageSize - 1);

  let supabaseQuery = supabaseClient
    .from("enriched_url_data")
    .select("*")
    .order(sortBy.fieldName, { ascending: sortBy.ascending })
    .ilike("domain_name", `%${query}%`);

  if (status) supabaseQuery = supabaseQuery.eq("website_status", status);

  supabaseQuery = supabaseQuery.range(startSearchIndex, endSearchIndex);

  const { data, error } = await supabaseQuery;

  if (error) {
    console.error("Error fetching data:", error);
    return null;
  }

  return data;
}

/** Helper function to get the total count of rows that match the query. */
async function getTableCount(query: string, status: string): Promise<number> {
  let supabaseQuery = supabaseClient
    .from("enriched_url_data")
    .select("*", { count: "exact", head: true })
    .ilike("domain_name", `%${query}%`);

  if (status) supabaseQuery = supabaseQuery.eq("website_status", status);

  const { count, error } = await supabaseQuery;

  if (error) {
    console.error("Error fetching table count:", error);
    return null;
  }

  //   console.log("Table row count:", count);

  return count;
}
