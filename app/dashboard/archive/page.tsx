import { restoreTaskAction } from '@/lib/actions';
import { fetchDeletedTasks } from '@/lib/dal/archive';
import { ArrowPathIcon, TrashIcon } from '@heroicons/react/24/outline';

export default async function Page() {
  const deletedTasks = await fetchDeletedTasks();

  return (
    <main className="w-full px-6 py-8">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Task Archive</h1>
      </div>

      <div className="mt-8 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            {deletedTasks.length === 0 ? (
              // עיצוב למצב שאין נתונים
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-md border border-dashed border-gray-300">
                <TrashIcon className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-xl font-medium text-gray-600">The archive is empty</p>
                <p className="text-gray-400">Deleted tasks will appear here.</p>
              </div>
            ) : (
              // הטבלה במידה ויש נתונים
              <table className="min-w-full text-gray-900 md:table">
                <thead className="rounded-lg text-left text-sm font-normal">
                  <tr>
                    <th className="px-4 py-5 font-medium">Task</th>
                    <th className="px-3 py-5 font-medium">User</th>
                    <th className="px-3 py-5 font-medium">Deleted At</th>
                    <th className="relative py-3 pl-6 pr-3">
                      <span className="sr-only">Restore</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {deletedTasks.map((task) => (
                    <tr key={task.id} className="w-full border-b py-3 text-sm last-of-type:border-none">
                      <td className="whitespace-nowrap px-4 py-3 font-medium">
                        {task.title}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-gray-500">
                        {task.user.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-gray-500">
                        {new Date(task.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <form action={restoreTaskAction.bind(null, task.id)}>
                            <button
                              type="submit"
                              className="group flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 transition-all hover:bg-emerald-100 hover:border-emerald-300 active:scale-95 shadow-sm"
                            >
                              <ArrowPathIcon className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 duration-500" />
                              <span>Restore Task</span>
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}