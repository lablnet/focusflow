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

    const repoMethods = {
        /**
         * Select a single record, automatically filtering out soft-deleted ones if enabled.
         */
        findFirst: async (whereCondition?: SQL, options: { db?: any } = {}): Promise<any> => {
            let finalCondition = whereCondition;
            const targetDb = options.db || db;

            if (isSoftDeleteEnabled && hasDeletedAt) {
                const deletedAtCol = (columns as Record<string, AnyPgColumn>).deletedAt;
                const notDeleted = isNull(deletedAtCol);
                finalCondition = whereCondition ? and(notDeleted, whereCondition) : notDeleted;
            }

            const query = targetDb.select().from(table as any);
            const result = finalCondition ? await query.where(finalCondition).limit(1) : await query.limit(1);
            return (result as any[])[0];
        },

        /**
         * Select records, automatically filtering out soft-deleted ones if enabled.
         */
        findMany: async (whereCondition?: SQL, options: { db?: any } = {}): Promise<any[]> => {
            let finalCondition = whereCondition;
            const targetDb = options.db || db;

            if (isSoftDeleteEnabled && hasDeletedAt) {
                const deletedAtCol = (columns as Record<string, AnyPgColumn>).deletedAt;
                const notDeleted = isNull(deletedAtCol);
                finalCondition = whereCondition ? and(notDeleted, whereCondition) : notDeleted;
            }

            const query = targetDb.select().from(table as any);
            return (finalCondition ? await query.where(finalCondition) : await query) as any[];
        },

        /**
         * Insert a new record into the table.
         */
        insert: async (data: any, options: { db?: any } = {}): Promise<any[]> => {
            const targetDb = options.db || db;
            return (await targetDb.insert(table as any).values(data).returning()) as any[];
        },

        /**
         * Update existing records matching the condition.
         */
        update: async (data: any, whereCondition: SQL, options: { db?: any } = {}): Promise<any[]> => {
            const targetDb = options.db || db;
            return (await targetDb.update(table as any).set(data).where(whereCondition).returning()) as any[];
        },

        /**
         * Delete records. Converts to soft-delete if enabled and options.force is false.
         */
        delete: async (whereCondition: SQL, options: { db?: any, force?: boolean } = {}): Promise<any> => {
            const targetDb = options.db || db;
            if (!options.force && isSoftDeleteEnabled && hasDeletedAt) {
                const updateData = { deletedAt: new Date() } as unknown as PgUpdateSetSource<T>;
                return await targetDb.update(table as any).set(updateData).where(whereCondition);
            }
            return await targetDb.delete(table as any).where(whereCondition);
        },

        /**
         * Get all records including deleted ones (ignores the soft-delete global flag)
         */
        findWithDeleted: async (whereCondition?: SQL, options: { db?: any } = {}): Promise<any[]> => {
            const targetDb = options.db || db;
            const query = targetDb.select().from(table as any);
            return (whereCondition ? await query.where(whereCondition) : await query) as any[];
        },
    };

    return new Proxy(db, {
        get(target, prop, receiver) {
            if (prop in repoMethods) {
                return repoMethods[prop as keyof typeof repoMethods];
            }
            return Reflect.get(target, prop, receiver);
        }
    }) as any;
};
