import { fetchAuditLogs } from '@/lib/dal/auditLog';
import FilterBar from '@/ui/audit/filter-bar';
import { AuditTable } from '@/ui/audit/audit-table';
import { Suspense } from 'react';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function Page({ searchParams }: PageProps): Promise<React.JSX.Element> {
  const filters = await searchParams;

  const logs = await fetchAuditLogs({
    user: filters.user,
    action: filters.action,
    details: filters.details,
  });

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">System Audit Logs</h1>
        <p className="text-sm text-gray-500">Track actions and system changes.</p>
      </header>

      <FilterBar />

      <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-xl" />}>
        <AuditTable logs={logs} />
      </Suspense>
    </main>
  );
}