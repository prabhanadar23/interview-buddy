import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { question, answer, role } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) return NextResponse.json({ error: "No key" }, { status: 500 });

  // NEW 2026 MODELS - 2.5 is DEAD for new users
  const models = ["gemini-3.5-flash-lite", "gemini-3.7-flash"];

  const prompt = `You are expert ${role} interviewer. Q: ${question} A: ${answer}. Give UNIQUE feedback for THIS answer only. Return JSON: {"score":0-100,"strengths":["specific to this answer","specific 2"],"improvements":["specific fix","specific 2"],"feedback":"1 specific sentence"}`;

  for (const model of models) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.9, maxOutputTokens: 500 }
        }),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      console.log(`Failed ${model}:`, data.error?.message);
      continue;
    }
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    text = text.replace(/```json|```/g, "").trim();
    const m = text.match(/\{[\s\S]*\}/);
    const result = JSON.parse(m? m[0] : text);
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "Quota exceeded, try new key" }, { status: 500 });
}