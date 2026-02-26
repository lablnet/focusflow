import { db } from '../../../db';
import { activityLogsTable, usersTable, userSettingsTable, companySettingsTable } from '../../../db/schema';
import { eq, and, gte, desc } from 'drizzle-orm';

export const getTrackingLimits = async (userId: number) => {
    const [userDb] = await db.select({ companyId: usersTable.companyId }).from(usersTable).where(eq(usersTable.id, userId));
    const [userSet] = await db.select().from(userSettingsTable).where(eq(userSettingsTable.userId, userId));
    const [compSet] = await db.select().from(companySettingsTable).where(eq(companySettingsTable.companyId, userDb.companyId));

    return userSet?.maxDailyMinutes ?? compSet?.defaultMaxDailyMinutes ?? null;
};

export const getEstimatedMinutesToday = async (userId: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysLogs = await db.select({ id: activityLogsTable.id })
        .from(activityLogsTable)
        .where(
            and(
                eq(activityLogsTable.userId, userId),
                gte(activityLogsTable.createdAt, today)
            )
        );
    return todaysLogs.length * 3.33; // 3 snaps per 10 mins = ~3.33 mins per log
};

export const insertActivityLog = async (data: typeof activityLogsTable.$inferInsert) => {
    const [log] = await db.insert(activityLogsTable).values(data).returning({ id: activityLogsTable.id });
    return log;
};

export const getRecentLogs = async (userId: number, limit: number = 100) => {
    return await db.select()
        .from(activityLogsTable)
        .where(eq(activityLogsTable.userId, userId))
        .orderBy(desc(activityLogsTable.timestamp))
        .limit(limit);
};
