import Pagination from '@/ui/tasks/pagination';
import Search from '@/ui/search';
import Table from '@/ui/tasks/table';
import { CreateTask } from '@/ui/tasks/buttons';
import { lusitana } from '@/ui/fonts';
import { InvoicesTableSkeleton } from '@/ui/skeletons';
import { Suspense } from 'react';
import { fetchTasksPages } from '@/lib/dal/tasks';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Tasks',
};
export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;  
  const totalPages = await fetchTasksPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Tasks</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search Task..." />
        <CreateTask />
      </div>
       <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}