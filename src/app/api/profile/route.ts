import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db as prisma } from "@/lib/db";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.profile.findFirst({
      where: { userId },
    });

    // التعديل المعماري 1: استدعاء cvData بدلاً من data
    return NextResponse.json({ success: true, data: profile?.cvData || {} });
  } catch (error: any) {
    console.error("[PROFILE_GET_ERROR]", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.json();

    const existingProfile = await prisma.profile.findFirst({
      where: { userId },
    });

    let profile;

    if (existingProfile) {
      profile = await prisma.profile.update({
        where: { id: existingProfile.id },
        data: {
          cvData: formData, // التعديل المعماري 2: مطابقة اسم الحقل
          language: formData.language || "English"
        },
      });
    } else {
      profile = await prisma.profile.create({
        data: {
          userId,
          cvData: formData, // التعديل المعماري 3: مطابقة اسم الحقل
          language: formData.language || "English" // حقل إجباري في الهيكل الخاص بك
        },
      });
    }

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    console.error("[PROFILE_POST_ERROR]", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}