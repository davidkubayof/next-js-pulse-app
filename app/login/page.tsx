import AcmeLogo from '@/ui/pulse-logo';
import LoginForm from '@/ui/login-form';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-slate-50 relative overflow-hidden">
      
      {/* אלמנטים עיצוביים ברקע - נותן עומק ויופי בלי להעמיס */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]"></div>
      </div>

      <div className="relative mx-auto flex w-full max-w-[450px] flex-col space-y-6 p-6">
        
        {/* Header של הטופס - עיצוב מעוגל ומודרני */}
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="flex h-24 w-full items-center justify-center rounded-2xl bg-indigo-700 p-4 shadow-xl ring-1 ring-white/20">
            <div className="w-40 text-white transform transition-transform hover:scale-105 duration-300">
              <AcmeLogo />
            </div>
          </div>
          
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">כניסה למערכת Pulse</h2>
            <p className="text-sm text-slate-500 font-medium">נא להזין פרטים כדי להמשיך ל-Dashboard</p>
          </div>
        </div>

        {/* גוף הטופס עם אפקט זכוכית עדין */}
        <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl p-2 shadow-2xl">
          <Suspense fallback={
            <div className="h-[300px] flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
            <LoginForm />
          </Suspense>
        </div>

        {/* Footer קטן מתחת לטופס */}
        <div className="flex flex-col items-center space-y-4 pt-2">
          <p className="text-xs text-slate-400 font-mono uppercase tracking-[0.2em]">
            Secure Access Layer v1.2
          </p>
          <div className="flex gap-2 text-[10px] text-slate-300 font-bold">
            <span>SSL ENCRYPTED</span>
            <span>•</span>
            <span>AUDIT LOG ACTIVE</span>
          </div>
        </div>

      </div>
    </main>
  );
}