import { companiesTable, usersTable, userSettingsTable } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { baseRepository } from '../../../db/repository';

const usersRepo = baseRepository(usersTable);
const companiesRepo = baseRepository(companiesTable);
const userSettingsRepo = baseRepository(userSettingsTable);

export const findUserByEmail = async (email: string) => {
    return await usersRepo.findFirst(eq(usersTable.email, email));
};

export const findUserById = async (id: number) => {
    return await usersRepo.findFirst(eq(usersTable.id, id));
};

export const registerUserWithCompany = async (companyName: string, name: string, email: string, passwordHash: string) => {
    return await usersRepo.transaction(async (tx) => {
        const [company] = await companiesRepo.insert({ name: companyName }, tx);
        const [user] = await usersRepo.insert({
            companyId: company.id,
            name,
            email,
            passwordHash,
            role: 'admin'
        }, tx);
        await userSettingsRepo.insert({ userId: user.id }, tx);
        return { company, user };
    });
};
