// 'use client';

// import { useOptimistic } from 'react';
// // import { updateTaskStatus } from '@/lib/actions';
// // import { Task } from '@/lib/definitions';

// export default function TaskGrid({ initialTasks }: { initialTasks: Task[] }) {
//   // הגדרת מצב אופטימי - אם השרת נכשל, זה חוזר אוטומטית למצב הקודם
//   const [optimisticTasks, toggleTaskStatus] = useOptimistic(
//     initialTasks,
//     (state, taskId: string) => {
//       return state.map((task) =>
//         task.id === taskId 
//           ? { ...task, status: task.status === 'Todo' ? 'Done' : 'Todo' } 
//           : task
//       );
//     }
//   );

//   async function handleStatusChange(taskId: string) {
//     // 1. עדכון ויזואלי מיידי
//     toggleTaskStatus(taskId);
    
//     // 2. ביצוע הפעולה בשרת (כולל הדיליי של ה-500ms וה-Audit Log)
//     // await updateTaskStatus(taskId);
//   }

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//       {optimisticTasks.map((task) => (
//         <div key={task.id} className={`task-card ${task.status === 'Done' ? 'completed' : ''}`}>
//           <div className="flex justify-between items-start mb-4">
//             <h3 className="font-semibold text-lg">{task.title}</h3>
//             <span className={`badge ${task.priority.toLowerCase()}`}>
//               {task.priority}
//             </span>
//           </div>
          
//           <div className="text-sm text-gray-500 mb-6">
//             נוצר ב: {new Date(task.createdAt).toLocaleDateString('he-IL')}
//           </div>

//           <button
//             onClick={() => handleStatusChange(task.id)}
//             className={`w-full py-2 rounded-md border transition-colors ${
//               task.status === 'Done' 
//                 ? 'bg-green-50 border-green-200 text-green-700' 
//                 : 'bg-white border-gray-300 hover:border-indigo-500'
//             }`}
//           >
//             {task.status === 'Done' ? '✓ בוצע' : 'סמן כבוצע'}
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }