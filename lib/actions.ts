"use server";

import { revalidatePath } from "next/cache";
import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { type GoalPeriodType, parentTierFor, descendantIds } from "@/lib/goals";

function createAdminClient() {
  return createSupabaseJsClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

async function requireUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return { supabase, userId: user.id };
}

function str(formData: FormData, key: string) {
  const v = formData.get(key);
  return typeof v === "string" && v.trim() !== "" ? v.trim() : null;
}

// --- Life areas ---

export async function createLifeArea(formData: FormData) {
  const { supabase, userId } = await requireUserId();
  const name = str(formData, "name");
  const color = str(formData, "color");
  const showMeetings = formData.get("show_meetings") === "on";
  const showFiles = formData.get("show_files") === "on";
  if (!name) throw new Error("Name is required");

  const { error } = await supabase.from("life_areas").insert({
    user_id: userId,
    name,
    color,
    show_meetings: showMeetings,
    show_files: showFiles,
  });
  if (error) throw error;

  revalidatePath("/", "layout");
}

export async function updateLifeArea(areaId: string, formData: FormData) {
  const { supabase } = await requireUserId();
  const name = str(formData, "name");
  const color = str(formData, "color");
  const showMeetings = formData.get("show_meetings") === "on";
  const showFiles = formData.get("show_files") === "on";
  if (!name) throw new Error("Name is required");

  const { error } = await supabase
    .from("life_areas")
    .update({
      name,
      color,
      show_meetings: showMeetings,
      show_files: showFiles,
    })
    .eq("id", areaId);
  if (error) throw error;

  revalidatePath("/", "layout");
}

export async function deleteLifeArea(areaId: string) {
  const { supabase } = await requireUserId();
  const now = new Date().toISOString();

  const { error: projectsError } = await supabase
    .from("projects")
    .update({ deleted_at: now })
    .eq("life_area_id", areaId)
    .is("deleted_at", null);
  if (projectsError) throw projectsError;

  const { error: tasksError } = await supabase
    .from("tasks")
    .update({ deleted_at: now })
    .eq("life_area_id", areaId)
    .is("deleted_at", null);
  if (tasksError) throw tasksError;

  const { error } = await supabase
    .from("life_areas")
    .update({ deleted_at: now })
    .eq("id", areaId);
  if (error) throw error;

  revalidatePath("/", "layout");
}

// --- Goals ---

export async function createGoal(formData: FormData) {
  const { supabase, userId } = await requireUserId();
  const lifeAreaId = str(formData, "life_area_id");
  const title = str(formData, "title");
  const description = str(formData, "description");
  const targetDate = str(formData, "target_date");
  const periodType = (str(formData, "period_type") ??
    "yearly") as GoalPeriodType;
  const parentGoalId = str(formData, "parent_goal_id");
  const periodStart = str(formData, "period_start");
  const periodEnd = str(formData, "period_end");
  if (!title) throw new Error("Missing fields");

  if (parentGoalId) {
    const { data: parent } = await supabase
      .from("goals")
      .select("period_type")
      .eq("id", parentGoalId)
      .single();
    if (!parent || parent.period_type !== parentTierFor(periodType)) {
      throw new Error("Invalid parent goal for this period type");
    }
  }

  const { error } = await supabase.from("goals").insert({
    user_id: userId,
    life_area_id: lifeAreaId,
    title,
    description,
    target_date: targetDate,
    period_type: periodType,
    parent_goal_id: parentGoalId,
    period_start: periodStart,
    period_end: periodEnd,
  });
  if (error) throw error;

  revalidatePath("/", "layout");
}

export async function updateGoalStatus(goalId: string, status: string) {
  const { supabase } = await requireUserId();
  const { error } = await supabase
    .from("goals")
    .update({ status })
    .eq("id", goalId);
  if (error) throw error;
  revalidatePath("/", "layout");
}

export async function updateGoal(goalId: string, formData: FormData) {
  const { supabase } = await requireUserId();
  const title = str(formData, "title");
  const description = str(formData, "description");
  const targetDate = str(formData, "target_date");
  const lifeAreaId = str(formData, "life_area_id");
  const parentGoalId = str(formData, "parent_goal_id");
  const periodStart = str(formData, "period_start");
  const periodEnd = str(formData, "period_end");
  if (!title) throw new Error("Title is required");

  if (parentGoalId) {
    const { data: current } = await supabase
      .from("goals")
      .select("period_type")
      .eq("id", goalId)
      .single();
    const { data: parent } = await supabase
      .from("goals")
      .select("period_type")
      .eq("id", parentGoalId)
      .single();
    if (
      !current ||
      !parent ||
      parent.period_type !== parentTierFor(current.period_type as GoalPeriodType)
    ) {
      throw new Error("Invalid parent goal for this period type");
    }
  }

  const { error } = await supabase
    .from("goals")
    .update({
      title,
      description,
      target_date: targetDate,
      life_area_id: lifeAreaId,
      parent_goal_id: parentGoalId,
      period_start: periodStart,
      period_end: periodEnd,
    })
    .eq("id", goalId);
  if (error) throw error;

  revalidatePath("/", "layout");
}

