import { callLangchainModel } from "../../../../lib/langchain";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json();
  const { question } = body;

  if (!question) {
    return NextResponse.json(
      { error: "No question provided" },
      { status: 400 }
    );
  }
  try {
    const result = await callLangchainModel(question);
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const words = Array.from(result);
        for (const word of words) {
          const chunk = encoder.encode(word);
          controller.enqueue(chunk);
          await new Promise((r) => setTimeout(r, 30));
        }
        controller.close();
      },
    });
    return new NextResponse(stream);
  } catch (error) {
    console.error(error);
    const e = error as { message?: string; status?: number; data?: unknown };
    return NextResponse.json(
      { error: "Server error", detail: e.message, status: e.status, data: e.data },
      { status: 500 }
    );
  }
}
