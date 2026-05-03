import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteTask } from '@/lib/actions';

export function CreateTask() {
  return (
    <Link
      href="/dashboard/tasks/create"
      className="flex h-12 items-center gap-3 rounded-xl bg-black px-6 text-base font-bold text-white shadow-lg transition-all hover:bg-neutral-800 hover:shadow-neutral-200 active:scale-95"
    >
      <span className="hidden md:block">New Task</span>
      <PlusIcon className="h-5 w-5 stroke-[2.5px]" />
    </Link>
  );
}

export function UpdateTask({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/tasks/${id}/edit`}
      className="group inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white p-3 text-neutral-500 transition-all hover:border-black hover:text-black hover:shadow-md"
    >
      <PencilIcon className="w-5 transition-transform duration-300 group-hover:-rotate-12" />
    </Link>
  );
}

export function DeleteTask({ id }: { id: string }) {
  const deleteInvoiceWithId = deleteTask.bind(null, id);
  return (
    <form action={deleteInvoiceWithId}>
      <button 
        type="submit" 
        className="group inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white p-3 text-neutral-400 transition-all hover:border-red-500 hover:bg-red-50/50 hover:text-red-600 hover:shadow-md"
      >
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5 transition-all duration-300 group-hover:scale-110" />
      </button>
    </form>
  );
}