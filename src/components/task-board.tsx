"use client";

import { useMemo, useState, useSyncExternalStore, type FormEvent } from "react";

type Task = {
  id: string;
  title: string;
  done: boolean;
};

type Filter = "open" | "done" | "all";

const STORAGE_KEY = "field-notes-tasks:v1";
const EMPTY = "[]";

const listeners = new Set<() => void>();
let memory = EMPTY;

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? memory;
  } catch {
    return memory;
  }
}

function getServerSnapshot() {
  return EMPTY;
}

function saveTasks(tasks: Task[]) {
  memory = JSON.stringify(tasks);
  try {
    localStorage.setItem(STORAGE_KEY, memory);
  } catch {
    // Private browsing or a full quota can reject writes. The list still works for this visit.
  }
  for (const listener of listeners) {
    listener();
  }
}

export function TaskBoard() {
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const tasks = useMemo(() => parseTasks(stored), [stored]);
  const [draft, setDraft] = useState("");
  const [filter, setFilter] = useState<Filter>("open");

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = draft.trim();
    if (!title) {
      return;
    }

    saveTasks([{ id: crypto.randomUUID(), title, done: false }, ...tasks]);
    setDraft("");
    setFilter("open");
  }

  function toggleTask(id: string) {
    saveTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );
  }

  function removeTask(id: string) {
    saveTasks(tasks.filter((task) => task.id !== id));
  }

  function clearDone() {
    saveTasks(tasks.filter((task) => !task.done));
  }

  const openCount = tasks.filter((task) => !task.done).length;
  const doneCount = tasks.length - openCount;
  const visible = tasks.filter((task) => {
    if (filter === "open") {
      return !task.done;
    }
    if (filter === "done") {
      return task.done;
    }
    return true;
  });

  return (
    <section className="rounded-3xl border border-[#e4d7c3] bg-[#fffaf3] p-6 shadow-[0_16px_40px_-28px_rgba(31,26,20,0.7)] sm:p-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-[#1f1a14]">Your list</h2>
          <p className="mt-1 text-sm text-[#6d6256]" aria-live="polite">
            {openCount} open · {doneCount} done
          </p>
        </div>
        <button
          type="button"
          className="text-sm text-[#6d6256] underline decoration-[#e4d7c3] underline-offset-4 hover:text-[#1f1a14] disabled:cursor-not-allowed disabled:opacity-40"
          onClick={clearDone}
          disabled={doneCount === 0}
        >
          Clear done
        </button>
      </div>

      <form className="mt-6 flex gap-2" onSubmit={addTask}>
        <label className="sr-only" htmlFor="task-title">
          New task
        </label>
        <input
          id="task-title"
          className="min-w-0 flex-1 rounded-full border border-[#e4d7c3] bg-white px-4 py-3 text-[#1f1a14] outline-none placeholder:text-[#a89884] focus:border-[#0f6e56]"
          value={draft}
          maxLength={140}
          placeholder="Add something small"
          onChange={(event) => setDraft(event.target.value)}
        />
        <button
          type="submit"
          className="rounded-full bg-[#0f6e56] px-5 py-3 text-sm font-medium text-[#fffaf3] hover:bg-[#0c5a47] disabled:cursor-not-allowed disabled:opacity-40"
          disabled={draft.trim().length === 0}
        >
          Add
        </button>
      </form>

      <div className="mt-5 flex gap-2" role="group" aria-label="Filter tasks">
        {(
          [
            ["open", "Open"],
            ["done", "Done"],
            ["all", "All"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            className={`rounded-full px-3 py-1.5 text-sm ${
              filter === value
                ? "bg-[#1f1a14] text-[#fffaf3]"
                : "bg-[#f4efe6] text-[#6d6256] hover:text-[#1f1a14]"
            }`}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-8 text-sm text-[#6d6256]">
          {filter === "done"
            ? "Nothing finished yet."
            : "Nothing here yet. Add the one thing you want finished."}
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-[#efe4d4]">
          {visible.map((task) => (
            <li key={task.id} className="flex items-center gap-3 py-3">
              <input
                id={`task-${task.id}`}
                type="checkbox"
                className="size-4 accent-[#0f6e56]"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
              />
              <label
                htmlFor={`task-${task.id}`}
                className={`min-w-0 flex-1 text-[#1f1a14] ${
                  task.done ? "text-[#a89884] line-through" : ""
                }`}
              >
                {task.title}
              </label>
              <button
                type="button"
                className="text-sm text-[#a89884] hover:text-[#e26d3a]"
                aria-label={`Remove ${task.title}`}
                onClick={() => removeTask(task.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function parseTasks(raw: string): Task[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isTask);
  } catch {
    return [];
  }
}

function isTask(value: unknown): value is Task {
  if (!value || typeof value !== "object") {
    return false;
  }
  const task = value as Partial<Task>;
  return (
    typeof task.id === "string" &&
    typeof task.title === "string" &&
    typeof task.done === "boolean"
  );
}
