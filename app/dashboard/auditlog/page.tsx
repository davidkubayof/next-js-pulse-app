import { fetchAuditLogs, type AuditLogWithUser } from '@/lib/dal/auditLog';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { RelativeTime } from '@/ui/dashboard/audit-relative-time';

export default async function Page() {
  const logs = await fetchAuditLogs();

  return (
    <main className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">System Audit Logs</h1>
        <p className="text-sm text-gray-500">Track every action taken in the system.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {logs.length === 0 ? (
          <div className="p-20 text-center">
            <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-gray-500">No logs found yet.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {logs.map((log: AuditLogWithUser) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{log.user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                      ${log.action.includes('DELETE') ? 'bg-red-100 text-red-700' : 
                        log.action.includes('CREATE') ? 'bg-green-100 text-green-700' : 
                        'bg-blue-100 text-blue-700'}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {log.details || <span className="text-gray-300 italic">No details</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <RelativeTime createdAt={log.createdAt} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}