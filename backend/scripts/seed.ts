import 'dotenv/config';
import { db } from '../src/db/index';
import { usersTable, companiesTable } from '../src/db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function seed() {
    try {
        const email = 'umer@lablnet.com';
        const rawPassword = 'password123';
        
        console.log(`Checking for existing user with email: ${email}...`);
        
        // 1. Create a company if it doesn't exist
        const companyRes = await db.insert(companiesTable).values({
            name: 'Lablnet Inc.',
        }).returning();
        
        const companyId = companyRes[0].id;
        
        console.log(`Created company with ID: ${companyId}`);
        
        // 2. Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(rawPassword, salt);
        
        // 3. Delete existing user if exists (to avoid unique constraint errors during re-runs)
        await db.delete(usersTable).where(eq(usersTable.email, email));
        
        // 4. Create user
        const userRes = await db.insert(usersTable).values({
            companyId,
            name: 'Umer',
            email,
            passwordHash,
            role: 'admin',
        }).returning();
        
        console.log('\n✅ User successfully created/updated!');
        console.log('-------------------------------------------');
        console.log(`ID:       ${userRes[0].id}`);
        console.log(`Name:     ${userRes[0].name}`);
        console.log(`Email:    ${userRes[0].email}`);
        console.log(`Password: ${rawPassword}`);
        console.log(`Role:     ${userRes[0].role}`);
        console.log('-------------------------------------------');
        
    } catch (error) {
        console.error('Error seeding user:', error);
    } finally {
        process.exit(0);
    }
}

seed();
