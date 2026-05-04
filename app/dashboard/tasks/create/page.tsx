import Form from '@/ui/tasks/create-form';
import Breadcrumbs from '@/ui/tasks/breadcrumbs';
import { fetchUsers } from '@/lib/dal/users';
 
export default async function Page(): Promise<React.JSX.Element> {
  const users = await fetchUsers();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Tasks', href: '/dashboard/tasks' },
          {
            label: 'Create Task',
            href: '/dashboard/tasks/create',
            active: true,
          },
        ]}
      />
      <Form users={users} />
    </main>
  );
}