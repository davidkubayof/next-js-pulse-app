//good
import CardWrapper from '@/ui/dashboard/task-card';
import LatestLogs from '@/ui/dashboard/latest-logs';
import LatestTasksWrapper from '@/ui/dashboard/task-list';
import Header from '@/ui/dashboard/header';
import { lusitana } from '@/ui/fonts';
import { Suspense } from 'react';
import { TasksChartSkeleton, LatestLogsSkeleton, CardsSkeleton, HeaderSkeleton } from '@/ui/skeletons';//
export default async function Page() {
  return (
    <main>
      <div className="flex w-full items-center justify-between mb-8">
        <h1 className={`${lusitana.className} text-2xl md:text-3xl font-semibold`}>
          Dashboard
        </h1>
        <Suspense fallback={<HeaderSkeleton />}>
          <Header />
        </Suspense>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<TasksChartSkeleton />}>
          <LatestTasksWrapper />
        </Suspense>
        <Suspense fallback={<LatestLogsSkeleton />}>
          <LatestLogs />
        </Suspense>
      </div>
    </main>
  );
}