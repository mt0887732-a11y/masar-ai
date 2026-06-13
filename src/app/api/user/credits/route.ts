import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: "غير مصرح به." }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { credits: true }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "المستخدم غير موجود." }, { status: 404 });
    }

    return NextResponse.json({ success: true, credits: user.credits });
  } catch (error) {
    return NextResponse.json({ success: false, error: "خطأ في خادم البيانات." }, { status: 500 });
  }
}