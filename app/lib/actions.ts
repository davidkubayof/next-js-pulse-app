'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '../../auth';
import { AuthError } from 'next-auth';
import { auth } from '../../auth';
import {
  createTaskFormSchema,
  updateTaskFormSchema,
  updateTaskStatusSchema,
} from '@/lib/validation/task';
import {
  createTaskRecord,
  softDeleteTaskRecord,
  updateTaskRecord,
  updateTaskStatusRecord,
} from '@/lib/dal/tasks';
import { restoreDeletedTask } from '@/lib/dal/archive';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function updateTaskStatus(id: string, status: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be logged in.');
  }

  const parsed = updateTaskStatusSchema.safeParse({ id, status });
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((e) => e.message).join(', '));
  }

  await updateTaskStatusRecord(
    parsed.data.id,
    parsed.data.status,
    session.user.id,
  );
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/auditlog');
}

export type State = {
  errors?: {
    userId?: string[];
    title?: string[];
    status?: string[];
    priority?: string[];
    description?: string[];
  };
  message?: string | null;
};

export async function createTask(prevState: State, formData: FormData): Promise<State> {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: 'You must be logged in.', errors: {} };
  }

  const validatedFields = createTaskFormSchema.safeParse({
    userId: formData.get('userId'),
    title: formData.get('title'),
    description: formData.get('description'),
    status: formData.get('status'),
    priority: formData.get('priority'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Could not create task.',
    };
  }

  const { userId, title, description, status, priority } = validatedFields.data;

  try {
    await createTaskRecord(
      {
        userId,
        title,
        description: description?.trim() ? description.trim() : null,
        status,
        priority,
      },
      session.user.id,
    );
  } catch {
    return {
      message: 'Database error: failed to create task.',
      errors: {},
    };
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/tasks');
  revalidatePath('/dashboard/auditlog');
  redirect('/dashboard/tasks');
}

export async function updateTask(
  id: string,
  prevState: State,
  formData: FormData,
): Promise<State> {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: 'You must be logged in.', errors: {} };
  }

  const validatedFields = updateTaskFormSchema.safeParse({
    userId: formData.get('userId'),
    title: formData.get('title'),
    description: formData.get('description'),
    status: formData.get('status'),
    priority: formData.get('priority'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Could not update task.',
    };
  }

  const { userId, title, description, status, priority } = validatedFields.data;

  try {
    await updateTaskRecord(
      id,
      {
        title,
        description: description?.trim() ? description.trim() : null,
        userId,
        status,
        priority,
      },
      session.user.id,
    );
  } catch {
    return {
      message: 'Database error: failed to update task.',
      errors: {},
    };
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/tasks');
  revalidatePath('/dashboard/auditlog');
  redirect('/dashboard/tasks');
}

export async function deleteTask(id: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be logged in to delete a task.');
  }

  await softDeleteTaskRecord(id, session.user.id);

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/tasks');
  revalidatePath('/dashboard/auditlog');
  revalidatePath('/dashboard/archive');
}

export async function restoreTaskAction(id: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be logged in to restore a task.');
  }

  await restoreDeletedTask(id, session.user.id);

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/archive');
  revalidatePath('/dashboard/tasks');
  revalidatePath('/dashboard/auditlog');
}
