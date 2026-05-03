import EditTaskForm from '@/ui/tasks/edit-form';
import Breadcrumbs from '@/ui/tasks/breadcrumbs';
import { fetchTaskById } from '@/lib/dal/tasks';
import { fetchUsers } from '@/lib/dal/users';
import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [task, users] = await Promise.all([
    fetchTaskById(id),
    fetchUsers(),
  ]);
  if (!task) {
    notFound();
  }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Task', href: '/dashboard/tasks' },
          {
            label: 'Edit Task',
            href: `/dashboard/tasks/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditTaskForm task={task} users={users} />
    </main>
  );
}