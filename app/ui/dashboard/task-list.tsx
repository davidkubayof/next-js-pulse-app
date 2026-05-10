import { fetchLatestTasks } from '@/lib/dal/tasks';
import TaskList from './revenue-chart'; 
import { lusitana } from '@/ui/fonts';
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

export default async function LatestTasksWrapper({ userId }: { userId?: string }): Promise<React.JSX.Element> {
  const tasks = await fetchLatestTasks({ userId });

  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex w-full flex-col md:col-span-4">
        {/* כותרת כדי לשמור על המבנה של הדף */}
        <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl text-gray-800`}>
          Latest Tasks
        </h2>
        
        {/* קופסה מעוצבת למצב ריק */}
        <div className="flex grow flex-col justify-center items-center rounded-xl bg-gray-50 p-8 shadow-sm border border-dashed border-gray-200">
          <div className="flex flex-col items-center gap-2">
            <ClipboardDocumentCheckIcon className="h-12 w-12 text-gray-300" />
            <p className="text-gray-500 font-medium">No tasks found</p>
            <p className="text-sm text-gray-400">Everything is up to date!</p>
          </div>
        </div>
      </div>
    );
  }

  return <TaskList initialTasks={tasks} />;
}