// @/ui/tasks/filter-controls.tsx
import clsx from 'clsx';
// כפתור סינון בודד
export const FilterButton = ({ 
  label, 
  active, 
  onClick, 
  colorClass 
}: { label: string, active: boolean, onClick: () => void, colorClass: string }): React.ReactElement => (
  <button
    onClick={onClick}
    className={clsx(
      'px-2 py-1 rounded-md text-[10px] font-bold border transition-all',
      active ? colorClass : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
    )}
  >
    {label}
  </button>
);

// Select למשתמשים
export const UserSelect = ({ users, value, onChange }: { users: string[], value: string, onChange: (v: string) => void }): React.ReactElement => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="mt-2 block w-full rounded-md border border-gray-200 py-1 px-2 text-[11px] font-normal outline-none focus:ring-1 focus:ring-blue-500"
  >
    <option value="">All Users</option>
    {users.map(user => <option key={user} value={user}>{user}</option>)}
  </select>
);