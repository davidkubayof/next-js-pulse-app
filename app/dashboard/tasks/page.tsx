// @/app/tasks/page.tsx
import TasksTableContainer from '@/ui/tasks/table-container';
import { fetchFilteredTasks } from '@/lib/dal/tasks';
import { lusitana } from '@/ui/fonts';

export default async function Page(): Promise<React.JSX.Element> {
  const allTasks = await fetchFilteredTasks(); 

  return (
    // הסרנו h-full כדי לאפשר לתוכן לזרום בתוך ה-Scroll של ה-Layout
    <div className="w-full">
      <h1 className={`${lusitana.className} text-2xl mb-6 text-gray-800`}>
        Tasks Management
      </h1>
      <TasksTableContainer allTasks={allTasks} />
    </div>
  );
}