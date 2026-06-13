import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. تحديد المسارات العامة (بما فيها مسار الذكاء الاصطناعي)
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/parse-pdf',
  '/api/optimize-cv',
  '/api/profile'
]);

// 2. إضافة async واستخدام الانتظار await مع دالة الحماية
export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};