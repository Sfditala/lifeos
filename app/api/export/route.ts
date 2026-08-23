import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const TABLES = [
  "life_areas",
  "goals",
  "projects",
  "tasks",
  "habits",
  "habit_logs",
  "content_items",
  "knowledge_notes",
  "reviews",
  "review_items",
  "decisions",
] as const;

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const result: Record<string, unknown> = {};

  for (const table of TABLES) {
    const { data, error } = await supabase.from(table).select("*");
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    result[table] = data;
  }

  return new NextResponse(JSON.stringify(result, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="life-os-export-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
