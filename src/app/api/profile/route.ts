import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const profile = await db.profile.upsert({
      where: { userId: userId },
      update: { data: body },
      create: { userId: userId, data: body }
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("[PROFILE_POST_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const profile = await db.profile.findUnique({
      where: { userId: userId }
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("[PROFILE_GET_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}