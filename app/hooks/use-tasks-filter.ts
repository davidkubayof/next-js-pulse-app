// @/ui/tasks/use-tasks-filter.ts
import { useState, useMemo } from 'react';

// הגדרת המבנה של משימה בודדת - זה יפתור את ה-any
export interface Task {
  id: string;
  title: string;
  isDeleted?: boolean;
  priority: string;
  status: string;
  user?: {
    name: string;
  };
}

type FilterState = {
  appliedTitle: string;
  user: string;
  priority: string;
  status: string;
  actionView: 'ACTIVE' | 'DELETED' | 'ALL';
};

// הגדרת טיפוס למה שהפונקציה מחזירה - פותר את שגיאת ה-Missing return type
interface UseTasksFilterReturn {
  filteredTasks: Task[];
  updateFilter: (key: keyof FilterState, value: string) => void;
  filters: FilterState;
  uniqueUsers: string[];
}

export function useTasksFilter(initialTasks: Task[]): UseTasksFilterReturn {
  const [filters, setFilters] = useState<FilterState>({
    appliedTitle: '',
    user: '',
    priority: '',
    status: '',
    actionView: 'ACTIVE'
  });

  const filteredTasks = useMemo(() => {
    if (!initialTasks) return [];
    return initialTasks.filter((task) => {
      const isDeleted = !!task.isDeleted;
      const matchesAction = 
        filters.actionView === 'ALL' ? true :
        filters.actionView === 'DELETED' ? isDeleted : !isDeleted;

      const matchesTitle = task.title.toLowerCase().includes(filters.appliedTitle.toLowerCase());
      const matchesUser = !filters.user || task.user?.name === filters.user;
      const matchesPriority = !filters.priority || task.priority === filters.priority;
      const matchesStatus = !filters.status || task.status === filters.status;

      return matchesAction && matchesTitle && matchesUser && matchesPriority && matchesStatus;
    });
  }, [filters, initialTasks]);

  const updateFilter = (key: keyof FilterState, value: string): void => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === value && !['appliedTitle', 'actionView'].includes(key) ? '' : value
    }));
  };

  const uniqueUsers = useMemo(() => {
    const names = initialTasks?.map(t => t.user?.name).filter((name): name is string => Boolean(name)) || [];
    return Array.from(new Set(names)).sort();
  }, [initialTasks]);

  return { filteredTasks, updateFilter, filters, uniqueUsers };
}