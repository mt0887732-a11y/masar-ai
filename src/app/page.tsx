"use client";

import { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { CVTemplate } from "./components/CVTemplate";

export default function Home() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    emailAddress: "",
    location: "",
    linkedinHandle: "",
    skills: "",
    experience: [
      { company: "", role: "", duration: "", description: "" }
    ],
    projects: [
      { title: "", description: "", link: "" }
    ]
  });

  // دالة الاسترجاع (Data Hydration)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const result = await response.json();
          if (result && result.data) {
            setFormData(result.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (index: number, field: string, value: string, type: "experience" | "projects") => {
    setFormData((prev) => {
      const updated = [...prev[type]];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, [type]: updated };
    });
  };

  const addField = (type: "experience" | "projects") => {
    if (type === "experience") {
      setFormData((prev) => ({
        ...prev,
        experience: [...prev.experience, { company: "", role: "", duration: "", description: "" }]
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        projects: [...prev.projects, { title: "", description: "", link: "" }]
      }));
    }
  };

  const onSubmit = async () => {
    setLoading(true);
    setStatusMessage({ type: "", text: "" });
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile data');
      }

      setStatusMessage({ type: "success", text: "تمت مزامنة البيانات وحفظ المخطط بنجاح في قاعدة البيانات." });
      setStep(5);

    } catch (error) {
      console.error("Submission Error:", error);
      setStatusMessage({ type: "error", text: "فشلت عملية الاتصال بالخادم وحفظ البيانات." });
    } finally {
      setLoading(false);
    }
  };

  // محرك الطباعة واستخراج الـ PDF (التحديث الجديد للمكتبة)
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${formData.fullName.replace(/\s+/g, '_')}_Resume`,
  });

  return (
    <main className="max-w-5xl mx-auto p-6 min-h-screen text-slate-100 font-sans">
      <div className="border-b border-slate-900/50 pb-4 mb-8">
        <div className="flex justify-between items-center text-xs font-mono tracking-wider text-slate-400">
          <span className={`pb-2 px-2 transition-all ${step === 1 ? "border-b-2 border-blue-500 text-blue-400" : ""}`}>1. INGESTION</span>
          <span className={`pb-2 px-2 transition-all ${step === 2 ? "border-b-2 border-blue-500 text-blue-400" : ""}`}>2. EXPERIENCE</span>
          <span className={`pb-2 px-2 transition-all ${step === 3 ? "border-b-2 border-blue-500 text-blue-400" : ""}`}>3. CREDENTIALS</span>
          <span className={`pb-2 px-2 transition-all ${step === 4 ? "border-b-2 border-blue-500 text-blue-400" : ""}`}>4. IGNITION</span>
        </div>
      </div>

      {statusMessage.text && (
        <div className={`p-4 mb-6 rounded text-sm font-mono ${statusMessage.type === "success" ? "bg-green-950/40 border border-green-500/30 text-green-400" : "bg-red-950/40 border border-red-500/30 text-red-400"}`}>
          {statusMessage.text}
        </div>
      )}

      <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-8 backdrop-blur-sm">
        
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-200 mb-4">Step 1: Asset Ingestion & Core Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full bg-slate-950/60 border border-slate-800 rounded p-3 text-sm focus:outline-none focus:border-blue-500 transition-colors" placeholder="Mohamed Taha Ali" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="w-full bg-slate-950/60 border border-slate-800 rounded p-3 text-sm focus:outline-none focus:border-blue-500 transition-colors" placeholder="01141964029" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                <input type="email" name="emailAddress" value={formData.emailAddress} onChange={handleInputChange} className="w-full bg-slate-950/60 border border-slate-800 rounded p-3 text-sm focus:outline-none focus:border-blue-500 transition-colors" placeholder="example@gmail.com" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full bg-slate-950/60 border border-slate-800 rounded p-3 text-sm focus:outline-none focus:border-blue-500 transition-colors" placeholder="Cairo, Egypt" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Linkedin Handle</label>
                <input type="text" name="linkedinHandle" value={formData.linkedinHandle} onChange={handleInputChange} className="w-full bg-slate-950/60 border border-slate-800 rounded p-3 text-sm focus:outline-none focus:border-blue-500 transition-colors" placeholder="linkedin.com/in/username" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-200 mb-4">Step 2: Practical Experience & Industrial History</h2>
            {formData.experience.map((exp, index) => (
              <div key={index} className="p-4 bg-slate-950/40 border border-slate-800 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" placeholder="Company / Production Node" value={exp.company} onChange={(e) => handleNestedChange(index, "company", e.target.value, "experience")} className="bg-slate-950/60 border border-slate-800 rounded p-3 text-sm focus:outline-none focus:border-blue-500 text-slate-200" />
                  <input type="text" placeholder="Role (e.g., CNC Operator)" value={exp.role} onChange={(e) => handleNestedChange(index, "role", e.target.value, "experience")} className="bg-slate-950/60 border border-slate-800 rounded p-3 text-sm focus:outline-none focus:border-blue-500 text-slate-200" />
                  <input type="text" placeholder="Duration (e.g., 3 Years)" value={exp.duration} onChange={(e) => handleNestedChange(index, "duration", e.target.value, "experience")} className="bg-slate-950/60 border border-slate-800 rounded p-3 text-sm focus:outline-none focus:border-blue-500 text-slate-200" />
                </div>
                <textarea placeholder="Technical Responsibilities & Achievements" value={exp.description} onChange={(e) => handleNestedChange(index, "description", e.target.value, "experience")} className="w-full bg-slate-950/60 border border-slate-800 rounded p-3 text-sm focus:outline-none focus:border-blue-500 h-24 resize-none text-slate-200" />
              </div>
            ))}
            <button type="button" onClick={() => addField("experience")} className="text-xs font-mono bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded text-slate-300 transition-colors">
              + Add Experience Node
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-200 mb-4">Step 3: Technical Credentials & System Projects</h2>
            {formData.projects.map((proj, index) => (
              <div key={index} className="p-4 bg-slate-950/40 border border-slate-800 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Project / Certificate Title" value={proj.title} onChange={(e) => handleNestedChange(index, "title", e.target.value, "projects")} className="bg-slate-950/60 border border-slate-800 rounded p-3 text-sm focus:outline-none focus:border-blue-500 text-slate-200" />
                  <input type="text" placeholder="Repository / System Link" value={proj.link} onChange={(e) => handleNestedChange(index, "link", e.target.value, "projects")} className="bg-slate-950/60 border border-slate-800 rounded p-3 text-sm focus:outline-none focus:border-blue-500 text-slate-200" />
                </div>
                <textarea placeholder="Project Architecture, Parameters, and Target Metrics" value={proj.description} onChange={(e) => handleNestedChange(index, "description", e.target.value, "projects")} className="w-full bg-slate-950/60 border border-slate-800 rounded p-3 text-sm focus:outline-none focus:border-blue-500 h-24 resize-none text-slate-200" />
              </div>
            ))}
            <button type="button" onClick={() => addField("projects")} className="text-xs font-mono bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded text-slate-300 transition-colors">
              + Add Project Node
            </button>
            <div className="pt-4">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Core Technical Skills (Comma Separated)</label>
              <input type="text" name="skills" value={formData.skills} onChange={handleInputChange} className="w-full bg-slate-950/60 border border-slate-800 rounded p-3 text-sm focus:outline-none focus:border-blue-500 transition-colors text-slate-200" placeholder="Next.js, TypeScript, SolidWorks, PostgreSQL" />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-200 mb-4">Step 4: Pipeline Terminal & Data Verification</h2>
            <div className="bg-slate-950/80 p-6 border border-slate-800 rounded-lg space-y-4 text-sm font-mono max-h-96 overflow-y-auto">
              <p className="text-blue-400">// Target Schema Verification Matrix</p>
              <p><span className="text-slate-500">Identity:</span> {formData.fullName || "Void"}</p>
              <p><span className="text-slate-500">Contact Vector:</span> {formData.phoneNumber || "Void"} | {formData.emailAddress || "Void"}</p>
              <p><span className="text-slate-500">Location Node:</span> {formData.location || "Void"}</p>
              <p><span className="text-slate-500">Array Counts:</span> {formData.experience.length} Experience Object(s), {formData.projects.length} Project Object(s)</p>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900 p-4 border border-slate-800 rounded-lg">
              <div>
                <h2 className="text-xl font-bold text-emerald-400">Pipeline Ingestion Complete</h2>
                <p className="text-sm text-slate-400">البيانات محفوظة. يمكنك الآن معاينة السيرة الذاتية واستخراجها.</p>
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(1)} className="px-4 py-2 text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors">
                  Edit Data
                </button>
                <button type="button" onClick={handlePrint} className="px-4 py-2 text-xs font-mono font-bold bg-blue-600 hover:bg-blue-500 text-white rounded shadow-lg shadow-blue-900/50 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download PDF
                </button>
              </div>
            </div>

            {/* معاينة السيرة الذاتية الحية */}
            <div className="border border-slate-800 rounded-xl overflow-hidden h-[600px] overflow-y-auto">
              <CVTemplate ref={componentRef} data={formData} />
            </div>
          </div>
        )}

        {step <= 4 && (
          <div className="flex justify-between items-center pt-8 mt-8 border-t border-slate-950">
            <button
              type="button"
              disabled={step === 1 || loading}
              onClick={() => setStep((prev) => prev - 1)}
              className="px-5 py-2 text-xs font-mono font-bold tracking-wider uppercase border border-slate-800 text-slate-400 hover:bg-slate-900 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              ← Previous Node
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => prev + 1)}
                className="px-5 py-2 text-xs font-mono font-bold tracking-wider uppercase bg-blue-600 hover:bg-blue-500 text-white rounded transition-all"
              >
                Next Step →
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={onSubmit}
                className="px-5 py-2 text-xs font-mono font-bold tracking-wider uppercase bg-emerald-600 hover:bg-emerald-500 text-white rounded shadow-lg shadow-emerald-950/50 disabled:opacity-50 transition-all"
              >
                {loading ? "Persisting Data..." : "⚡ Execute Ignition"}
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}