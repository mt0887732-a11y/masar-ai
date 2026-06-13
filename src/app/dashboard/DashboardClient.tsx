"use client";

import dynamic from "next/dynamic";
import { AtsPdfDocument } from "@/components/AtsPdfDocument";

// فصل مكتبة العرض عن الخادم لمنع انهيار البناء (SSR)
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

export function DashboardClient({ profiles }: { profiles: any[] }) {
  if (profiles.length === 0) {
    return (
      <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
        <p className="text-gray-500 font-medium text-lg">لم تقم بتوليد أي سير ذاتية حتى الآن.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {profiles.map((profile) => (
        <div key={profile.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[200px]">
          <div>
            <h2 className="font-bold text-xl text-gray-800 mb-2">
              سيرة ذاتية ATS - {profile.language === 'Arabic' ? 'عربي' : 'إنجليزي'}
            </h2>
            <p className="text-sm text-gray-500 mb-4 font-mono">
              التاريخ: {new Date(profile.createdAt).toLocaleString('ar-EG')}
            </p>
          </div>

          {profile.cvData ? (
            <PDFDownloadLink
              document={<AtsPdfDocument data={profile.cvData} language={profile.language || "English"} />}
              fileName={`Masar_ATS_CV_${profile.id.slice(-5)}.pdf`}
              className="bg-gray-800 hover:bg-black text-white font-bold py-3 px-4 rounded-lg text-center transition-colors w-full mt-auto"
            >
              {({ loading }) => (loading ? "جاري تهيئة الملف..." : "تحميل المستند (PDF)")}
            </PDFDownloadLink>
          ) : (
            <button disabled className="bg-red-50 text-red-500 font-bold py-3 px-4 rounded-lg text-center w-full mt-auto cursor-not-allowed">
              بيانات تالفة أو غير مكتملة
            </button>
          )}
        </div>
      ))}
    </div>
  );
}