export async function deleteGoal(goalId: string) {
  const { supabase, userId } = await requireUserId();
  const { data: allGoals } = await supabase
    .from("goals")
    .select("id, parent_goal_id")
    .is("deleted_at", null)
    .eq("user_id", userId);

  const ids = new Set(descendantIds(goalId, allGoals ?? []));
  ids.add(goalId);

  const { error } = await supabase
    .from("goals")
    .update({ deleted_at: new Date().toISOString() })
    .in("id", Array.from(ids));
  if (error) throw error;
  revalidatePath("/", "layout");
}

// --- Projects ---

export async function createProject(formData: FormData) {
  const { supabase, userId } = await requireUserId();
  const lifeAreaId = str(formData, "life_area_id");
  const goalId = str(formData, "goal_id");
  const name = str(formData, "name");
  const description = str(formData, "description");
  const dueDate = str(formData, "due_date");
  const companyId = str(formData, "company_id");
  if (!lifeAreaId || !name) throw new Error("Missing fields");

  const { error } = await supabase.from("projects").insert({
    user_id: userId,
    life_area_id: lifeAreaId,
    goal_id: goalId,
    name,
    description,
    due_date: dueDate,
    company_id: companyId,
  });
  if (error) throw error;

  revalidatePath("/", "layout");
}

export async function updateProjectStatus(projectId: string, status: string) {
  const { supabase } = await requireUserId();
  const { error } = await supabase
    .from("projects")
    .update({ status })
    .eq("id", projectId);
  if (error) throw error;
  revalidatePath("/", "layout");
}

export async function updateProject(projectId: string, formData: FormData) {
  const { supabase } = await requireUserId();
  const name = str(formData, "name");
  const description = str(formData, "description");
  const dueDate = str(formData, "due_date");
  const goalId = str(formData, "goal_id");
  const companyId = str(formData, "company_id");
  if (!name) throw new Error("Name is required");

  const { error } = await supabase
    .from("projects")
    .update({
      name,
      description,
      due_date: dueDate,
      goal_id: goalId,
      company_id: companyId,
    })
    .eq("id", projectId);
  if (error) throw error;

  revalidatePath("/", "layout");
}

export async function deleteProject(projectId: string) {
  const { supabase } = await requireUserId();
  const now = new Date().toISOString();

  const { error: tasksError } = await supabase
    .from("tasks")
    .update({ deleted_at: now })
    .eq("project_id", projectId)
    .is("deleted_at", null);
  if (tasksError) throw tasksError;

  const { error: milestonesError } = await supabase
    .from("project_milestones")
    .update({ deleted_at: now })
    .eq("project_id", projectId)
    .is("deleted_at", null);
  if (milestonesError) throw milestonesError;

  const { error } = await supabase
    .from("projects")
    .update({ deleted_at: now })
    .eq("id", projectId);
  if (error) throw error;

  revalidatePath("/", "layout");
}

// --- Tasks ---

export async function createTask(formData: FormData) {
  const { supabase, userId } = await requireUserId();
  const lifeAreaId = str(formData, "life_area_id");
  const projectId = str(formData, "project_id");
  const title = str(formData, "title");
  const dueDate = str(formData, "due_date");
  const priority = str(formData, "priority") ?? "medium";
  const assignedTo = str(formData, "assigned_to");
  const durationRaw = str(formData, "duration_minutes");
  const durationMinutes = durationRaw ? Number(durationRaw) : null;
  if (!lifeAreaId || !title) throw new Error("Missing fields");

  const { error } = await supabase.from("tasks").insert({
    user_id: userId,
    life_area_id: lifeAreaId,
    project_id: projectId,
    title,
    due_date: dueDate,
    priority,
    assigned_to: assignedTo,
    duration_minutes: durationMinutes,
  });
  if (error) throw error;

  revalidatePath("/", "layout");
}

export async function toggleTaskDone(taskId: string, done: boolean) {
  const { supabase } = await requireUserId();
  const { error } = await supabase
    .from("tasks")
    .update({
      status: done ? "done" : "todo",
      completed_at: done ? new Date().toISOString() : null,
    })
    .eq("id", taskId);
  if (error) throw error;
  revalidatePath("/", "layout");
}

