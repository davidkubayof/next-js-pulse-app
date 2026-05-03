import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';

export type AuditPayload = {
  action: string;
  entityId: string;
  userId: string;
  details?: string | null;
};

export async function runInTransactionWithAudit<T>(
  callback: (
    tx: Prisma.TransactionClient,
  ) => Promise<{ result: T; audit: AuditPayload }>,
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    const { result, audit } = await callback(tx);
    await tx.auditLog.create({
      data: {
        action: audit.action,
        details: audit.details ?? null,
        entityId: audit.entityId,
        userId: audit.userId,
      },
    });
    return result;
  });
}
