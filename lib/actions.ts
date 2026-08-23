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
  if (!name) throw new Error("Name is required");

  const { error } = await supabase
    .from("life_areas")
    .insert({ user_id: userId, name, color });
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

// --- Projects ---

export async function createProject(formData: FormData) {
  const { supabase, userId } = await requireUserId();
  const lifeAreaId = str(formData, "life_area_id");
  const goalId = str(formData, "goal_id");
  const name = str(formData, "name");
  if (!lifeAreaId || !name) throw new Error("Missing fields");

  const { error } = await supabase.from("projects").insert({
    user_id: userId,
    life_area_id: lifeAreaId,
    goal_id: goalId,
    name,
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
  const { supabase, userId } = await requireUserId();
  const today = new Date().toISOString().slice(0, 10);

  if (done) {
    const { error } = await supabase
      .from("habit_logs")
      .upsert(
        { user_id: userId, habit_id: habitId, log_date: today, done: true },
        { onConflict: "habit_id,log_date" },
      );
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("habit_logs")
      .delete()
      .eq("habit_id", habitId)
      .eq("log_date", today);
    if (error) throw error;
  }

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

// --- Knowledge notes ---

export async function createNote(formData: FormData) {
  const { supabase, userId } = await requireUserId();
  const title = str(formData, "title");
  const body = str(formData, "body");
  if (!title || !body) throw new Error("Missing fields");

  const { error } = await supabase.from("knowledge_notes").insert({
    user_id: userId,
    title,
    body,
  });
  if (error) throw error;

  revalidatePath("/notes", "layout");
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
