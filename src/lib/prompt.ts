import { connection } from "next/server";

const PROMPTS = [
  "Ship one small thing before the day fills up.",
  "Write the note you have been postponing.",
  "Clear one tab, one file, or one decision.",
  "Leave the next person a clearer starting point.",
  "Pick the task that unblocks someone else.",
  "Name the risk out loud, then shrink it.",
  "Finish the draft. Polish can wait until tomorrow.",
  "Delete something that no longer earns its place.",
  "Ask the question you have been circling.",
  "Make the happy path obvious in one sentence.",
] as const;

export type DailyPrompt = {
  prompt: string;
  date: string;
  timeZone: "Asia/Kolkata";
};

export async function getDailyPrompt(): Promise<DailyPrompt> {
  await connection();
  const now = new Date();
  const index = dayOfYearInKolkata(now);

  return {
    prompt: PROMPTS[index % PROMPTS.length],
    date: new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(now),
    timeZone: "Asia/Kolkata",
  };
}

function dayOfYearInKolkata(now: Date) {
  const formatted = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  const [year, month, day] = formatted.split("-").map(Number);
  const start = Date.UTC(year, 0, 1);
  const current = Date.UTC(year, month - 1, day);
  return Math.floor((current - start) / 86_400_000);
}
