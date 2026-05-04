import Link from 'next/link';
import { 
  ArrowRightIcon, 
  ServerIcon, 
  ShieldCheckIcon, 
  DocumentMagnifyingGlassIcon,
  KeyIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';
import { lusitana } from '@/ui/fonts';

export default function Page(): React.JSX.Element {
  return (
    <main className="flex min-h-screen flex-col p-6 bg-slate-50 text-slate-900 overflow-x-hidden">
      
      {/* Header - Professional & Clean */}
      <header className="flex h-20 shrink-0 items-center justify-between rounded-xl bg-indigo-700 px-8 shadow-lg md:h-28">
         <h1 className={`${lusitana.className} text-white text-4xl font-bold`}>Pulse</h1>
         <div className="hidden md:flex items-center gap-4 text-indigo-100 text-sm font-mono">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            SYSTEM_STATUS: SECURE_CHANNEL
         </div>
      </header>

      <div className="mt-6 grid grow grid-cols-1 gap-6 md:grid-cols-12">
        
        {/* Left Column: Mission & Access */}
        <div className="flex flex-col justify-between rounded-2xl bg-white border border-slate-200 p-8 md:col-span-5 shadow-sm">
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest italic border border-indigo-100">
              Task Management Architecture
            </div>
            <h2 className={`${lusitana.className} text-4xl text-slate-900 font-extrabold leading-tight`}>
              שקיפות מלאה בכל פעולה.
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed max-w-md">
              Pulse מחברת בין ממשק משתמש אינטראקטיבי לבין שכבת נתונים מנוהלת (DAL). כל שינוי במערכת נרשם ב-Audit Log, מה שמבטיח עקביות וסדר מוחלט.
            </p>

            <div className="grid grid-cols-1 gap-4 pt-4">
              {[
                { icon: ShieldCheckIcon, title: "Next.js Middleware", desc: "הגנת נתיבים ואימות נתונים בשכבת ה-Edge" },
                { icon: ServerIcon, title: "React 19 Server Actions", desc: "ניהול לוגיקה בצד השרת עם טיפול אופטימיסטי ב-UI" },
                { icon: DocumentMagnifyingGlassIcon, title: "DAL Layering", desc: "הפרדה מוחלטת בין ה-UI לבין השאילתות ל-Prisma" }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <item.icon className="w-6 h-6 text-indigo-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">{item.title}</h4>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8">
            <Link
              href="/login"
              className="flex items-center justify-center gap-4 w-full md:w-auto rounded-xl bg-indigo-600 px-10 py-4 text-white font-bold transition-all hover:bg-indigo-700 hover:shadow-xl active:scale-95"
            >
              <span>כניסה למערכת</span> 
              <ArrowRightIcon className="w-5" />
            </Link>
          </div>
        </div>

        {/* Right Column: Data Flow Visualization */}
        <div className="md:col-span-7 flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur flex justify-between items-center">
             <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
             </div>
             <span className="text-[10px] font-mono text-slate-500 tracking-tighter uppercase">Infrastructure_Flow</span>
          </div>

          <div className="flex-grow p-8 flex flex-col justify-center gap-12">
            
            {/* Step 1: Secure Auth */}
            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <KeyIcon className="w-7 h-7" />
              </div>
              <div className="h-px flex-grow bg-gradient-to-r from-indigo-500/50 to-slate-800 relative">
                <span className="absolute -top-6 left-0 text-[10px] text-indigo-400 font-mono italic underline underline-offset-4 tracking-wider">Session Validation: NextAuth / Middleware</span>
              </div>
            </div>

            {/* Step 2: DAL / Server Action */}
            <div className="flex items-center gap-6 self-center w-[85%]">
               <div className="w-full h-28 rounded-xl border border-slate-700 bg-slate-800/40 p-5 flex flex-col justify-center gap-2 relative">
                  <div className="absolute -top-3 left-4 px-2 bg-slate-900 text-slate-400 text-[10px] font-bold tracking-widest border border-slate-700 rounded uppercase">Execution Layer (DAL)</div>
                  <div className="flex gap-3 text-[13px] font-mono text-slate-300">
                    <span className="text-indigo-400">01</span>
                    <span>validateSchema(formData, zodTaskSchema)</span>
                  </div>
                  <div className="flex gap-3 text-[13px] font-mono text-slate-300">
                    <span className="text-indigo-400">02</span>
                    <span>dal.auditLog.record(&#123; type: &apos;CREATE_TASK&apos; &#125;)</span>
                  </div>
               </div>
            </div>

            {/* Step 3: Database Persistence */}
            <div className="flex items-center gap-6 flex-row-reverse">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <CommandLineIcon className="w-7 h-7" />
              </div>
              <div className="h-px flex-grow bg-gradient-to-l from-emerald-500/50 to-slate-800 relative">
                <span className="absolute -top-6 right-0 text-[10px] text-emerald-400 font-mono tracking-wider">Storage: PostgreSQL via Prisma</span>
              </div>
            </div>
          </div>

          {/* System Metrics Footer */}
          <div className="p-5 bg-slate-950/80 border-t border-slate-800 flex justify-around">
              <div className="text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Latency</p>
                <p className="text-sm font-mono text-indigo-400">~24ms</p>
              </div>
              <div className="text-center border-x border-slate-800 px-10">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Runtime</p>
                <p className="text-sm font-mono text-indigo-400 italic">Node.js 22</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Stack</p>
                <p className="text-sm font-mono text-emerald-400 italic">React 19</p>
              </div>
          </div>
        </div>
      </div>

      <footer className="mt-6 flex justify-between items-center px-4 py-4 border-t border-slate-200 bg-white/50 rounded-lg">
        <p className="text-[11px] text-slate-400 font-mono tracking-[0.2em] uppercase">
          Pulse Environment // Verified Session Architecture // 2026
        </p>
        <div className="flex gap-4">
          <span className="text-[11px] font-bold text-slate-300">v1.2.4</span>
        </div>
      </footer>

    </main>
  );
}