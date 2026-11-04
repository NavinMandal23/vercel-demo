import { getDailyPrompt } from "@/lib/prompt";

export async function DailyPrompt() {
  const { prompt, date, timeZone } = await getDailyPrompt();

  return (
    <section className="rounded-3xl border border-[#e4d7c3] bg-[#fffaf3] p-6 shadow-[0_16px_40px_-28px_rgba(31,26,20,0.7)] sm:p-8">
      <p className="text-sm font-medium tracking-wide text-[#0f6e56] uppercase">
        Today&apos;s prompt
      </p>
      <p className="mt-3 font-serif text-3xl leading-tight text-[#1f1a14] sm:text-4xl">
        {prompt}
      </p>
      <p className="mt-6 text-sm text-[#6d6256]">
        {date}
        <span className="mx-2 text-[#c9bba6]">·</span>
        {timeZone}
      </p>
      <a
        className="mt-4 inline-flex text-sm font-medium text-[#1f1a14] underline decoration-[#e26d3a] decoration-2 underline-offset-4 hover:text-[#0f6e56]"
        href="/api/prompt"
      >
        Open the same prompt as JSON
      </a>
    </section>
  );
}
