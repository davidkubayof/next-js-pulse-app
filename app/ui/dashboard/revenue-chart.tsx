'use client';

import type { Task } from '@prisma/client';
import { useOptimistic, useTransition } from 'react';
import { lusitana } from '@/ui/fonts';
import {
  CheckCircleIcon,
  ClockIcon,
  PlayIcon,
  ArrowPathIcon,
  NoSymbolIcon,
} from '@heroicons/react/24/outline';
import { updateTaskStatus } from '@/lib/actions';

type TaskRow = Pick<Task, 'id' | 'title' | 'status' | 'createdAt'>;

export default function TaskList({
  initialTasks,
}: {
  initialTasks: TaskRow[];
}): React.JSX.Element {
  const [isPending, startTransition] = useTransition();

  const [optimisticTasks, addOptimisticTask] = useOptimistic(
    initialTasks,
    (state, update: { id: string; newStatus: string }) =>
      state.map((task) =>
        task.id === update.id ? { ...task, status: update.newStatus } : task,
      ),
  );

  const handleStatusChange = async (
    id: string,
    currentStatus: string,
  ): Promise<void> => {
    let nextStatus = 'TODO';
    if (currentStatus === 'TODO') nextStatus = 'IN_PROGRESS';
    else if (currentStatus === 'IN_PROGRESS') nextStatus = 'DONE';
    else nextStatus = 'TODO';

    startTransition(async () => {
      addOptimisticTask({ id, newStatus: nextStatus });
      await updateTaskStatus(id, nextStatus);
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
                type="button"
                onClick={() => handleStatusChange(task.id, task.status)}
                disabled={isPending || task.status === 'CANCELLED'}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all
                  active:scale-95 disabled:opacity-50
                  ${task.status === 'DONE'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : task.status === 'IN_PROGRESS'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : task.status === 'CANCELLED'
                        ? 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                        : 'bg-gray-50 text-gray-600 border border-gray-200'}
                `}
              >
                {task.status === 'DONE' && <CheckCircleIcon className="h-4 w-4" />}
                {task.status === 'IN_PROGRESS' && <PlayIcon className="h-4 w-4" />}
                {task.status === 'TODO' && <ClockIcon className="h-4 w-4" />}
                {task.status === 'CANCELLED' && <NoSymbolIcon className="h-4 w-4" />}

                <span className="uppercase tracking-wider">
                  {task.status === 'IN_PROGRESS' ? 'In Progress' : task.status.replace('_', ' ')}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
