// @/ui/tasks/table-container.tsx
'use client';

import { useState } from 'react';
import { useTasksFilter, Task } from '@/hooks/use-tasks-filter';
import { FilterButton, UserSelect } from './filter-controls';
import { UpdateTask, DeleteTask } from '@/ui/tasks/buttons';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function TasksTableContainer({ allTasks }: { allTasks: Task[] }): React.ReactElement {
  const { filteredTasks, updateFilter, filters, uniqueUsers } = useTasksFilter(allTasks);
  const [titleInput, setTitleInput] = useState('');

  const handleSearch = () => updateFilter('appliedTitle', titleInput);

  return (
    // התיקון: שימוש ב-overflow-x-auto בלבד מאפשר ל-Layout לנהל את הגלילה האנכית
    <div className="rounded-xl bg-white shadow-md border border-gray-200 overflow-x-auto w-full">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr className="text-left text-xs font-bold uppercase tracking-wider text-gray-500">
            <th className="px-6 py-5 min-w-[250px]">
              <span className="flex items-center gap-1">Title</span>
              <div className="mt-3 flex shadow-sm rounded-md overflow-hidden">
                <input
                  className="block w-full border-gray-300 py-1.5 px-3 text-[11px] font-normal focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none border"
                  placeholder="Search by title..."
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button 
                  onClick={handleSearch}
                  className="bg-blue-600 px-3 text-white hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <MagnifyingGlassIcon className="h-4 w-4" />
                </button>
              </div>
            </th>

            <th className="px-4 py-5">
              Assignee
              <div className="mt-3">
                <UserSelect users={uniqueUsers} value={filters.user} onChange={(v) => updateFilter('user', v)} />
              </div>
            </th>

            <th className="px-4 py-5">
              Priority
              <div className="flex gap-1 mt-3">
                {['URGENT', 'HIGH', 'MEDIUM', 'LOW'].map(p => (
                  <FilterButton 
                    key={p} 
                    label={p} 
                    active={filters.priority === p} 
                    onClick={() => updateFilter('priority', p)}
                    colorClass="bg-orange-100 text-orange-700 border-orange-200" 
                  />
                ))}
              </div>
            </th>

            <th className="px-4 py-5">
              Status
              <div className="flex gap-1 mt-3">
                {['TODO', 'IN_PROGRESS', 'DONE'].map(s => (
                  <FilterButton 
                    key={s} 
                    label={s.replace('_', ' ')} 
                    active={filters.status === s} 
                    onClick={() => updateFilter('status', s)}
                    colorClass="bg-blue-100 text-blue-700 border-blue-200" 
                  />
                ))}
              </div>
            </th>

            <th className="px-4 py-5">
              Filter View
              <div className="mt-3">
                <select
                  className="block w-full rounded-md border border-gray-300 py-1.5 px-2 text-[11px] font-medium outline-none focus:ring-1 focus:ring-blue-500 bg-white shadow-sm cursor-pointer"
                  value={filters.actionView}
                  onChange={(e) => updateFilter('actionView', e.target.value as 'ACTIVE' | 'DELETED' | 'ALL')}
                >
                  <option value="ACTIVE">🟢 Active Tasks</option>
                  <option value="DELETED">📂 Archive (Deleted)</option>
                  <option value="ALL">🔍 Show All</option>
                </select>
              </div>
            </th>

            <th className="py-5 pl-6 pr-8 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-100">
          {filteredTasks.map((task) => (
            <tr key={task.id} className="hover:bg-gray-50 transition-colors group">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {task.title}
                </div>
              </td>
              
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-[10px] font-bold mr-2">
                    {task.user?.name?.charAt(0) || '?'}
                  </div>
                  <span className="text-sm text-gray-600">{task.user?.name || 'Unassigned'}</span>
                </div>
              </td>

              <td className="px-4 py-4 whitespace-nowrap">
                <span className={clsx(
                  "px-2 py-1 rounded text-[10px] font-bold border",
                  task.priority === 'URGENT' ? "bg-red-50 text-red-700 border-red-100" :
                  task.priority === 'HIGH' ? "bg-orange-50 text-orange-700 border-orange-100" :
                  task.priority === 'MEDIUM' ? "bg-yellow-50 text-yellow-700 border-yellow-100" :
                  "bg-green-50 text-green-700 border-green-100"
                )}>
                  {task.priority}
                </span>
              </td>

              <td className="px-4 py-4 whitespace-nowrap">
                <span className={clsx(
                  "px-2 py-1 rounded-full text-[10px] font-bold flex items-center w-fit gap-1.5",
                  task.status === 'DONE' ? "bg-emerald-100 text-emerald-700" :
                  task.status === 'IN_PROGRESS' ? "bg-blue-100 text-blue-700" :
                  "bg-gray-100 text-gray-600"
                )}>
                  <span className={clsx(
                    "h-1.5 w-1.5 rounded-full",
                    task.status === 'DONE' ? "bg-emerald-500" :
                    task.status === 'IN_PROGRESS' ? "bg-blue-500" : "bg-gray-400"
                  )} />
                  {task.status.replace('_', ' ')}
                </span>
              </td>

              <td className="px-4 py-4 whitespace-nowrap">
                <span className={clsx(
                  "text-[10px] font-bold px-2 py-1 rounded border",
                  task.isDeleted 
                    ? "bg-gray-100 text-gray-500 border-gray-200 italic" 
                    : "bg-blue-50 text-blue-600 border-blue-100"
                )}>
                  {task.isDeleted ? 'ARCHIVED' : 'ACTIVE'}
                </span>
              </td>

              <td className="py-4 pl-6 pr-8 whitespace-nowrap text-right">
                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <UpdateTask id={task.id} />
                  <DeleteTask id={task.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredTasks.length === 0 && (
        <div className="bg-gray-50 flex flex-col items-center justify-center py-16">
          <MagnifyingGlassIcon className="h-8 w-8 text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">No tasks match your selection</p>
        </div>
      )}
    </div>
  );
}