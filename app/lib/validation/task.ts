import { z } from 'zod';
import { TASK_PRIORITIES, TASK_STATUSES } from '@/lib/taskEnums';

export const taskStatusSchema = z.enum(TASK_STATUSES);
export const taskPrioritySchema = z.enum(TASK_PRIORITIES);

export const createTaskFormSchema = z.object({
  userId: z.string().min(1, 'Please select a user.'),
  title: z.string().min(1, 'Please enter a title.'),
  description: z.string().optional(),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
});

export const updateTaskFormSchema = createTaskFormSchema;

export const updateTaskStatusSchema = z.object({
  id: z.string().min(1),
  status: taskStatusSchema,
});
