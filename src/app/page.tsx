import { Suspense } from "react";
import { DailyPrompt } from "@/components/daily-prompt";
import { TaskBoard } from "@/components/task-board";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto w-full max-w-5xl px-6 pt-12 pb-8 sm:pt-16">
        <p className="text-sm font-medium tracking-[0.18em] text-[#0f6e56] uppercase">
          Vercel demo
        </p>
        <h1 className="mt-3 max-w-xl font-serif text-5xl leading-none text-[#1f1a14] sm:text-6xl">
          Field Notes
        </h1>
        <p className="mt-4 max-w-xl text-lg text-[#6d6256]">
          A one-page checklist. The prompt is rendered on the server. The list
          stays in this browser.
        </p>
      </header>
      <main className="mx-auto grid w-full max-w-5xl flex-1 items-start gap-6 px-6 pb-16 lg:grid-cols-2">
        <Suspense
          fallback={
            <section className="rounded-3xl border border-[#e4d7c3] bg-[#fffaf3] p-8 text-sm text-[#6d6256]">
              Loading today&apos;s prompt…
            </section>
          }
        >
          <DailyPrompt />
        </Suspense>
        <TaskBoard />
      </main>
    </div>
  );
}
