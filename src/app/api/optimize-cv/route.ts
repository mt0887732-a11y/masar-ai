import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";

// تهيئة محرك جيميناي
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { text, type } = await req.json();

    if (!text) {
      return new NextResponse("Payload text is required", { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // هندسة التلقين (Prompt Engineering) لضمان مخرجات متوافقة مع ATS ومنع التكرار
    const prompt = `
      You are an elite ATS-compliance architect and resume optimizer.
      Rewrite the following ${type} description into a professional, high-impact CV bullet point in English.
      
      CRITICAL RULES FOR ATS COMPLIANCE:
      1. Start with a highly specific, rare action verb. STRICTLY AVOID overused verbs like (Managed, Developed, Created, Worked, Led, Designed).
      2. Ensure absolute lexical variety. Do not use generic industry buzzwords.
      3. Quantify achievements with metrics where implied.
      4. Return ONLY the final rewritten text without any quotes, conversational text, or prefixes.

      Original Text:
      "${text}"
    `;

    const result = await model.generateContent(prompt);
    const optimizedText = result.response.text().trim();

    return NextResponse.json({ optimizedText });

  } catch (error) {
    console.error("[AI_OPTIMIZATION_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}