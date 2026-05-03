'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '../../auth';
import { AuthError } from 'next-auth';
import { auth } from '../../auth'; // כדי לדעת מי המשתמש שמחק
import { prisma } from "@/lib/db";
import { restoreTask } from '@/lib/dal/archive';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
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
export async function updateTaskStatus(id: string, status: string) {
  try {
    await prisma.task.update({
      where: { id },
      data: { status },
    });

    // זה יגרום ל-Next.js לעדכן את הנתונים ברקע
    revalidatePath('/dashboard');
  } catch (error) {
    console.error('Failed to update task:', error);
  }
}
const FormSchema = z.object({
 id: z.string(),
  
  // פתרון ל-String: הודעה בתוך ה-min
  userId: z.string().min(1, "Please select a user."),
  
  title: z.string().min(1, "Please enter a title."),
  
  description: z.string().optional(),

  // פתרון ל-Enum: הגדרה נקייה ללא אובייקט הגדרות
  // השגיאה שלך נבעה מהניסיון להכניס אובייקט כפרמטר שני
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED']),

  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  
  date: z.string(),
});

export type State = {
  errors?: {
    userId?: string[];
    title?: string[];
    status?: string[];
    priority?: string[]; // פשוט מוסיפים את כל השדות האופציונליים כאן
    description?: string[];
  };
  message?: string | null;
};
const CreateTask = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function createTask(prevState: State, formData: FormData) {
  // 1. וולידציה (בדיוק כמו ב-Invoice)
  const validatedFields = CreateTask.safeParse({
    userId: formData.get('userId'),
    title: formData.get('title'),
    description: formData.get('description'),
    status: formData.get('status'),
    priority: formData.get('priority'),
  });

  // 2. אם נכשל - החזרת שגיאות
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Task.',
    };
  }

  // 3. הכנת הנתונים (כאן נכנס השינוי לפריזמה)
  const { userId, title, description, status, priority } = validatedFields.data;

  try {
    // שימוש ב-Prisma במקום SQL גולמי
    await prisma.task.create({
      data: {
        userId,
        title,
        description: description || "", // מוודא שלא נכנס null אם לא חובה
        status,
        priority,
        // createdAt נוצר אוטומטית לפי הסכימה שלך
      },
    });
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Task.',
    };
  }

  // 4. ריענון וניתוב
  revalidatePath('/dashboard/tasks');
  redirect('/dashboard/tasks');
}
export async function updateTask(
  id: string,
  prevState: State,
  formData: FormData,
): Promise<State> {
  const title = formData.get('title') as string;
  const userId = formData.get('userId') as string;
  const status = formData.get('status') as string;

  try {
    await prisma.task.update({
      where: { id },
      data: {
        title,
        userId,
        status,
      },
    });
    // הערה: לא שמים כאן return! 
    // אנחנו רוצים שהקוד ימשיך ל-revalidate ול-redirect למטה.
  } catch (e) {
    // רק במקרה של שגיאה אנחנו עוצרים ומחזירים תשובה לטופס
    return {
      message: 'Database Error: Failed to Update Task.',
      errors: {},
    };
  }

  // השורות האלו עכשיו ירוצו (הן כבר לא יהיו אפורות)
  revalidatePath('/dashboard/tasks');
  redirect('/dashboard/tasks');
}
export async function deleteTask(id: string) { // הסרנו את formData
  const session = await auth();
  
  // הגנה בסיסית - אם אין משתמש, אין הרשאה
  if (!session?.user?.id) {
    throw new Error('You must be logged in to delete a task.');
  }

  const userId = session.user.id;

  try {
    await prisma.$transaction(async (tx) => {
      // עדכון המשימה
      const deletedTask = await tx.task.update({
        where: { id },
        data: { isDeleted: true },
      });

      // יצירת לוג
      await tx.auditLog.create({
        data: {
          action: 'DELETE_TASK',
          entityId: id,
          userId: userId,
          details: `Task titled "${deletedTask.title}" was moved to archive.`,
        },
      });
    });

    revalidatePath('/dashboard/tasks');
    revalidatePath('/dashboard/logs');
    
  } catch (e) {
    console.error('Database Error:', e);
    throw new Error('Failed to Delete Task');
  }
}
export async function restoreTaskAction(id: string) {
  await restoreTask(id);
  revalidatePath('/dashboard/archive');
  revalidatePath('/dashboard/tasks');
}
