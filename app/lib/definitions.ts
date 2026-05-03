import type { Task } from '@prisma/client';

export type TaskFormFields = Pick<
  Task,
  'id' | 'userId' | 'title' | 'description' | 'status' | 'priority'
>;

/** Minimal assignee row for task forms (no secrets). */
export type AssigneePickerUser = {
  id: string;
  name: string;
};
