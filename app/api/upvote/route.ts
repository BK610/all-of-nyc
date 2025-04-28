import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain");
  const sessionId = searchParams.get("sessionId");
  const check = searchParams.get("check");

  if (!domain || !sessionId) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  if (check === "true") {
    // Check if this session has upvoted this domain
    const { data: upvote } = await supabase
      .from("upvotes")
      .select("*")
      .eq("domain_name", domain)
      .eq("session_id", sessionId)
      .single();

    return NextResponse.json({ hasUpvoted: !!upvote });
  }

  // Get current upvotes count
  const { data: domainData } = await supabase
    .from("enriched_url_data")
    .select("upvotes")
    .eq("domain_name", domain)
    .single();

  return NextResponse.json({ upvotes: domainData?.upvotes || 0 });
}

export async function POST(request: Request) {
  try {
    const { domain, sessionId } = await request.json();

    if (!domain || !sessionId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Check if already upvoted
    const { data: existingUpvote } = await supabase
      .from("upvotes")
      .select("*")
      .eq("domain_name", domain)
      .eq("session_id", sessionId)
      .single();

    if (existingUpvote) {
      return NextResponse.json({ error: "Already upvoted" }, { status: 400 });
    }

    // Start a transaction to ensure atomicity
    const { data: upvoteResult, error: upvoteError } = await supabase.rpc(
      "increment_upvotes",
      { p_domain_name: domain }
    );

    if (upvoteError) {
      console.error("Error incrementing upvotes:", upvoteError);
      throw upvoteError;
    }

    // Record the upvote
    const { error: insertError } = await supabase
      .from("upvotes")
      .insert({ domain_name: domain, session_id: sessionId });

    if (insertError) {
      console.error("Error recording upvote:", insertError);
      throw insertError;
    }

    return NextResponse.json({ upvotes: upvoteResult });
  } catch (error) {
    console.error("Error processing upvote:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
