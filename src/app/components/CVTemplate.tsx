import React from "react";
import { MapPin, Phone, Mail, Link } from "lucide-react";

interface CVTemplateProps {
  data: any;
}

export const CVTemplate = React.forwardRef<HTMLDivElement, CVTemplateProps>(({ data }, ref) => {
  // الحماية ضد البيانات الفارغة أثناء التهيئة
  if (!data || !data.contact) return null;

  return (
    <div className="bg-gray-400 p-8 flex justify-center overflow-auto">
      <div 
        ref={ref} 
        className="bg-white text-slate-900 shadow-2xl"
        style={{ width: "210mm", minHeight: "297mm", padding: "20mm" }}
      >
        {/* Header: Identity & Contact */}
        <header className="border-b-2 border-slate-800 pb-6 mb-6 text-center">
          <h1 className="text-4xl font-bold uppercase tracking-widest text-slate-900 mb-2">
            {data.contact.name || "Mohamed Taha Ali"}
          </h1>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
            {data.contact.email && (
              <span className="flex items-center gap-1">
                <Mail size={14} aria-hidden="true" /> <span>{data.contact.email}</span>
              </span>
            )}
            {data.contact.phone && (
              <span className="flex items-center gap-1">
                <Phone size={14} aria-hidden="true" /> <span>{data.contact.phone}</span>
              </span>
            )}
            {data.contact.location && (
              <span className="flex items-center gap-1">
                <MapPin size={14} aria-hidden="true" /> <span>{data.contact.location}</span>
              </span>
            )}
            {data.contact.linkedin && (
              <span className="flex items-center gap-1">
                <Link size={14} aria-hidden="true" /> <span>{data.contact.linkedin}</span>
              </span>
            )}
          </div>
        </header>

        {/* Professional Summary */}
        {data.summary && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 mb-3 pb-1">
              Professional Summary
            </h2>
            <p className="text-sm leading-relaxed text-slate-700">{data.summary}</p>
          </section>
        )}

        {/* Technical Skills */}
        {data.skills && data.skills.length > 0 && data.skills[0] !== "" && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 mb-3 pb-1">
              Core Competencies
            </h2>
            <p className="text-sm leading-relaxed font-medium text-slate-800">
              {data.skills.join(' • ')}
            </p>
          </section>
        )}

        {/* Professional Experience */}
        {data.experience && data.experience.length > 0 && data.experience[0].organization !== "" && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 mb-3 pb-1">
              Professional Experience
            </h2>
            <div className="space-y-5">
              {data.experience.map((exp: any, index: number) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-slate-900">{exp.role}</h3>
                    <span className="text-xs font-bold text-slate-500">{exp.period}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-600 mb-2">{exp.organization}</h4>
                  
                  {/* تحويل المصفوفة إلى قائمة نقطية متوافقة مع ATS */}
                  <ul className="list-disc list-outside ml-4 text-sm text-slate-700 space-y-1">
                    {exp.actionBullets.map((bullet: string, idx: number) => (
                      bullet.trim() !== "" && <li key={idx} className="leading-relaxed">{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education (تمت إضافته ليتوافق مع المخطط) */}
        {data.education && data.education.length > 0 && data.education[0].institution !== "" && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 mb-3 pb-1">
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu: any, index: number) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-slate-900">{edu.degree} in {edu.major}</h3>
                    <span className="text-xs font-bold text-slate-500">{edu.graduationYear}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-600">{edu.institution}</h4>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Technical Projects */}
        {data.projects && data.projects.length > 0 && data.projects[0].title !== "" && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 mb-3 pb-1">
              Technical Projects
            </h2>
            <div className="space-y-5">
              {data.projects.map((proj: any, index: number) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-slate-900">{proj.title}</h3>
                  </div>
                  {proj.technologies && proj.technologies.length > 0 && proj.technologies[0] !== "" && (
                    <div className="text-xs font-mono text-slate-500 mb-2">
                      Technologies: {proj.technologies.join(', ')}
                    </div>
                  )}
                  <ul className="list-disc list-outside ml-4 text-sm text-slate-700 space-y-1">
                    {proj.actionBullets.map((bullet: string, idx: number) => (
                      bullet.trim() !== "" && <li key={idx} className="leading-relaxed">{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
});

CVTemplate.displayName = "CVTemplate";
