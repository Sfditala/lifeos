import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const TABLES = [
  "life_areas",
  "goals",
  "projects",
  "tasks",
  "habits",
  "content_items",
  "knowledge_notes",
  "project_milestones",
] as const;

const GRACE_DAYS = 30;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const cutoff = new Date(
    Date.now() - GRACE_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();

  const results: Record<string, number> = {};

  for (const table of TABLES) {
    const { error, count } = await supabase
      .from(table)
      .delete({ count: "exact" })
      .lt("deleted_at", cutoff);
    if (error) {
      return NextResponse.json({ error: error.message, table }, { status: 500 });
    }
    results[table] = count ?? 0;
  }

  return NextResponse.json({ status: "ok", purged: results });
}
