import { db } from '../../../db';
import { activityLogsTable, usersTable, userSettingsTable, companySettingsTable } from '../../../db/schema';
import { eq, and, gte, desc } from 'drizzle-orm';
import { baseRepository } from '../../../db/repository';

const usersRepo = baseRepository(usersTable);
const userSettingsRepo = baseRepository(userSettingsTable);
const companySettingsRepo = baseRepository(companySettingsTable);
const activityRepo = baseRepository(activityLogsTable);

export const getTrackingLimits = async (userId: number) => {
    const [userDb] = await usersRepo.findMany(eq(usersTable.id, userId));
    const [userSet] = await userSettingsRepo.findMany(eq(userSettingsTable.userId, userId));
    const [compSet] = await companySettingsRepo.findMany(eq(companySettingsTable.companyId, userDb?.companyId ?? 0));

    return userSet?.maxDailyMinutes ?? compSet?.defaultMaxDailyMinutes ?? null;
};

export const getEstimatedMinutesToday = async (userId: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysLogs = await activityRepo.findMany(
        and(
            eq(activityLogsTable.userId, userId),
            gte(activityLogsTable.createdAt, today)
        )
    );
    return todaysLogs.length * 3.33; // 3 snaps per 10 mins = ~3.33 mins per log
};

export const insertActivityLog = async (data: typeof activityLogsTable.$inferInsert) => {
    const [log] = await activityRepo.insert(data);
    return log;
};

export const getRecentLogs = async (userId: number, limit: number = 100) => {
    // Note: baseRepository findMany currently doesn't support complex builders like orderBy/limit directly in its current simplified form.
    // However, since it spreads ...db, we can use the raw methods if needed, OR we can stick to findMany for now if simple.
    // Let's use the spread db methods to maintain the soft-delete filter manually if needed, or update findMany.

    // For now, let's use the injected findMany and maybe add limit/order support to repo later if you want.
    // Actually, since we spread ...db, we can just do:
    return await activityRepo.select()
        .from(activityLogsTable)
        .where(eq(activityLogsTable.userId, userId))
        .orderBy(desc(activityLogsTable.timestamp))
        .limit(limit);
};
