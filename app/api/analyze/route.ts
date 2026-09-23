import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 120;

type Provider = "gemini" | "ollama";

interface AnalyzeRequestBody {
  provider: Provider;
  model: string;
  prompt: string;
  image: string; // base64 without data URL prefix
  mediaType?: string;
}

interface AIAnalysisFinding {
  title: string;
  description: string;
  confidence: number;
  category: string;
}

interface AIAnalysisResult {
  findings: AIAnalysisFinding[];
  summary?: string;
}

const FINDINGS_SCHEMA = {
  type: "object",
  properties: {
    summary: {
      type: "string",
      description: "Short overall summary of what is visible in the image.",
    },
    findings: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Short name of the suspected visual finding.",
          },
          description: {
            type: "string",
            description:
              "Evidence visible in the image. Do not claim illegality.",
          },
          confidence: {
            type: "integer",
            description: "Visual confidence from 0 to 100.",
          },
          category: {
            type: "string",
            description:
              "Finding category such as excavation, road, vegetation_clearance, tailings, water_disturbance, or other.",
          },
        },
        required: ["title", "description", "confidence", "category"],
      },
    },
  },
  required: ["summary", "findings"],
};

function normalizeResult(value: unknown): AIAnalysisResult {
  if (!value || typeof value !== "object") {
    return {
      summary: "",
      findings: [],
    };
  }

  const obj = value as Record<string, unknown>;

  const findings = Array.isArray(obj.findings)
    ? obj.findings
        .filter(
          (item): item is Record<string, unknown> =>
            !!item && typeof item === "object",
        )
        .map((item) => ({
          title:
            typeof item.title === "string"
              ? item.title
              : "Possible visual finding",

          description:
            typeof item.description === "string" ? item.description : "",

          confidence: Math.max(0, Math.min(100, Number(item.confidence) || 0)),

          category: typeof item.category === "string" ? item.category : "other",
        }))
        .filter((item) => item.title.trim() && item.description.trim())
    : [];

  return {
    summary: typeof obj.summary === "string" ? obj.summary : "",
    findings,
  };
}

function parseJson(text: string): AIAnalysisResult {
  try {
    return normalizeResult(JSON.parse(text));
  } catch {
    // Some local models occasionally wrap JSON in markdown.
    const match = text.match(/\{[\s\S]*\}/);

    if (match) {
      try {
        return normalizeResult(JSON.parse(match[0]));
      } catch {
        // fall through
      }
    }

    return {
      summary: text,
      findings: [],
    };
  }
}

async function analyzeWithOllama({
  model,
  prompt,
  image,
}: {
  model: string;
  prompt: string;
  image: string;
}): Promise<AIAnalysisResult> {
  const ollamaUrl = process.env.OLLAMA_URL || "http://127.0.0.1:11434";

  const response = await fetch(`${ollamaUrl}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,

      stream: false,

      format: FINDINGS_SCHEMA,

      messages: [
        {
          role: "system",
          content:
            "You are a visual analysis assistant. Return only the requested JSON structure.",
        },
        {
          role: "user",
          content: prompt,
          images: [image],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Ollama returned HTTP ${response.status}: ${errorText.slice(0, 1000)}`,
    );
  }

  const data = await response.json();

  const text = data?.message?.content ?? "";

  if (!text) {
    throw new Error("Ollama returned an empty response.");
  }

  return parseJson(text);
}

const FREE_MODEL_CHAIN = [
  "openrouter/free",
  "qwen/qwen3-vl-235b-thinking:free",
  "google/gemma-3-27b-it:free",
];

async function analyzeWithOpenRouter({
  prompt,
  image,
  mediaType,
  modelsToTry = FREE_MODEL_CHAIN,
}: {
  prompt: string;
  image: string;
  mediaType: string;
  modelsToTry?: string[];
}): Promise<AIAnalysisResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not configured.");
  if (!image)
    throw new Error("No image data provided to analyzeWithOpenRouter.");

  const body = (model: string) =>
    JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: { url: `data:${mediaType};base64,${image}` },
            },
          ],
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "findings",
          strict: true,
          schema: FINDINGS_SCHEMA,
        },
      },
    });

  let lastError: Error | undefined;

  for (const model of modelsToTry) {
    const maxRetries = 1; // 1 quick retry per model, then move on
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Project Lalibela",
          },
          body: body(model),
        },
      );

      if (response.ok) {
        const data = await response.json();
        const text = data?.choices?.[0]?.message?.content ?? "";
        if (!text) {
          lastError = new Error(
            `OpenRouter (${model}) returned an empty response.`,
          );
          break; // don't retry empty-content, try next model
        }
        return parseJson(text);
      }

      const errorText = await response.text();
      lastError = new Error(
        `OpenRouter (${model}) returned HTTP ${response.status}: ${errorText.slice(0, 800)}`,
      );

      // 429/503 from the upstream provider: one short retry, then give up on this model
      const isRetryable = [429, 502, 503].includes(response.status);
      if (!isRetryable || attempt === maxRetries) break;

      await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1000));
    }
    // loop continues to next model in the chain
  }

  throw lastError ?? new Error("All OpenRouter free models failed.");
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AnalyzeRequestBody;

    const { provider, model, prompt, image, mediaType = "image/jpeg" } = body;

    if (!provider || !model || !prompt || !image) {
      return NextResponse.json(
        {
          error: "provider, model, prompt and image are required.",
        },
        { status: 400 },
      );
    }

    let result: AIAnalysisResult;

    if (provider === "gemini") {
      result = await analyzeWithOpenRouter({
        prompt,
        image,
        mediaType,
      });
    } else if (provider === "ollama") {
      result = await analyzeWithOllama({
        model,
        prompt,
        image,
      });
    } else {
      return NextResponse.json(
        {
          error: `Unsupported provider: ${provider}`,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      provider,
      model,
      ...result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown AI analysis error";

    console.error("AI analysis error:", error);

    return NextResponse.json(
      {
        error: message,
      },
      { status: 502 },
    );
  }
}
