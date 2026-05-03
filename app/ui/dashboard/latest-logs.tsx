import { ArrowPathIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { lusitana } from '@/ui/fonts';
import { fetchLatestAuditLogs, type AuditLogWithUser } from '@/lib/dal/auditLog';

export default async function LatestLogs() {
  const latestLogs = await fetchLatestAuditLogs();

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl text-gray-800`}>
        Latest AuditLog
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4 shadow-sm">
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
          {latestLogs.map((log: AuditLogWithUser, i: number) => {
            const dateObject = new Date(log.createdAt);
            const formattedDate = dateObject.toLocaleDateString('he-IL');
            const formattedTime = dateObject.toLocaleTimeString('he-IL', {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={log.id}
                className={clsx(
                  'flex flex-row items-center gap-5 py-5 px-6 hover:bg-gray-50/50 transition-colors',
                  { 'border-t border-gray-100': i !== 0 }
                )}
              >
                {/* 1. משתמש - הגדלתי את האייקון והטקסט */}
                <div className="flex items-center gap-4 w-48 flex-shrink-0">
                  <div className="bg-gray-100 p-1.5 rounded-full">
                    <UserCircleIcon className="h-10 w-10 text-gray-400 flex-shrink-0" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-base font-bold text-gray-900 leading-tight">
                      {log.user?.name || 'User'}
                    </p>
                  </div>
                </div>

                {/* 2. תוכן הפעולה - הגדלתי פונטים ושיפרתי ריווח */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={clsx(
                      "text-[11px] font-extrabold px-2 py-1 rounded-md border uppercase tracking-tight",
                      log.action.includes('DELETE') 
                        ? 'bg-red-50 text-red-700 border-red-100' 
                        : 'bg-blue-50 text-blue-700 border-blue-100'
                    )}>
                      {log.action}
                    </span>
                  </div>
                  <p className="text-sm md:text-[15px] text-gray-700 font-medium leading-snug break-words">
                    {log.details}
                  </p>
                </div>

                {/* 3. זמן - ברור וגדול יותר */}
                <div className="flex-shrink-0 text-right pl-4">
                  <p className="text-sm font-bold text-gray-900 tabular-nums leading-none">
                    {formattedTime}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1.5 font-medium">
                    {formattedDate}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* פוטר */}
        <div className="flex items-center pb-2 pt-6 text-gray-500">
          <ArrowPathIcon className="h-5 w-5 animate-pulse text-gray-400" />
          <h3 className="ml-2 text-sm font-medium">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}