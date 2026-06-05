import React from "react";
import { MapPin, Phone, Mail, Link } from "lucide-react";

interface CVTemplateProps {
  data: any;
}

export const CVTemplate = React.forwardRef<HTMLDivElement, CVTemplateProps>(({ data }, ref) => {
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
            {data.fullName || "Mohamed Taha"}
          </h1>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
            {/* استخدام aria-hidden لعزل الأيقونات عن خوارزميات ATS */}
            {data.emailAddress && <span className="flex items-center gap-1"><Mail size={14} aria-hidden="true" /> <span>{data.emailAddress}</span></span>}
            {data.phoneNumber && <span className="flex items-center gap-1"><Phone size={14} aria-hidden="true" /> <span>{data.phoneNumber}</span></span>}
            {data.location && <span className="flex items-center gap-1"><MapPin size={14} aria-hidden="true" /> <span>{data.location}</span></span>}
            {data.linkedinHandle && <span className="flex items-center gap-1"><Link size={14} aria-hidden="true" /> <span>{data.linkedinHandle}</span></span>}
          </div>
        </header>

        {/* Technical Skills */}
        {data.skills && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 mb-3 pb-1">
              Core Competencies
            </h2>
            <p className="text-sm leading-relaxed">{data.skills}</p>
          </section>
        )}

        {/* Professional Experience */}
        {data.experience && data.experience.length > 0 && data.experience[0].company !== "" && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 mb-3 pb-1">
              Professional Experience
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp: any, index: number) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-slate-900">{exp.role}</h3>
                    <span className="text-xs font-bold text-slate-500">{exp.duration}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-600 mb-2">{exp.company}</h4>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects & Credentials */}
        {data.projects && data.projects.length > 0 && data.projects[0].title !== "" && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 mb-3 pb-1">
              Technical Projects
            </h2>
            <div className="space-y-4">
              {data.projects.map((proj: any, index: number) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-slate-900">{proj.title}</h3>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">
                        View Project Repository
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {proj.description}
                  </p>
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