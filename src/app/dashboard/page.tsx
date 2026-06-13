import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email) {
    redirect("/");
  }

  // استدعاء السير الذاتية الخاصة بالمستخدم مرتبة من الأحدث للأقدم
  const user = await db.user.findUnique({
    where: { email: session.user.email },
    include: {
      profiles: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!user) redirect("/");

  return (
    <div className="min-h-screen bg-gray-50 p-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">لوحة التحكم السحابية</h1>
        <DashboardClient profiles={user.profiles} />
      </div>
    </div>
  );
}