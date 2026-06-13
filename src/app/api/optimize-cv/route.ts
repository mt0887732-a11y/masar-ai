import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import Groq from "groq-sdk";

const PDFParser = require("pdf2json");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY as string });

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: "يجب تسجيل الدخول أولاً." }, { status: 401 });
    }

    const user = await db.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ success: false, error: "المستخدم غير مسجل." }, { status: 404 });
    }

    // 1. جدار الحماية: الفحص المعماري للرصيد
    if (user.credits < 1) {
      return NextResponse.json(
        { success: false, error: "لقد استنفدت رصيدك المجاني. يرجى الترقية للاستمرار." }, 
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const jobDescription = formData.get("jobDescription") as string || "";
    const language = formData.get("language") as string || "English";

    if (!file) {
      return NextResponse.json({ success: false, error: "ملف السيرة الذاتية مفقود." }, { status: 400 });
    }

    // 2. المعالجة المحلية للـ PDF
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const extractedText = await new Promise<string>((resolve, reject) => {
      const pdfParser = new PDFParser(null, 1);
      pdfParser.on("pdfParser_dataError", () => reject(new Error("فشل في تحليل هيكل الـ PDF داخلياً.")));
      pdfParser.on("pdfParser_dataReady", () => resolve(pdfParser.getRawTextContent()));
      pdfParser.parseBuffer(buffer);
    });

    if (!extractedText || extractedText.trim() === "") {
      return NextResponse.json({ success: false, error: "الملف فارغ أو يحتوي على نصوص مدمجة كصور." }, { status: 400 });
    }

    const systemPrompt = `
      Analyze the following CV text extracted from the candidate's PDF:
      """
      ${extractedText}
      """
      Target output language: ${language}.
      ${jobDescription ? `Compare against this Job Description for gap analysis: """${jobDescription}"""` : ""}
    `;

    // 3. الاتصال بمحرك Groq
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert ATS optimizer and senior resume writer. You MUST return ONLY a raw JSON object. Do not include markdown formatting like \`\`\`json.
          Extract ALL relevant information from the provided text. If a specific field or section is missing entirely in the text, leave its value empty or as an empty array.
          
          The JSON object MUST strictly follow this exact structure:
          {
            "name": "Candidate Full Name",
            "email": "Email Address",
            "phone": "Phone Number",
            "links": "LinkedIn, GitHub or Portfolio URLs (if any)",
            "summary": "Write a strong, professional, ATS-optimized summary (3-4 sentences) capturing their core strength.",
            "education": [
              {
                "degree": "Degree and Major",
                "institution": "University / Institution Name",
                "period": "Start Date - End Date"
              }
            ],
            "experience": [
              {
                "role": "Job Title / Role",
                "company": "Company Name",
                "period": "Start Date - End Date",
                "responsibilities": [
                  "Action-driven bullet point describing accomplishment",
                  "Action-driven bullet point describing accomplishment"
                ]
              }
            ],
            "projects": [
              {
                "title": "Project Name",
                "description": "Comprehensive description of the project, tools used, and the candidate's contribution."
              }
            ],
            "certifications": [
              "Certification, Course, or Training Name 1",
              "Certification, Course, or Training Name 2"
            ],
            "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
            "gapAnalysis": [
              "Identify any skills gap or improvement recommendation relative to the job description or industry standards."
            ]
          }`
        },
        { role: "user", content: systemPrompt }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    });

    const cleanJsonText = response.choices[0]?.message?.content || "{}";
    const optimizedData = JSON.parse(cleanJsonText);

    // 4. المعاملة الذرية (Atomic Transaction): دمج عملية الحفظ والخصم لضمان سلامة قاعدة البيانات
    const [newProfile, updatedUser] = await db.$transaction([
      db.profile.create({
        data: { 
          userId: user.id,
          cvData: optimizedData,
          language: language
        },
      }),
      db.user.update({
        where: { id: user.id },
        data: { credits: { decrement: 1 } } // الخصم الفعلي
      })
    ]);

    return NextResponse.json({
      success: true,
      data: optimizedData, 
      profileId: newProfile.id,
      remainingCredits: updatedUser.credits // إرسال الرصيد المتبقي للواجهة الأمامية
    });

  } catch (error: any) {
    console.error("Critical Groq/DB Error:", error);
    return NextResponse.json(
      { success: false, error: "انهيار في المحرك المعرفي: " + (error.message || "خطأ داخلي") },
      { status: 500 }
    );
  }
}