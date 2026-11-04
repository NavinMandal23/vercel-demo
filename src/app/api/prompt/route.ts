import { getDailyPrompt } from "@/lib/prompt";

export async function GET() {
  return Response.json(await getDailyPrompt());
}
