"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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
  const targetDate = str(formData, "target_date");
  if (!lifeAreaId || !title) throw new Error("Missing fields");

  const { error } = await supabase.from("goals").insert({
    user_id: userId,
    life_area_id: lifeAreaId,
    title,
    target_date: targetDate,
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
  const targetDate = str(formData, "target_date");
  if (!title) throw new Error("Title is required");

  const { error } = await supabase
    .from("goals")
    .update({ title, target_date: targetDate })
    .eq("id", goalId);
  if (error) throw error;

  revalidatePath("/", "layout");
}

export async function deleteGoal(goalId: string) {
  const { supabase } = await requireUserId();
  const { error } = await supabase
    .from("goals")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", goalId);
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
  if (!lifeAreaId || !name) throw new Error("Missing fields");

  const { error } = await supabase.from("projects").insert({
    user_id: userId,
    life_area_id: lifeAreaId,
    goal_id: goalId,
    name,
    description,
    due_date: dueDate,
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
  if (!name) throw new Error("Name is required");

  const { error } = await supabase
    .from("projects")
    .update({ name, description, due_date: dueDate, goal_id: goalId })
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
  if (!lifeAreaId || !title) throw new Error("Missing fields");

  const { error } = await supabase.from("tasks").insert({
    user_id: userId,
    life_area_id: lifeAreaId,
    project_id: projectId,
    title,
    due_date: dueDate,
    priority,
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
  if (!title) throw new Error("Title is required");

  const { error } = await supabase
    .from("tasks")
    .update({
      title,
      due_date: dueDate,
      priority,
      project_id: projectId,
    })
    .eq("id", taskId);
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
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/", "layout");
}
