/** Artificial delay for demonstrating loading / skeleton UX (DAL reads). */
export const DEMO_READ_DELAY_MS = 500;

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
