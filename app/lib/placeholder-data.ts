// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
// נתונים מותאמים לסכימה שלך: User, Task
const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'Ran Dev',
    email: 'ran@example.com',
    // password: 'password123', 
  },
  {
    id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    name: 'Lee Robinson',
    email: 'lee@nextmail.com',
    // password: 'password123',
  },
];

const tasks = [
  {
    id: 'task-1',
    title: 'הגדרת Prisma',
    description: 'לסיים את הגדרת ה-Client וה-Seed',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    userId: users[0].id, // מקושר למשתמש הראשון
  },
  {
    id: 'task-2',
    title: 'בניית דף דאשבורד',
    description: 'עיצוב ה-UI עם Tailwind',
    priority: 'MEDIUM',
    status: 'TODO',
    userId: users[0].id,
  },
  {
    id: 'task-3',
    title: 'אופטימיזציה של שאילתות',
    description: 'שיפור ביצועי ה-Fetch',
    priority: 'LOW',
    status: 'TODO',
    userId: users[1].id, // מקושר למשתמש השני
  },
];

// דוגמה ללוגים (AuditLog)
const logs = [
  {
    id: 'log-1',
    action: 'USER_LOGIN',
    details: 'User logged in from Chrome',
    entityId: users[0].id,
    userId: users[0].id,
  },
  {
    id: 'log-2',
    action: 'TASK_CREATED',
    details: 'Created task-1',
    entityId: 'task-1',
    userId: users[0].id,
  }
];

export { users, tasks, logs };