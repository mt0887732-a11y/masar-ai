import { NextResponse } from "next/server";
import OpenAI from "openai";

const groq = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ success: false, error: "No text provided" }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content: `You are an elite Resume Data Extractor. Your single goal is to map the raw text extracted from a resume cleanly into this strict JSON schema. Extract full names, emails, phones, education records, job roles, and technical engineering projects accurately.

Return ONLY a valid JSON object matching this structure:
{
  "contact": { "name": "string", "email": "string", "phone": "string", "linkedin": "string", "location": "string" },
  "summary": "string",
  "education": [ { "institution": "string", "degree": "string", "major": "string", "graduationYear": "string" } ],
  "experience": [ { "role": "string", "organization": "string", "period": "string", "bulletsText": "string" } ],
  "projects": [ { "title": "string", "technologiesText": "string", "bulletsText": "string" } ],
  "skillsText": "string"
}`,
        },
        {
          role: "user",
          content: `Raw Extracted Resume Text:\n${text}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const parsedProfile = JSON.parse(completion.choices[0].message.content || "{}");
    return NextResponse.json({ success: true, data: parsedProfile });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}