import { db } from './index';
import { SQL, and, isNull } from 'drizzle-orm';
import { PgUpdateSetSource, PgTable, AnyPgTable, AnyPgColumn } from 'drizzle-orm/pg-core';
import { getTableColumns } from 'drizzle-orm';

const isSoftDeleteEnabled = process.env.ENABLE_SOFT_DELETE === 'true';

/**
 * Base Repository pattern for Drizzle to globally handle Soft Deletes based on Env variables.
 */
export const baseRepository = <T extends AnyPgTable>(table: T) => {
    const columns = getTableColumns(table);
    const hasDeletedAt = 'deletedAt' in columns;

    return {
        /**
         * Select a single record, automatically filtering out soft-deleted ones if enabled.
         */
        findFirst: async (whereCondition?: SQL): Promise<any> => {
            let finalCondition = whereCondition;

            if (isSoftDeleteEnabled && hasDeletedAt) {
                const deletedAtCol = (columns as Record<string, AnyPgColumn>).deletedAt;
                const notDeleted = isNull(deletedAtCol);
                finalCondition = whereCondition ? and(notDeleted, whereCondition) : notDeleted;
            }

            const query = db.select().from(table as any);
            const result = finalCondition ? await query.where(finalCondition).limit(1) : await query.limit(1);
            return (result as any[])[0];
        },

        /**
         * Select records, automatically filtering out soft-deleted ones if enabled.
         */
        findMany: async (whereCondition?: SQL, customDb: any = db): Promise<any[]> => {
            let finalCondition = whereCondition;

            if (isSoftDeleteEnabled && hasDeletedAt) {
                const deletedAtCol = (columns as Record<string, AnyPgColumn>).deletedAt;
                const notDeleted = isNull(deletedAtCol);
                finalCondition = whereCondition ? and(notDeleted, whereCondition) : notDeleted;
            }

            const query = customDb.select().from(table as any);
            return (finalCondition ? await query.where(finalCondition) : await query) as any[];
        },

        /**
         * Insert a new record into the table. Accepts raw `tx` context optionally for transactions.
         */
        insert: async (data: any, customDb: any = db): Promise<any[]> => {
            return (await customDb.insert(table as any).values(data).returning()) as any[];
        },

        /**
         * Update existing records matching the condition.
         * Note: Doesn't strictly filter soft-deleted ones out unless whereCondition specifically targets active only.
         */
        update: async (data: any, whereCondition: SQL, customDb: any = db): Promise<any[]> => {
            return (await customDb.update(table as any).set(data).where(whereCondition).returning()) as any[];
        },

        /**
         * Delete records, automatically converting into soft-deletes if enabled.
         */
        delete: async (whereCondition: SQL, customDb: any = db): Promise<any> => {
            if (isSoftDeleteEnabled && hasDeletedAt) {
                const updateData = { deletedAt: new Date() } as unknown as PgUpdateSetSource<T>;
                return await customDb.update(table as any).set(updateData).where(whereCondition);
            }
            return await customDb.delete(table as any).where(whereCondition);
        },

        /**
         * Get all records including deleted ones (ignores the soft-delete global flag)
         */
        findWithDeleted: async (whereCondition?: SQL, customDb: any = db): Promise<any[]> => {
            const query = customDb.select().from(table as any);
            return (whereCondition ? await query.where(whereCondition) : await query) as any[];
        },

        /**
         * Directly expose the transaction wrapper from Drizzle to allow multi-step repository workflows.
         */
        transaction: async <Result>(fn: (tx: any) => Promise<Result>): Promise<Result> => {
            return await db.transaction(fn);
        }
    };
};
