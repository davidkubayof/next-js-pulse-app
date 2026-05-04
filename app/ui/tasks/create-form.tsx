'use client';

import { useActionState } from 'react';
import { createTask, State } from '@/lib/actions';
import Link from 'next/link';
import {
  TagIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  UserCircleIcon,
  QueueListIcon,
  XMarkIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/ui/button';
import { TASK_PRIORITIES, TASK_STATUSES } from '@/lib/taskEnums';

export default function TaskForm({
  users,
}: {
  users: { id: string; name: string }[];
}): React.JSX.Element {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(createTask, initialState);

  const inputClasses = "peer block w-full rounded-lg border border-gray-300 py-2.5 pl-10 text-sm outline-none placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-200 shadow-sm bg-white";
  const labelClasses = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600 ml-0.5";

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full py-8 pb-20">
      <form action={formAction} className="w-full max-w-3xl space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

          {/* Header */}
          <div className="bg-gray-50/50 border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <QueueListIcon className="h-5 w-5 text-gray-700" />
              Task Specification
            </h2>
          </div>

          <div className="p-6 space-y-5">
            {/* User Selection */}
            <div>
              <label htmlFor="userId" className={labelClasses}>Assignee</label>
              <div className="relative group">
                <select id="userId" name="userId" className={inputClasses} defaultValue="" aria-describedby="user-error">
                  <option value="" disabled>Select team member</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
                <UserCircleIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400 group-focus-within:text-gray-900" />
              </div>
              {state.errors?.userId && (
                <p id="user-error" className="mt-1 text-[11px] font-medium text-red-600 flex items-center gap-1">
                  <ExclamationCircleIcon className="h-3 w-3" /> {state.errors.userId[0]}
                </p>
              )}
            </div>

            {/* Task Title */}
            <div>
              <label htmlFor="title" className={labelClasses}>Task Title</label>
              <div className="relative group">
                <input id="title" name="title" type="text" placeholder="What needs to be done?" className={inputClasses} aria-describedby="title-error" />
                <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400 group-focus-within:text-gray-900" />
              </div>
              {state.errors?.title && (
                <p id="title-error" className="mt-1 text-[11px] font-medium text-red-600 flex items-center gap-1">
                  <ExclamationCircleIcon className="h-3 w-3" /> {state.errors.title[0]}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className={labelClasses}>Description (Optional)</label>
              <div className="relative group">
                <textarea id="description" name="description" placeholder="Provide context or steps..." className={`${inputClasses} min-h-[100px] py-3 resize-none`} />
                <DocumentTextIcon className="absolute left-3 top-4 h-[18px] w-[18px] text-gray-400 group-focus-within:text-gray-900" />
              </div>
            </div>

            {/* Priority & Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="priority" className={labelClasses}>Priority Level</label>
                <div className="relative group">
                  <select id="priority" name="priority" className={inputClasses} defaultValue="MEDIUM" aria-describedby="priority-error">
                    {TASK_PRIORITIES.map((p) => (
                      <option key={p} value={p}>{p.replace('_', ' ')}</option>
                    ))}
                  </select>
                  <ExclamationCircleIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400 group-focus-within:text-gray-900" />
                </div>
                {state.errors?.priority && (
                  <p id="priority-error" className="mt-1 text-[11px] font-medium text-red-600 flex items-center gap-1">
                    <ExclamationCircleIcon className="h-3 w-3" /> {state.errors.priority[0]}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="status" className={labelClasses}>Status</label>
                <div className="relative group">
                  <select id="status" name="status" className={inputClasses} defaultValue="TODO" aria-describedby="status-error">
                    {TASK_STATUSES.map((s) => (
                      <option key={s} value={s}>{s.replace('_', ' ')}</option>
                    ))}
                  </select>
                  <ExclamationCircleIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400 group-focus-within:text-gray-900" />
                </div>
                {state.errors?.status && (
                  <p id="status-error" className="mt-1 text-[11px] font-medium text-red-600 flex items-center gap-1">
                    <ExclamationCircleIcon className="h-3 w-3" /> {state.errors.status[0]}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Footer - מיושר לימין (justify-end) */}
          <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3">
            <Link
              href="/dashboard/tasks"
              className="group flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 border border-transparent hover:border-red-100 hover:bg-red-50 rounded-lg transition-all active:scale-95"
            >
              <XMarkIcon className="h-4 w-4 text-red-500 group-hover:rotate-90 transition-transform duration-200" />
              Cancel
            </Link>

            <Button
              type="submit"
              className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md shadow-gray-200 transition-all active:scale-[0.98]"
            >
              <PlusIcon className="h-4 w-4" />
              Create Task
            </Button>
          </div>
        </div>

        {/* Server Error Message */}
        {state.message && (
          <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex items-center gap-2 text-red-700 shadow-sm animate-in fade-in slide-in-from-top-1">
            <ExclamationCircleIcon className="h-4 w-4" />
            <span className="text-xs font-bold">{state.message}</span>
          </div>
        )}
      </form>
    </div>
  );
}