export async function archiveTask(taskId: string) {
  const { supabase } = await requireUserId();
  const { error } = await supabase
    .from("tasks")
    .update({ status: "done" })
    .eq("id", taskId);
  if (error) throw error;
  revalidatePath("/", "layout");
}

export async function updateTask(taskId: string, formData: FormData) {
  const { supabase } = await requireUserId();
  const title = str(formData, "title");
  const dueDate = str(formData, "due_date");
  const priority = str(formData, "priority") ?? "medium";
  const projectId = str(formData, "project_id");
  const durationRaw = str(formData, "duration_minutes");
  if (!title) throw new Error("Title is required");

  const updates: Record<string, unknown> = {
    title,
    due_date: dueDate,
    priority,
    project_id: projectId,
    duration_minutes: durationRaw ? Number(durationRaw) : null,
  };
  // Only touch assigned_to when the form actually carries the field — the
  // area-level task editor doesn't show an assignee picker, and re-saving
  // from there must not silently clear an existing assignment.
  if (formData.has("assigned_to")) {
    updates.assigned_to = str(formData, "assigned_to");
  }

  const { error } = await supabase.from("tasks").update(updates).eq("id", taskId);
  if (error) throw error;

  revalidatePath("/", "layout");
}

export async function deleteTask(taskId: string) {
  const { supabase } = await requireUserId();
  const { error } = await supabase
    .from("tasks")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", taskId);
  if (error) throw error;
  revalidatePath("/", "layout");
}

// --- Habits ---

export async function createHabit(formData: FormData) {
  const { supabase, userId } = await requireUserId();
  const name = str(formData, "name");
  const frequency = str(formData, "frequency") ?? "daily";
  const lifeAreaId = str(formData, "life_area_id");
  if (!name) throw new Error("Name is required");

  const { error } = await supabase.from("habits").insert({
    user_id: userId,
    name,
    frequency,
    life_area_id: lifeAreaId,
  });
  if (error) throw error;

  revalidatePath("/habits", "layout");
}

export async function toggleHabitToday(habitId: string, done: boolean) {
  const today = new Date().toISOString().slice(0, 10);
  return toggleHabitLog(habitId, today, done);
}

export async function toggleHabitLog(
  habitId: string,
  date: string,
  done: boolean,
) {
  const { supabase, userId } = await requireUserId();

  if (done) {
    const { error } = await supabase
      .from("habit_logs")
      .upsert(
        { user_id: userId, habit_id: habitId, log_date: date, done: true },
        { onConflict: "habit_id,log_date" },
      );
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("habit_logs")
      .delete()
      .eq("habit_id", habitId)
      .eq("log_date", date);
    if (error) throw error;
  }

  revalidatePath("/habits", "layout");
}

export async function updateHabit(habitId: string, formData: FormData) {
  const { supabase } = await requireUserId();
  const name = str(formData, "name");
  const frequency = str(formData, "frequency") ?? "daily";
  if (!name) throw new Error("Name is required");

  const { error } = await supabase
    .from("habits")
    .update({ name, frequency })
    .eq("id", habitId);
  if (error) throw error;

  revalidatePath("/habits", "layout");
}

export async function deleteHabit(habitId: string) {
  const { supabase } = await requireUserId();
  const { error } = await supabase
    .from("habits")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", habitId);
  if (error) throw error;
  revalidatePath("/habits", "layout");
}

// --- Content ---

export async function createContentItem(formData: FormData) {
  const { supabase, userId } = await requireUserId();
  const title = str(formData, "title");
  const projectId = str(formData, "project_id");
  const lifeAreaId = str(formData, "life_area_id");
  if (!title) throw new Error("Title is required");

  const { error } = await supabase.from("content_items").insert({
    user_id: userId,
    title,
    project_id: projectId,
    life_area_id: lifeAreaId,
  });
  if (error) throw error;

  revalidatePath("/content", "layout");
}

export async function updateContentStatus(itemId: string, status: string) {
  const { supabase } = await requireUserId();
  const { error } = await supabase
    .from("content_items")
    .update({ status })
    .eq("id", itemId);
  if (error) throw error;
  revalidatePath("/content", "layout");
}

export async function updateContentItem(itemId: string, formData: FormData) {
  const { supabase } = await requireUserId();
  const title = str(formData, "title");
  const projectId = str(formData, "project_id");
  if (!title) throw new Error("Title is required");

  const { error } = await supabase
    .from("content_items")
    .update({ title, project_id: projectId })
    .eq("id", itemId);
  if (error) throw error;

  revalidatePath("/content", "layout");
}

