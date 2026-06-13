import { NextResponse } from "next/server";
import OpenAI from "openai";
// @ts-ignore
import PDFParser from "pdf2json";

const groq = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "لم يتم رفع ملف" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    const text = await new Promise<string>((resolve, reject) => {
      const pdfParser = new PDFParser(null, true);
      
      pdfParser.on("pdfParser_dataError", (errData: any) => reject(new Error(errData.parserError)));
      pdfParser.on("pdfParser_dataReady", () => resolve(pdfParser.getRawTextContent()));
      
      pdfParser.parseBuffer(buffer);
    });

    if (!text || !text.trim()) {
      return NextResponse.json({ success: false, error: "الملف فارغ أو غير مقروء" }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: `You are an elite ATS Data Extractor.
Extract the text into this EXACT JSON structure. If information is missing, leave the string empty.
{
  "contact": { "name": "string", "email": "string", "phone": "string", "linkedin": "string", "location": "string" },
  "summary": "string",
  "education": [ { "institution": "string", "degree": "string", "major": "string", "graduationYear": "string" } ],
  "experience": [ { "role": "string", "organization": "string", "period": "string", "actionBullets": ["string", "string"] } ],
  "projects": [ { "title": "string", "technologies": ["string", "string"], "actionBullets": ["string", "string"] } ],
  "skills": ["string", "string", "string"]
}`
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
    console.error("[PARSE_PDF_ERROR]", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}