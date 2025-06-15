import { prettyObject } from "@/app/utils/format";
import { NextRequest, NextResponse } from "next/server";

export async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  console.log("[Assistants API Route] params ", params);

  if (req.method === "OPTIONS") {
    return NextResponse.json({ body: "OK" }, { status: 200 });
  }

  try {
    const assistantId = process.env.OPENAI_ASSISTANT_ID;
    const body = await req.json();

    const threadRes = await fetch("https://api.openai.com/v1/threads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    const thread = await threadRes.json();

    await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        role: "user",
        content: body.prompt || "Hi",
      }),
    });

    await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        assistant_id: assistantId,
      }),
    });

    return NextResponse.json({ threadId: thread.id, status: "run started" });

  } catch (e) {
    console.error("[OpenAI Assistants Error] ", e);
    return NextResponse.json(prettyObject(e));
  }
}