export async function deleteContentItem(itemId: string) {
  const { supabase } = await requireUserId();
  const { error } = await supabase
    .from("content_items")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", itemId);
  if (error) throw error;
  revalidatePath("/content", "layout");
}

// --- Knowledge notes ---

export async function createNote(formData: FormData) {
  const { supabase, userId } = await requireUserId();
  const title = str(formData, "title");
  const body = str(formData, "body");
  const lifeAreaId = str(formData, "life_area_id");
  if (!title || !body) throw new Error("Missing fields");

  const { error } = await supabase.from("knowledge_notes").insert({
    user_id: userId,
    title,
    body,
    life_area_id: lifeAreaId,
  });
  if (error) throw error;

  revalidatePath("/", "layout");
}

export async function updateNote(noteId: string, formData: FormData) {
  const { supabase } = await requireUserId();
  const title = str(formData, "title");
  const body = str(formData, "body");
  if (!title || !body) throw new Error("Missing fields");

  const { error } = await supabase
    .from("knowledge_notes")
    .update({ title, body, updated_at: new Date().toISOString() })
    .eq("id", noteId);
  if (error) throw error;

  revalidatePath("/", "layout");
}

export async function deleteNote(noteId: string) {
  const { supabase } = await requireUserId();
  const { error } = await supabase
    .from("knowledge_notes")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", noteId);
  if (error) throw error;
  revalidatePath("/", "layout");
}

// --- Reviews ---

export async function createReview(formData: FormData) {
  const { supabase, userId } = await requireUserId();
  const type = str(formData, "type") ?? "daily";
  const periodStart = str(formData, "period_start");
  const periodEnd = str(formData, "period_end");
  const summary = str(formData, "summary");
  if (!periodStart || !periodEnd) throw new Error("Missing period");

  const { data: review, error } = await supabase
    .from("reviews")
    .insert({
      user_id: userId,
      type,
      period_start: periodStart,
      period_end: periodEnd,
      summary,
    })
    .select("id")
    .single();
  if (error) throw error;

  const items: { kind: string; content: string }[] = [];
  for (const kind of ["win", "blocker", "conflict", "priority_next"]) {
    const content = str(formData, kind);
    if (content) items.push({ kind, content });
  }
  if (items.length > 0) {
    const { error: itemsError } = await supabase.from("review_items").insert(
      items.map((item) => ({ ...item, review_id: review.id })),
    );
    if (itemsError) throw itemsError;
  }

  revalidatePath("/reviews", "layout");
  return review.id;
}

// --- Project milestones ---

export async function createMilestone(formData: FormData) {
  const { supabase, userId } = await requireUserId();
  const projectId = str(formData, "project_id");
  const title = str(formData, "title");
  const dueDate = str(formData, "due_date");
  if (!projectId || !title) throw new Error("Missing fields");

  const { error } = await supabase.from("project_milestones").insert({
    user_id: userId,
    project_id: projectId,
    title,
    due_date: dueDate,
  });
  if (error) throw error;

  revalidatePath("/", "layout");
}

export async function toggleMilestoneDone(milestoneId: string, done: boolean) {
  const { supabase } = await requireUserId();
  const { error } = await supabase
    .from("project_milestones")
    .update({ done })
    .eq("id", milestoneId);
  if (error) throw error;
  revalidatePath("/", "layout");
}

export async function updateMilestone(milestoneId: string, formData: FormData) {
  const { supabase } = await requireUserId();
  const title = str(formData, "title");
  const dueDate = str(formData, "due_date");
  if (!title) throw new Error("Title is required");

  const { error } = await supabase
    .from("project_milestones")
    .update({ title, due_date: dueDate })
    .eq("id", milestoneId);
  if (error) throw error;

  revalidatePath("/", "layout");
}

export async function deleteMilestone(milestoneId: string) {
  const { supabase } = await requireUserId();
  const { error } = await supabase
    .from("project_milestones")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", milestoneId);
  if (error) throw error;
  revalidatePath("/", "layout");
}

// --- Documents ---

const MAX_DOCUMENT_BYTES = 20 * 1024 * 1024;

