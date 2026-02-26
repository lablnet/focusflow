import { db } from '../../../db';
import { usersTable, companiesTable, userSettingsTable } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export const findUserByEmail = async (email: string) => {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    return user;
};

export const findUserById = async (id: number) => {
    const [user] = await db.select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        role: usersTable.role,
        companyId: usersTable.companyId,
        teamId: usersTable.teamId,
        createdAt: usersTable.createdAt
    }).from(usersTable).where(eq(usersTable.id, id));
    return user;
};

export const registerUserWithCompany = async (companyName: string, name: string, email: string, passwordHash: string) => {
    return await db.transaction(async (tx) => {
        const [company] = await tx.insert(companiesTable).values({ name: companyName }).returning({ id: companiesTable.id });
        const [user] = await tx.insert(usersTable).values({
            companyId: company.id,
            name,
            email,
            passwordHash,
            role: 'admin'
        }).returning({ id: usersTable.id });
        await tx.insert(userSettingsTable).values({ userId: user.id });
        return { company, user };
    });
};
