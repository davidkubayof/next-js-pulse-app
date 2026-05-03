'use client';

import { useOptimistic, useTransition } from 'react';
import { lusitana } from '@/ui/fonts';
import { CheckCircleIcon, ClockIcon, PlayIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
// וודא שיש לך את האקשן הזה בנתיב הנכון
import { updateTaskStatus } from '@/lib/actions'; 

export default function TaskList({ initialTasks }: { initialTasks: any[] }) {
  const [isPending, startTransition] = useTransition();

  // Optimistic UI - מעדכן את הרשימה מיד ללא המתנה לשרת
  const [optimisticTasks, addOptimisticTask] = useOptimistic(
    initialTasks,
    (state, { id, newStatus }) =>
      state.map((task) => (task.id === id ? { ...task, status: newStatus } : task))
  );

  const handleStatusChange = async (id: string, currentStatus: string) => {
    // לוגיקת החלפת סטטוסים
    let nextStatus = 'TODO';
    if (currentStatus === 'TODO') nextStatus = 'IN_PROGRESS';
    else if (currentStatus === 'IN_PROGRESS') nextStatus = 'COMPLETED';

    startTransition(async () => {
      addOptimisticTask({ id, newStatus: nextStatus });
      try {
        await updateTaskStatus(id, nextStatus);
      } catch (error) {
        console.error("Failed to update task:", error);
      }
    });
  };

  return (
    <div className="w-full md:col-span-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className={`${lusitana.className} text-xl md:text-2xl text-gray-800`}>
          Recent Tasks
        </h2>
        {isPending && <ArrowPathIcon className="h-5 w-5 animate-spin text-blue-500" />}
      </div>

      <div className="flex-grow rounded-xl bg-gray-50 p-4 shadow-sm">
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
          {optimisticTasks.map((task) => (
            <div 
              key={task.id} 
              className="flex items-center justify-between border-b border-gray-50 p-4 last:border-0 hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex flex-col gap-1 min-w-0">
                <span className="font-semibold text-gray-900 truncate">{task.title}</span>
                <div className="flex items-center gap-2">
                   <span className="text-[11px] text-gray-400 tabular-nums">
                    {new Date(task.createdAt).toLocaleDateString('he-IL')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleStatusChange(task.id, task.status)}
                disabled={isPending}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all
                  active:scale-95 disabled:opacity-50
                  ${task.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border border-green-200' : 
                    task.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 
                    'bg-gray-50 text-gray-600 border border-gray-200'}
                `}
              >
                {task.status === 'COMPLETED' && <CheckCircleIcon className="h-4 w-4" />}
                {task.status === 'IN_PROGRESS' && <PlayIcon className="h-4 w-4" />}
                {task.status === 'TODO' && <ClockIcon className="h-4 w-4" />}
                
                <span className="uppercase tracking-wider">
                  {task.status === 'IN_PROGRESS' ? 'In Progress' : task.status}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}