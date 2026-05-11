import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { RelativeTime } from '@/ui/dashboard/audit-relative-time';
import { AuditLogWithUser } from '@/lib/dal/auditLog';

export function AuditTable({ logs }: { logs: AuditLogWithUser[] }): React.JSX.Element {
  if (logs.length === 0) {
    return (
      <div className="p-20 text-center bg-white rounded-xl border">
        <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-300" />
        <p className="mt-2 text-gray-500">No logs found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 text-left">
        <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase">
          <tr>
            <th className="px-6 py-3">User</th>
            <th className="px-6 py-3">Action</th>
            <th className="px-6 py-3">Details</th>
            <th className="px-6 py-3">Date & Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{log.user.name}</td>
              <td className="px-6 py-4"><ActionBadge action={log.action} /></td>
              <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">
                {log.details || <span className="text-gray-300 italic">No details</span>}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <RelativeTime createdAt={log.createdAt} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ActionBadge({ action }: { action: string }) {
  const styles = action.includes('DELETE') ? 'bg-red-100 text-red-700' : 
                 action.includes('CREATE') ? 'bg-green-100 text-green-700' : 
                 'bg-blue-100 text-blue-700';
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles}`}>{action}</span>;
}