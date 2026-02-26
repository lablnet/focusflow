import { sessionsTable } from '../../../db/schema';
import { eq, and } from 'drizzle-orm';
import { baseRepository } from '../../../db/repository';

const sessionsRepo = baseRepository(sessionsTable);

export const createSession = async (userId: number, refreshToken: string, deviceInfo: string, ipAddress: string, expiresAt: Date) => {
    const [session] = await sessionsRepo.insert({
        userId,
        refreshToken,
        deviceInfo,
        ipAddress,
        expiresAt
    });
    return session;
};

export const findActiveSessionByToken = async (refreshToken: string) => {
    return await sessionsRepo.findFirst(
        and(
            eq(sessionsTable.refreshToken, refreshToken),
            eq(sessionsTable.isRevoked, false)
        )
    );
};

export const revokeSession = async (refreshToken: string) => {
    await sessionsRepo.update({ isRevoked: true }, eq(sessionsTable.refreshToken, refreshToken));
};
