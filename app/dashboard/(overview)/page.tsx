//good
import CardWrapper from '@/ui/dashboard/task-card';
import LatestLogs from '@/ui/dashboard/latest-logs';
import LatestTasksWrapper from '@/ui/dashboard/task-list';
import Header from '@/ui/dashboard/header';
import { lusitana } from '@/ui/fonts';
import { Suspense } from 'react';
import { TasksChartSkeleton, LatestLogsSkeleton, CardsSkeleton, HeaderSkeleton } from '@/ui/skeletons';

export default async function Page({
  searchParams, // בגרסה 15 זה מגיע כ-Promise
}: {
  searchParams: Promise<{ userId?: string; status?: string }>;
}) {
  // כאן הפתרון לשגיאה: אנחנו מחכים לפרמטרים לפני השימוש
  const resolvedSearchParams = await searchParams;
  const userId = resolvedSearchParams?.userId;
  const status = resolvedSearchParams?.status;

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
        {/* העברת ה-userId שחולץ לאחר ה-await */}
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper userId={userId} />
        </Suspense>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<TasksChartSkeleton />}>
          <LatestTasksWrapper userId={userId} />
        </Suspense>
        <Suspense fallback={<LatestLogsSkeleton />}>
          <LatestLogs userId={userId} />
        </Suspense>
      </div>
    </main>
  );
}