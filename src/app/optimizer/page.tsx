import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-slate-50 font-sans" dir="rtl">
      
      {/* شريط التصفح (Navbar) */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
              <span className="font-bold text-xl text-slate-800">Masar AI</span>
            </div>
            <div className="flex items-center gap-4">
              {session ? (
                <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition-colors text-sm">
                  لوحة التحكم
                </Link>
              ) : (
                <Link href="/api/auth/signin" className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2 rounded-lg font-semibold transition-colors text-sm">
                  تسجيل الدخول
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* قسم البطل (Hero Section) */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
          هندسة مسارك المهني بذكاء اصطناعي <span className="text-blue-600">يفهم متطلبات السوق</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
          منصة متكاملة للطلاب التقنيين والمهندسين. قم بتحويل بياناتك الخام إلى سير ذاتية متوافقة مع أنظمة ATS، واكتشف الفجوات المهارية بينك وبين متطلبات الوظائف الهندسية والبرمجية فوراً.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/optimizer" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-200 transition-all text-lg">
            ابدأ التحليل مجاناً
          </Link>
          <a href="#services" className="bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 px-8 rounded-xl border border-slate-200 shadow-sm transition-all text-lg">
            استكشف الخدمات
          </a>
        </div>
      </section>

      {/* قسم الخدمات الأساسية (Services) */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">محركات المنصة</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* الخدمة 1 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-100 transition-colors">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 text-2xl font-bold">1</div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">مولد السير الذاتية (ATS)</h3>
              <p className="text-slate-600 leading-relaxed">
                إعادة صياغة هيكلية لخبراتك ومشاريعك التقنية لتتطابق بنسبة 100% مع معايير الفحص الآلي. خوارزمياتنا تستخرج التفاصيل وتنسقها هندسياً.
              </p>
            </div>

            {/* الخدمة 2 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-100 transition-colors">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 text-2xl font-bold">2</div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">تحليل الفجوات (Gap Analysis)</h3>
              <p className="text-slate-600 leading-relaxed">
                مقارنة سيرتك الذاتية بوصف وظيفي محدد لاستخراج المهارات المفقودة وتوجيهك لأهم التقنيات التي يجب تعلمها لتجاوز الفرز التقني.
              </p>
            </div>

            {/* الخدمة 3 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-100 transition-colors opacity-75 relative overflow-hidden">
              <div className="absolute top-4 left-4 bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded">قريباً</div>
              <div className="w-12 h-12 bg-slate-200 text-slate-500 rounded-xl flex items-center justify-center mb-6 text-2xl font-bold">3</div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">بناء المعرض الرقمي (Portfolio)</h3>
              <p className="text-slate-600 leading-relaxed">
                تحويل مشاريعك (مثل التصميم الميكانيكي أو تطوير البرمجيات) إلى صفحات عرض رقمية احترافية لتقديمها للشركات بشكل مباشر.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* قسم خطط الدفع (Pricing) */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">خطط الاشتراك</h2>
            <p className="mt-4 text-slate-400">اختر الباقة المناسبة لمسارك المهني</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* الباقة المجانية */}
            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
              <h3 className="text-2xl font-bold mb-2">البداية (الأساسية)</h3>
              <div className="text-4xl font-extrabold mb-6">مجاناً</div>
              <ul className="space-y-4 mb-8 text-slate-300">
                <li className="flex items-center gap-2">✓ 3 محاولات لتوليد السيرة الذاتية</li>
                <li className="flex items-center gap-2">✓ تحميل بصيغة PDF القياسية</li>
                <li className="flex items-center gap-2">✓ تحليل أساسي للمهارات</li>
              </ul>
              <Link href="/optimizer" className="block w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white text-center font-bold rounded-xl transition-colors">
                البدء مجاناً
              </Link>
            </div>

            {/* الباقة الاحترافية */}
            <div className="bg-blue-600 p-8 rounded-3xl border border-blue-500 relative transform md:-translate-y-4 shadow-2xl shadow-blue-900/50">
              <div className="absolute top-0 right-1/2 transform translate-x-1/2 -translate-y-1/2 bg-amber-400 text-amber-950 text-sm font-bold px-4 py-1 rounded-full">
                الأكثر طلباً
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">الاحترافية (Pro)</h3>
              <div className="text-4xl font-extrabold mb-6 text-white">150 ج.م <span className="text-lg text-blue-200 font-normal">/ شهرياً</span></div>
              <ul className="space-y-4 mb-8 text-blue-100">
                <li className="flex items-center gap-2">✓ عدد غير محدود من السير الذاتية</li>
                <li className="flex items-center gap-2">✓ تقارير تحليل الفجوات الوظيفية المتقدمة</li>
                <li className="flex items-center gap-2">✓ دعم النماذج ثنائية اللغة (عربي/إنجليزي)</li>
                <li className="flex items-center gap-2">✓ أولوية المعالجة في الخوادم</li>
              </ul>
              <button className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-blue-700 text-center font-bold rounded-xl transition-colors">
                اشترك الآن
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* التذييل (Footer) */}
      <footer className="bg-slate-50 py-8 border-t border-slate-200 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} Masar AI. تم البناء للكوادر التقنية.</p>
      </footer>
    </div>
  );
}