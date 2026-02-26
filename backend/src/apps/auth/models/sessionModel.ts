import { db } from '../../../db';
import { sessionsTable } from '../../../db/schema';
import { eq, and } from 'drizzle-orm';

export const createSession = async (userId: number, refreshToken: string, deviceInfo: string, ipAddress: string, expiresAt: Date) => {
    const [session] = await db.insert(sessionsTable).values({
        userId,
        refreshToken,
        deviceInfo,
        ipAddress,
        expiresAt
    }).returning({ id: sessionsTable.id });
    return session;
};

export const findActiveSessionByToken = async (refreshToken: string) => {
    const [session] = await db.select()
        .from(sessionsTable)
        .where(
            and(
                eq(sessionsTable.refreshToken, refreshToken),
                eq(sessionsTable.isRevoked, false)
            )
        );
    return session;
};

export const revokeSession = async (refreshToken: string) => {
    await db.update(sessionsTable)
        .set({ isRevoked: true })
        .where(eq(sessionsTable.refreshToken, refreshToken));
};
