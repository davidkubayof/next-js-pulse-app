'use client';

import { useAuditFilters } from '@/hooks/use-audit-filters';

const ACTIONS = ['CREATE', 'UPDATE', 'DELETE', 'RESTORED'];

/**
 * FilterBar - רכיב סינון מרכזי ליומני מערכת
 */
export default function FilterBar() {
  const { setFilter, searchParams } = useAuditFilters();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
      {/* סינון לפי משתמש */}
      <FilterInput 
        label="User" 
        placeholder="Search user..." 
        onChange={(v: string) => setFilter(v, 'user')}
        defaultValue={searchParams.get('user')}
      />
      
      {/* סינון לפי סוג פעולה */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-gray-500 uppercase">Action</label>
        <select
          className="h-10 px-3 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setFilter(e.target.value, 'action')}
          defaultValue={searchParams.get('action') || ''}
        >
          <option value="">All Actions</option>
          {ACTIONS.map(action => (
            <option key={action} value={action}>{action}</option>
          ))}
        </select>
      </div>

      {/* סינון לפי פירוט (Details) */}
      <FilterInput 
        label="Details" 
        placeholder="Search details..." 
        onChange={(v: string) => setFilter(v, 'details')}
        defaultValue={searchParams.get('details')}
      />
    </div>
  );
}

/**
 * FilterInput - רכיב קלט מיועד לסינונים
 */
interface FilterInputProps {
  label: string;
  placeholder: string;
  onChange: (v: string) => void;
  defaultValue: string | null;
}

function FilterInput({ label, placeholder, onChange, defaultValue }: FilterInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        className="h-10 px-3 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
        onChange={(e) => onChange(e.target.value)}
        defaultValue={defaultValue || ''}
      />
    </div>
  );
}