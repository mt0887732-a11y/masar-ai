import { ClerkProvider, SignInButton, UserButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import './globals.css'

export const metadata = {
  title: 'Masar AI',
  description: 'Enterprise Professional Identity Studio',
}

// تحويل الدالة إلى async لتتمكن من الاتصال بالخادم
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // جلب حالة المستخدم من الخادم مباشرة قبل رندرة الصفحة
  const { userId } = await auth();

  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-slate-950 min-h-screen">
          <header className="flex justify-end items-center p-4 max-w-5xl mx-auto border-b border-slate-900/50">
            {/* فحص شرطي هندسي: إذا كان هناك ID يظهر زر المستخدم، وإلا يظهر زر الدخول */}
            {userId ? (
              <UserButton />
            ) : (
              <SignInButton mode="modal">
                <button className="text-xs font-bold bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-500 transition-all">
                  Sign In / Register
                </button>
              </SignInButton>
            )}
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}