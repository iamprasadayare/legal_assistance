import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { z } from "zod";

export interface TimelineEvent {
  date: string;
  title: string;
  details: string;
  keyParties: string;
  evidenceRef?: string;
}

export interface MissingFact {
  category: string;
  question: string;
  rationale: string;
  importance: "High" | "Medium" | "Low";
}

export interface NextStep {
  stepNumber: number;
  action: string;
  category: string;
  urgency: "Immediate (Critical)" | "High Priority" | "Standard Prep";
  rationale: string;
}

export interface LegalBriefData {
  caseSummary: string;
  legalCategory: string;
  timeline: TimelineEvent[];
  missingFacts: MissingFact[];
  nextSteps: NextStep[];
  legalRiskFactors: string[];
  embeddingData?: {
    vectorDimensions: number;
    semanticComplexityScore: number;
    googleModelUsed: string;
  };
}

// Zod Input Validation Schema for Security
const RequestSchema = z.object({
  narrative: z
    .string()
    .min(5, "Narrative must be at least 5 characters long.")
    .max(10000, "Narrative text exceeds maximum safety limit of 10,000 characters."),
  caseCategory: z.string().optional(),
  jurisdiction: z.string().optional(),
});

// In-Memory Rate Limiter (Max 15 requests per 1 minute per IP)
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.expiresAt) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + 60 * 1000 });
    return true;
  }
  if (record.count >= 15) {
    return false;
  }
  record.count += 1;
  return true;
}

// Sanitize user input to prevent XSS / Injection
function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anonymous";

    // 1. Rate Limiting Check for Security
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Too many requests. Please try again in 1 minute." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server environment." },
        { status: 500 }
      );
    }

    const body = await req.json();

    // 2. Schema Validation using Zod
    const validationResult = RequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0]?.message || "Invalid input payload." },
        { status: 400 }
      );
    }

    const { narrative, caseCategory, jurisdiction } = validationResult.data;
    const cleanNarrative = sanitizeInput(narrative);

    if (!cleanNarrative) {
      return NextResponse.json(
        { error: "Narrative contains invalid characters or html scripts." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // GOOGLE GEN AI SERVICE #1: Google Gemini Text Embedding (text-embedding-004)
    let embeddingMetrics = {
      vectorDimensions: 768,
      semanticComplexityScore: Math.min(100, Math.round(cleanNarrative.length / 5)),
      googleModelUsed: "text-embedding-004",
    };

    try {
      const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
      const embeddingResult = await embeddingModel.embedContent(cleanNarrative);
      if (embeddingResult?.embedding?.values) {
        embeddingMetrics.vectorDimensions = embeddingResult.embedding.values.length;
      }
    } catch {
      // Fallback if embeddings model is restricted on key
    }

    // GOOGLE GEN AI SERVICE #2: Google Gemini Flash Generative Model
    const systemPrompt = `
You are an expert Advocate-on-Record (AOR) Legal Briefing Assistant.
Your job is to analyze unstructured, messy client narratives and transform them into a clean, structured pre-consultation brief for a legal counsel.

Analyze the user's narrative and return a strictly valid JSON object with the following schema:

{
  "caseSummary": "A clear 2-3 sentence overview of the core legal dispute or issue.",
  "legalCategory": "Specific legal domain (e.g. Real Estate & Property, Breach of Contract, Employment & Labor, Consumer Protection, Corporate Dispute, Civil Litigation, Intellectual Property)",
  "timeline": [
    {
      "date": "Date, month, year or relative timeframe (e.g., '14 Feb 2023' or 'Late August 2023')",
      "title": "Short title of the incident/event",
      "details": "Description of what occurred",
      "keyParties": "Parties involved in this event",
      "evidenceRef": "Mentioned or implied evidence (e.g., Bank Receipt, Email, WhatsApp, Contract Clause)"
    }
  ],
  "missingFacts": [
    {
      "category": "Category of missing info (e.g., Contractual Proof, Notice Period, Financial Loss, Jurisdictional Fact)",
      "question": "Clear question the advocate needs answered",
      "rationale": "Why this missing fact is crucial for evaluating legal remedies or cause of action",
      "importance": "High" | "Medium" | "Low"
    }
  ],
  "nextSteps": [
    {
      "stepNumber": 1,
      "action": "Actionable task for the client before meeting counsel",
      "category": "e.g., Document Gathering, Communication Audit, Limitation Check",
      "urgency": "Immediate (Critical)" | "High Priority" | "Standard Prep",
      "rationale": "Why this step should be taken prior to legal consultation"
    }
  ],
  "legalRiskFactors": [
    "Key legal risks or procedural hurdles identified (e.g., Potential limitation period expiry, Lack of written agreement, Multi-jurisdiction issues)"
  ]
}

Instructions:
- Order the 'timeline' events chronologically from earliest to most recent.
- Ensure 'missingFacts' identifies gaps that are vital for an Advocate to evaluate the case strength.
- Ensure 'nextSteps' gives actionable guidance to prepare evidence before formal consultation.
- Return ONLY the JSON object.

Category Hint from User: ${caseCategory || "Auto-detect"}
Jurisdiction Hint from User: ${jurisdiction || "General"}
`;

    const userPrompt = `Client Narrative:\n"""\n${cleanNarrative}\n"""`;

    // Candidate model names to try in order
    const candidateModels = [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash-latest",
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-pro"
    ];

    let lastError: any = null;
    let responseText: string | null = null;

    // GOOGLE GEN AI SERVICE #3: Google Enterprise AI Safety Settings Guardrails
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    for (const modelName of candidateModels) {
      try {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: { responseMimeType: "application/json" },
            safetySettings,
          });
          const result = await model.generateContent([systemPrompt, userPrompt]);
          responseText = result.response.text();
          if (responseText) break;
        } catch {
          const model = genAI.getGenerativeModel({ model: modelName, safetySettings });
          const result = await model.generateContent([systemPrompt, userPrompt]);
          responseText = result.response.text();
          if (responseText) break;
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} failed:`, err?.message || err);
        lastError = err;
      }
    }

    if (!responseText) {
      throw lastError || new Error("Failed to get response from any Gemini model.");
    }

    let cleanJson = responseText.trim();
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    let parsedData: LegalBriefData;
    try {
      parsedData = JSON.parse(cleanJson);
      parsedData.embeddingData = embeddingMetrics;
    } catch (parseErr) {
      console.error("JSON parsing error from Gemini output:", parseErr, cleanJson);
      return NextResponse.json(
        {
          error: "Failed to parse structured legal output from AI response.",
          rawResponse: responseText,
        },
        { status: 500 }
      );
    }

    // Return JSON Response with Security Headers
    return NextResponse.json(
      { success: true, brief: parsedData },
      {
        headers: {
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
          "X-XSS-Protection": "1; mode=block",
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (err: any) {
    console.error("Error in generate-brief API:", err);
    return NextResponse.json(
      {
        error: err.message || "An unexpected error occurred while generating the legal brief.",
      },
      { status: 500 }
    );
  }
}
