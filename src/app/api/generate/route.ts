import { generateSchema } from "@/lib/validations";
import { getGeminiClient } from "@/lib/gemini";
import { buildGenerationPrompt } from "@/lib/prompts";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = generateSchema.safeParse(body);

    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: parsed.error.issues[0].message }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { analysisResult, topic, keywords, requirements } = parsed.data;

    const client = getGeminiClient();
    const prompt = buildGenerationPrompt(
      analysisResult,
      topic,
      keywords,
      requirements
    );

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await client.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: prompt,
          });

          for await (const chunk of response) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(new TextEncoder().encode(text));
            }
          }

          controller.close();
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "생성 중 오류가 발생했습니다.";
          controller.enqueue(
            new TextEncoder().encode(`\n\n[오류] ${message}`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "요청 처리 중 오류";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
