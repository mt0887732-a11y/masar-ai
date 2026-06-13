import { db as prisma } from "@/lib/db";
import { notFound } from "next/navigation";

// 1. توليد البيانات الوصفية (Metadata) للمحركات
export async function generateMetadata({ params }: { params: { id: string } }) {
  const profile = await prisma.profile.findFirst({
    where: { userId: params.id },
  });

  if (!profile || !profile.cvData) {
    return { title: "Portfolio Not Found" };
  }

  const data: any = typeof profile.cvData === "string" ? JSON.parse(profile.cvData) : profile.cvData;

  return {
    title: `${data?.name || "Professional"} | Portfolio`,
    description: data?.summary || "View my professional resume and ATS-optimized portfolio.",
  };
}

// 2. المكون الأساسي لصفحة المعرض الرقمي
export default async function PortfolioPage({ params }: { params: { id: string } }) {
  const profile = await prisma.profile.findFirst({
    where: { userId: params.id },
  });

  if (!profile || !profile.cvData) {
    notFound();
  }

  const data: any = typeof profile.cvData === "string" ? JSON.parse(profile.cvData) : profile.cvData;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8" dir="ltr">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* رأس المعرض */}
        <div className="bg-slate-900 p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">{data?.name || "Unnamed Profile"}</h1>
          <div className="flex flex-wrap gap-4 text-slate-300 text-sm">
            {data?.email && <span>{data.email}</span>}
            {data?.phone && <span>{data.phone}</span>}
            {data?.links && <span>{data.links}</span>}
          </div>
        </div>
        
        {/* محتوى السيرة الذاتية */}
        <div className="p-8 space-y-8 text-slate-800">
          
          {data?.summary && (
            <section>
              <h2 className="text-xl font-bold border-b border-slate-200 pb-2 mb-4">Professional Summary</h2>
              <p className="text-slate-600 leading-relaxed">{data.summary}</p>
            </section>
          )}

          {data?.experience && data.experience.length > 0 && (
            <section>
              <h2 className="text-xl font-bold border-b border-slate-200 pb-2 mb-4">Experience</h2>
              <div className="space-y-6">
                {data.experience.map((exp: any, index: number) => (
                  <div key={index}>
                    <h3 className="font-bold text-lg">{exp.role}</h3>
                    <div className="text-slate-500 mb-2 font-medium">{exp.company} | {exp.period}</div>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      {exp.responsibilities?.map((resp: string, idx: number) => (
                        <li key={idx} className="text-sm">{resp}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data?.education && data.education.length > 0 && (
            <section>
              <h2 className="text-xl font-bold border-b border-slate-200 pb-2 mb-4">Education</h2>
              <div className="space-y-4">
                {data.education.map((edu: any, index: number) => (
                  <div key={index}>
                    <h3 className="font-bold">{edu.degree}</h3>
                    <div className="text-slate-500 text-sm">{edu.institution} | {edu.period}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data?.skills && data.skills.length > 0 && (
            <section>
              <h2 className="text-xl font-bold border-b border-slate-200 pb-2 mb-4">Core Skills</h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill: string, index: number) => (
                  <span key={index} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium border border-slate-200">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}