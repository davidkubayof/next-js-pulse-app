'use client';

import { useEffect } from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon, HomeIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps): React.JSX.Element {
  useEffect(() => {
    // מומלץ לשלוח כאן את השגיאה למערכת ניטור חיצונית
    console.error('Captured Error:', error);
  }, [error]);

  const buttonClasses = "flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all active:scale-95 shadow-sm";

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      {/* Container לאייקון עם אפקט עדין */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/10 mb-6">
        <ExclamationTriangleIcon className="h-10 w-10 text-red-600 dark:text-red-500" />
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
        אופס, משהו השתבש
      </h1>

      <p className="mt-3 max-w-md text-base text-gray-600 dark:text-gray-400">
        נתקלנו בשגיאה לא צפויה בזמן טעינת העמוד.
        {error.digest && (
          <span className="mt-2 block font-mono text-[10px] text-gray-400 uppercase">
            Error Ref: {error.digest}
          </span>
        )}
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        {/* כפתור ניסיון חוזר - ראשי */}
        <button
          onClick={reset}
          className={clsx(
            buttonClasses,
            "bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600"
          )}
        >
          <ArrowPathIcon className="h-4 w-4" />
          נסה שוב
        </button>

        {/* כפתור חזרה הביתה - משני */}
        <button
          onClick={() => window.location.href = '/'}
          className={clsx(
            buttonClasses,
            "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800"
          )}
        >
          <HomeIcon className="h-4 w-4" />
          חזרה לדף הבית
        </button>
      </div>
    </main>
  );
}