export async function uploadDocument(formData: FormData) {
  const { supabase, userId } = await requireUserId();
  const file = formData.get("file");
  const lifeAreaId = str(formData, "life_area_id");
  const projectId = str(formData, "project_id");

  if (!(file instanceof File) || file.size === 0) {
    throw new Error("No file provided");
  }
  if (file.size > MAX_DOCUMENT_BYTES) {
    throw new Error("File too large");
  }

  const storagePath = `${userId}/${crypto.randomUUID()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(storagePath, file, { contentType: file.type || undefined });
  if (uploadError) throw uploadError;

  const { error } = await supabase.from("documents").insert({
    user_id: userId,
    life_area_id: lifeAreaId,
    project_id: projectId,
    file_name: file.name,
    storage_path: storagePath,
    file_type: file.type || null,
    size_bytes: file.size,
  });
  if (error) throw error;

  revalidatePath("/", "layout");
}

export async function deleteDocument(documentId: string) {
  const { supabase } = await requireUserId();
  const { error } = await supabase
    .from("documents")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", documentId);
  if (error) throw error;
  revalidatePath("/", "layout");
}

export async function getDocumentDownloadUrl(storagePath: string) {
  const { supabase } = await requireUserId();
  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(storagePath, 60);
  if (error) throw error;
  return data.signedUrl;
}

// --- Meetings ---

export async function createMeeting(formData: FormData) {
  const { supabase, userId } = await requireUserId();
  const title = str(formData, "title");
  const startsAt = str(formData, "starts_at");
  const endsAt = str(formData, "ends_at");
  const location = str(formData, "location");
  const notes = str(formData, "notes");
  const lifeAreaId = str(formData, "life_area_id");
  const projectId = str(formData, "project_id");
  if (!title || !startsAt) throw new Error("Missing fields");

  const { error } = await supabase.from("meetings").insert({
    user_id: userId,
    life_area_id: lifeAreaId,
    project_id: projectId,
    title,
    starts_at: startsAt,
    ends_at: endsAt,
    location,
    notes,
  });
  if (error) throw error;

  revalidatePath("/", "layout");
}

export async function updateMeeting(meetingId: string, formData: FormData) {
  const { supabase } = await requireUserId();
  const title = str(formData, "title");
  const startsAt = str(formData, "starts_at");
  const endsAt = str(formData, "ends_at");
  const location = str(formData, "location");
  const notes = str(formData, "notes");
  if (!title || !startsAt) throw new Error("Missing fields");

  const { error } = await supabase
    .from("meetings")
    .update({
      title,
      starts_at: startsAt,
      ends_at: endsAt,
      location,
      notes,
    })
    .eq("id", meetingId);
  if (error) throw error;

  revalidatePath("/", "layout");
}

export async function deleteMeeting(meetingId: string) {
  const { supabase } = await requireUserId();
  const { error } = await supabase
    .from("meetings")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", meetingId);
  if (error) throw error;
  revalidatePath("/", "layout");
}

// --- Entity links ---

const ENTITY_CONFIG: Record<string, { table: string; titleColumn: string }> = {
  life_area: { table: "life_areas", titleColumn: "name" },
  goal: { table: "goals", titleColumn: "title" },
  project: { table: "projects", titleColumn: "name" },
  task: { table: "tasks", titleColumn: "title" },
  habit: { table: "habits", titleColumn: "name" },
  content_item: { table: "content_items", titleColumn: "title" },
  knowledge_note: { table: "knowledge_notes", titleColumn: "title" },
  project_milestone: { table: "project_milestones", titleColumn: "title" },
  document: { table: "documents", titleColumn: "file_name" },
  meeting: { table: "meetings", titleColumn: "title" },
  finance_account: { table: "finance_accounts", titleColumn: "name" },
  financial_goal: { table: "financial_goals", titleColumn: "title" },
  company: { table: "companies", titleColumn: "name" },
};

export type EntitySearchResult = { type: string; id: string; label: string };

export async function searchEntities(
  query: string,
  excludeType: string,
  excludeId: string,
): Promise<EntitySearchResult[]> {
  const { supabase } = await requireUserId();
  if (query.trim().length < 2) return [];

  const results: EntitySearchResult[] = [];
  for (const [type, config] of Object.entries(ENTITY_CONFIG)) {
    const { data } = await supabase
      .from(config.table)
      .select("*")
      .ilike(config.titleColumn, `%${query}%`)
      .is("deleted_at", null)
      .limit(5);
    for (const row of data ?? []) {
      const r = row as unknown as Record<string, string>;
      if (type === excludeType && r.id === excludeId) continue;
      results.push({ type, id: r.id, label: r[config.titleColumn] });
    }
  }
  return results;
}

export async function createEntityLink(
  fromType: string,
  fromId: string,
  toType: string,
  toId: string,
  relationLabel: string | null,
) {
  const { supabase, userId } = await requireUserId();
  const { error } = await supabase.from("entity_links").insert({
    user_id: userId,
    from_type: fromType,
    from_id: fromId,
    to_type: toType,
    to_id: toId,
    relation_label: relationLabel,
  });
  if (error) throw error;
  revalidatePath("/", "layout");
}

export async function deleteEntityLink(linkId: string) {
  const { supabase } = await requireUserId();
  const { error } = await supabase
    .from("entity_links")
    .delete()
    .eq("id", linkId);
  if (error) throw error;
  revalidatePath("/", "layout");
}

export type ResolvedLink = {
  linkId: string;
  otherType: string;
  otherId: string;
  otherLabel: string;
  relationLabel: string | null;
};

export async function getEntityLinks(
  type: string,
  id: string,
): Promise<ResolvedLink[]> {
  const { supabase } = await requireUserId();
  const { data: links } = await supabase
    .from("entity_links")
    .select("id, from_type, from_id, to_type, to_id, relation_label")
    .or(
      `and(from_type.eq.${type},from_id.eq.${id}),and(to_type.eq.${type},to_id.eq.${id})`,
    );
  if (!links || links.length === 0) return [];

  const byType = new Map<string, Set<string>>();
  const others = links.map((link) => {
    const isFrom = link.from_type === type && link.from_id === id;
    const otherType = isFrom ? link.to_type : link.from_type;
    const otherId = isFrom ? link.to_id : link.from_id;
    if (!byType.has(otherType)) byType.set(otherType, new Set());
    byType.get(otherType)!.add(otherId);
    return { link, otherType, otherId };
  });

  const labelsByKey = new Map<string, string>();
  for (const [otherType, ids] of byType) {
    const config = ENTITY_CONFIG[otherType];
    if (!config) continue;
    const { data } = await supabase
      .from(config.table)
      .select("*")
      .in("id", Array.from(ids));
    for (const row of data ?? []) {
      const r = row as unknown as Record<string, string>;
      labelsByKey.set(`${otherType}:${r.id}`, r[config.titleColumn]);
    }
  }

  return others.map(({ link, otherType, otherId }) => ({
    linkId: link.id,
    otherType,
    otherId,
    otherLabel: labelsByKey.get(`${otherType}:${otherId}`) ?? "—",
    relationLabel: link.relation_label,
  }));
}

// --- Finance ---

export async function createFinanceAccount(formData: FormData) {
  const { supabase, userId } = await requireUserId();
  const name = str(formData, "name");
  const type = str(formData, "type") ?? "cash";
  const currency = str(formData, "currency") ?? "ILS";
  const openingBalance = Number(str(formData, "opening_balance") ?? "0");
  if (!name) throw new Error("Name is required");

  const { error } = await supabase.from("finance_accounts").insert({
    user_id: userId,
    name,
    type,
    currency,
    opening_balance: openingBalance,
  });
  if (error) throw error;
  revalidatePath("/finance", "layout");
}

export async function updateFinanceAccount(
  accountId: string,
  formData: FormData,
) {
  const { supabase } = await requireUserId();
  const name = str(formData, "name");
  const type = str(formData, "type") ?? "cash";
  const currency = str(formData, "currency") ?? "ILS";
  const openingBalance = Number(str(formData, "opening_balance") ?? "0");
  if (!name) throw new Error("Name is required");

  const { error } = await supabase
    .from("finance_accounts")
    .update({ name, type, currency, opening_balance: openingBalance })
    .eq("id", accountId);
  if (error) throw error;
  revalidatePath("/finance", "layout");
}

export async function deleteFinanceAccount(accountId: string) {
  const { supabase } = await requireUserId();
  const now = new Date().toISOString();
  const { error: txError } = await supabase
    .from("transactions")
    .update({ deleted_at: now })
    .eq("account_id", accountId)
    .is("deleted_at", null);
  if (txError) throw txError;
  const { error } = await supabase
    .from("finance_accounts")
    .update({ deleted_at: now })
    .eq("id", accountId);
  if (error) throw error;
  revalidatePath("/finance", "layout");
}

export async function createTransaction(formData: FormData) {
  const { supabase, userId } = await requireUserId();
  const accountId = str(formData, "account_id");
  const amount = Number(str(formData, "amount") ?? "0");
  const direction = str(formData, "direction") ?? "out";
  const category = str(formData, "category");
  const source = str(formData, "source");
  const occurredAt = str(formData, "occurred_at");
  const note = str(formData, "note");
  const lifeAreaId = str(formData, "life_area_id");
  const isRecurring = formData.get("is_recurring") === "on";
  const recurrenceRule = str(formData, "recurrence_rule");
  if (!accountId || !occurredAt || !amount) throw new Error("Missing fields");

  const { error } = await supabase.from("transactions").insert({
    user_id: userId,
    account_id: accountId,
    life_area_id: lifeAreaId,
    amount: Math.abs(amount),
    direction,
    category,
    source: direction === "in" ? source : null,
    occurred_at: occurredAt,
    note,
    is_recurring: isRecurring,
    recurrence_rule: recurrenceRule,
  });
  if (error) throw error;
  revalidatePath("/finance", "layout");
  revalidatePath("/", "layout");
}

export async function deleteTransaction(transactionId: string) {
  const { supabase } = await requireUserId();
  const { error } = await supabase
    .from("transactions")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", transactionId);
  if (error) throw error;
  revalidatePath("/finance", "layout");
}

export async function createBudget(formData: FormData) {
  const { supabase, userId } = await requireUserId();
  const category = str(formData, "category");
  const monthlyLimit = Number(str(formData, "monthly_limit") ?? "0");
  const lifeAreaId = str(formData, "life_area_id");
  if (!category || !monthlyLimit) throw new Error("Missing fields");

  const { error } = await supabase.from("budgets").insert({
    user_id: userId,
    category,
    monthly_limit: monthlyLimit,
    life_area_id: lifeAreaId,
  });
  if (error) throw error;
  revalidatePath("/finance", "layout");
}

export async function deleteBudget(budgetId: string) {
  const { supabase } = await requireUserId();
  const { error } = await supabase
    .from("budgets")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", budgetId);
  if (error) throw error;
  revalidatePath("/finance", "layout");
}

export async function createFinancialGoal(formData: FormData) {
  const { supabase, userId } = await requireUserId();
  const title = str(formData, "title");
  const targetAmount = Number(str(formData, "target_amount") ?? "0");
  const currentAmount = Number(str(formData, "current_amount") ?? "0");
  const targetDate = str(formData, "target_date");
  if (!title || !targetAmount) throw new Error("Missing fields");

  const { error } = await supabase.from("financial_goals").insert({
    user_id: userId,
    title,
    target_amount: targetAmount,
    current_amount: currentAmount,
    target_date: targetDate,
  });
  if (error) throw error;
  revalidatePath("/finance", "layout");
}

export async function updateFinancialGoal(
  goalId: string,
  formData: FormData,
) {
  const { supabase } = await requireUserId();
  const title = str(formData, "title");
  const targetAmount = Number(str(formData, "target_amount") ?? "0");
  const currentAmount = Number(str(formData, "current_amount") ?? "0");
  const targetDate = str(formData, "target_date");
  if (!title || !targetAmount) throw new Error("Missing fields");

  const { error } = await supabase
    .from("financial_goals")
    .update({
      title,
      target_amount: targetAmount,
      current_amount: currentAmount,
      target_date: targetDate,
    })
    .eq("id", goalId);
  if (error) throw error;
  revalidatePath("/finance", "layout");
}

export async function deleteFinancialGoal(goalId: string) {
  const { supabase } = await requireUserId();
  const { error } = await supabase
    .from("financial_goals")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", goalId);
  if (error) throw error;
  revalidatePath("/finance", "layout");
}

// --- Team workspace ---

export async function createCompany(formData: FormData) {
  const { supabase, userId } = await requireUserId();
  const name = str(formData, "name");
  if (!name) throw new Error("Name is required");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: company, error } = await supabase
    .from("companies")
    .insert({ owner_user_id: userId, name })
    .select("id")
    .single();
  if (error) throw error;

  const { error: memberError } = await supabase.from("team_members").insert({
    company_id: company.id,
    user_id: userId,
    email: user?.email ?? "",
    role: "owner",
    status: "active",
    joined_at: new Date().toISOString(),
  });
  if (memberError) throw memberError;

  revalidatePath("/companies", "layout");
  return company.id;
}

export async function deleteCompany(companyId: string) {
  const { supabase } = await requireUserId();
  const { error } = await supabase
    .from("companies")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", companyId);
  if (error) throw error;
  revalidatePath("/companies", "layout");
}

export async function inviteMember(
  companyId: string,
  email: string,
  position: string,
) {
  const { supabase } = await requireUserId();
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) throw new Error("Email is required");

  const { error } = await supabase.from("team_members").insert({
    company_id: companyId,
    email: trimmed,
    role: "member",
    status: "invited",
    position: position || "member",
  });
  if (error) throw error;
  revalidatePath("/companies", "layout");
}

export async function removeMember(memberId: string) {
  const { supabase } = await requireUserId();
  const { error } = await supabase
    .from("team_members")
    .update({ status: "removed" })
    .eq("id", memberId);
  if (error) throw error;
  revalidatePath("/companies", "layout");
}

export async function updateMemberPosition(memberId: string, position: string) {
  const { supabase } = await requireUserId();
  const { error } = await supabase
    .from("team_members")
    .update({ position })
    .eq("id", memberId);
  if (error) throw error;
  revalidatePath("/companies", "layout");
}

export async function updateCompany(companyId: string, formData: FormData) {
  const { supabase } = await requireUserId();
  const name = str(formData, "name");
  const foundedDate = str(formData, "founded_date");
  const description = str(formData, "description");
  const industry = str(formData, "industry");
  const contactEmail = str(formData, "contact_email");
  const contactPhone = str(formData, "contact_phone");
  if (!name) throw new Error("Name is required");

  const { error } = await supabase
    .from("companies")
    .update({
      name,
      founded_date: foundedDate,
      description,
      industry,
      contact_email: contactEmail,
      contact_phone: contactPhone,
    })
    .eq("id", companyId);
  if (error) throw error;
  revalidatePath("/companies", "layout");
}

// Runs with the service role so it can bypass RLS safely: the only input that
// matters is the CURRENT authenticated user's own verified email, never
// anything supplied by the caller — so it can only ever claim invites
// addressed to the person who is actually logged in.
export async function claimTeamInvites() {
  const { supabase, userId } = await requireUserId();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const email = user?.email?.toLowerCase();
  if (!email) return;

  const admin = createAdminClient();
  const { data: pending } = await admin
    .from("team_members")
    .select("id")
    .eq("email", email)
    .eq("status", "invited")
    .is("user_id", null);
  if (!pending || pending.length === 0) return;

  await admin
    .from("team_members")
    .update({
      user_id: userId,
      status: "active",
      joined_at: new Date().toISOString(),
    })
    .in(
      "id",
      pending.map((p) => p.id),
    );
}

export async function createProjectMessage(
  projectId: string,
  content: string,
) {
  const { supabase, userId } = await requireUserId();
  const trimmed = content.trim();
  if (!trimmed) throw new Error("Message is required");

  const { error } = await supabase.from("project_messages").insert({
    project_id: projectId,
    user_id: userId,
    content: trimmed,
  });
  if (error) throw error;
  revalidatePath("/", "layout");
}

// --- Personal settings ---

export async function upsertUserSettings(formData: FormData) {
  const { supabase, userId } = await requireUserId();
  const displayName = str(formData, "display_name");
  const accentColor = str(formData, "accent_color");

  const { error } = await supabase.from("user_settings").upsert({
    user_id: userId,
    display_name: displayName,
    accent_color: accentColor,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;

  revalidatePath("/", "layout");
}

// --- Onboarding ---

export async function completeOnboarding(formData: FormData) {
  const { supabase, userId } = await requireUserId();
  const raw = formData.get("areas");
  if (typeof raw !== "string") throw new Error("Missing areas");

  const areas = JSON.parse(raw) as {
    name: string;
    color: string;
    show_meetings: boolean;
    show_files: boolean;
  }[];
  const cleaned = areas
    .map((a) => ({ ...a, name: a.name.trim() }))
    .filter((a) => a.name.length > 0);
  if (cleaned.length === 0) throw new Error("Pick at least one area");

  const { error } = await supabase.from("life_areas").insert(
    cleaned.map((a, index) => ({
      user_id: userId,
      name: a.name,
      color: a.color,
      show_meetings: a.show_meetings,
      show_files: a.show_files,
      sort_order: index,
    })),
  );
  if (error) throw error;

  revalidatePath("/", "layout");
}

// --- Trash ---

const TRASH_TABLES = [
  "life_areas",
  "goals",
  "projects",
  "tasks",
  "habits",
  "content_items",
  "knowledge_notes",
  "project_milestones",
  "documents",
  "meetings",
  "finance_accounts",
  "transactions",
  "budgets",
  "financial_goals",
  "companies",
] as const;

type TrashTable = (typeof TRASH_TABLES)[number];

export async function restoreFromTrash(table: TrashTable, id: string) {
  const { supabase } = await requireUserId();
  if (!TRASH_TABLES.includes(table)) throw new Error("Invalid table");
  const { error } = await supabase
    .from(table)
    .update({ deleted_at: null })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/", "layout");
}

export async function purgeFromTrash(table: TrashTable, id: string) {
  const { supabase } = await requireUserId();
  if (!TRASH_TABLES.includes(table)) throw new Error("Invalid table");

  if (table === "documents") {
    const { data: doc } = await supabase
      .from("documents")
      .select("storage_path")
      .eq("id", id)
      .single();
    if (doc) {
      await supabase.storage.from("documents").remove([doc.storage_path]);
    }
  }

  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/", "layout");
}
