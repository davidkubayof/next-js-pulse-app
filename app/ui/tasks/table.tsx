import { UpdateTask, DeleteTask } from '@/ui/tasks/buttons';
import { fetchFilteredTasks } from '@/lib/dal/tasks';
import { lusitana } from '@/ui/fonts';
import clsx from 'clsx';

export default async function TasksTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}): Promise<React.JSX.Element> {
  const tasks = await fetchFilteredTasks(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-xl bg-gray-50 p-4 shadow-md md:pt-0">
          
          {/* תצוגת מובייל */}
          <div className="md:hidden">
            {tasks?.map((task) => (
              <div
                key={task.id}
                className="mb-3 w-full rounded-lg bg-white p-5 border border-gray-200 shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <p className={`text-base font-bold text-gray-900 ${lusitana.className}`}>{task.title}</p>
                    <p className="text-sm text-gray-500">{task.user?.name}</p>
                  </div>
                  <span className={clsx(
                    'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset',
                    {
                      'bg-gray-100 text-gray-700 ring-gray-200': task.status === 'TODO',
                      'bg-blue-50 text-blue-700 ring-blue-200': task.status === 'IN_PROGRESS',
                      'bg-emerald-50 text-emerald-700 ring-emerald-200': task.status === 'DONE',
                      'bg-neutral-100 text-neutral-700 ring-neutral-200': task.status === 'CANCELLED',
                    }
                  )}>
                    <span className={clsx('mr-1.5 h-1.5 w-1.5 rounded-full', {
                       'bg-gray-500': task.status === 'TODO',
                       'bg-blue-500': task.status === 'IN_PROGRESS',
                       'bg-emerald-500': task.status === 'DONE',
                       'bg-neutral-400': task.status === 'CANCELLED',
                    })} />
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <div className="flex items-center gap-2">
                       <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Priority:</span>
                       <span className={clsx("text-xs font-bold px-2 py-0.5 rounded-md", {
                          'bg-violet-50 text-violet-800': task.priority === 'URGENT',
                          'bg-red-50 text-red-700': task.priority === 'HIGH',
                          'bg-orange-50 text-orange-700': task.priority === 'MEDIUM',
                          'bg-sky-50 text-sky-700': task.priority === 'LOW',
                       })}>{task.priority}</span>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateTask id={task.id} />
                    <DeleteTask id={task.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* תצוגת דסקטופ */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="text-left text-sm font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th scope="col" className="px-6 py-5 sm:pl-8 text-xs">Task Title</th>
                <th scope="col" className="px-3 py-5 text-xs">Assigned To</th>
                <th scope="col" className="px-3 py-5 text-xs">Priority</th>
                <th scope="col" className="px-3 py-5 text-xs">Created Date</th>
                <th scope="col" className="px-3 py-5 text-xs">Status</th>
                <th scope="col" className="relative py-3 pl-6 pr-8 text-right text-xs">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white rounded-b-xl">
              {tasks?.map((task) => (
                <tr key={task.id} className="transition-colors hover:bg-gray-50/50">
                  <td className={`whitespace-nowrap py-4 pl-8 pr-3 text-sm font-bold text-gray-900 ${lusitana.className}`}>
                    {task.title}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600 font-medium">
                    {task.user?.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4">
                    <span className={clsx("inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold ring-1 ring-inset uppercase", {
                      'bg-violet-50 text-violet-800 ring-violet-100': task.priority === 'URGENT',
                      'bg-red-50 text-red-700 ring-red-100': task.priority === 'HIGH',
                      'bg-orange-50 text-orange-700 ring-orange-100': task.priority === 'MEDIUM',
                      'bg-sky-50 text-sky-700 ring-sky-100': task.priority === 'LOW',
                    })}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {new Date(task.createdAt).toLocaleDateString('he-IL')}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4">
                    <span className={clsx(
                      'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset',
                      {
                        'bg-gray-50 text-gray-600 ring-gray-200': task.status === 'TODO',
                        'bg-blue-50 text-blue-700 ring-blue-200': task.status === 'IN_PROGRESS',
                        'bg-emerald-50 text-emerald-700 ring-emerald-200': task.status === 'DONE',
                        'bg-neutral-50 text-neutral-700 ring-neutral-200': task.status === 'CANCELLED',
                      }
                    )}>
                      <span className={clsx('mr-1.5 h-1.5 w-1.5 rounded-full', {
                        'bg-gray-400': task.status === 'TODO',
                        'bg-blue-500': task.status === 'IN_PROGRESS',
                        'bg-emerald-500': task.status === 'DONE',
                        'bg-neutral-400': task.status === 'CANCELLED',
                      })} />
                      {task.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="whitespace-nowrap py-4 pl-6 pr-8 text-right">
                    <div className="flex justify-end gap-3">
                      <UpdateTask id={task.id} />
                      <DeleteTask id={task.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}