import {
  ClockIcon,            
  CheckCircleIcon,     
  QueueListIcon,      
  ListBulletIcon, 
} from '@heroicons/react/24/outline';
import { lusitana } from '@/ui/fonts';
import { fetchCardData } from '@/lib/dal/tasks';
import { fetchDailyLogsCount } from '@/lib/dal/auditLog';

const iconMap = {
  active: ClockIcon,
  completed: CheckCircleIcon,
  total: QueueListIcon,
  logs: ListBulletIcon,
};
export default async function CardWrapper() {
 const { 
    totalTasksCount, 
    inProgressCount, 
    completedCount 
  } = await fetchCardData();
  const count = await fetchDailyLogsCount();
  return (
    <>
      <Card title="In Progress" value={inProgressCount} type="active" />
      <Card title="Completed" value={completedCount} type="completed" />
      <Card title="Audit Logs Daily" value={count} type="logs" />
      <Card title="Total Tasks" value={totalTasksCount} type="total" />
    </>
  );
}
export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'active' | 'completed' | 'total' | 'logs';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
