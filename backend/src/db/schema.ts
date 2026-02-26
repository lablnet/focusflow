import { pgTable, serial, varchar, timestamp, integer, pgEnum, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const roleEnum = pgEnum('role', ['admin', 'manager', 'employee']);

// 1. Companies Table
export const companiesTable = pgTable('companies', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'), // Soft delete
});

// 2. Teams Table
export const teamsTable = pgTable('teams', {
    id: serial('id').primaryKey(),
    companyId: integer('company_id')
        .references(() => companiesTable.id, { onDelete: 'cascade' })
        .notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'), // Soft delete
});

// 3. Users Table
export const usersTable = pgTable('users', {
    id: serial('id').primaryKey(),
    companyId: integer('company_id')
        .references(() => companiesTable.id, { onDelete: 'cascade' })
        .notNull(),
    teamId: integer('team_id')
        .references(() => teamsTable.id, { onDelete: 'set null' }),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    role: roleEnum('role').default('employee').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'), // Soft delete
});

// 4. Activity Logs Table (For Desktop Tracker Snapshots)
export const activityLogsTable = pgTable('activity_logs', {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
        .references(() => usersTable.id, { onDelete: 'cascade' })
        .notNull(),
    timestamp: timestamp('timestamp').notNull(), // Exact execution time of takeSnapshot()
    keystrokes: integer('keystrokes').default(0).notNull(), // Total keys in interval
    mouseMoves: integer('mouse_moves').default(0).notNull(), // Total mouse moves in interval
    focusScore: integer('focus_score').default(0).notNull(),
    category: varchar('category', { length: 100 }), // Deep Work, Communication, etc.
    windowTitle: varchar('window_title', { length: 500 }), // Active window at exact moment
    screenshotUrl: varchar('screenshot_url', { length: 1000 }),
    activities: jsonb('activities'), // Contextual batch of recent window titles
    minuteBreakdown: jsonb('minute_breakdown'), // Array of activity per minute leading up to snapshot
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'), // Soft delete
});

// --- Relations ---

export const companiesRelations = relations(companiesTable, ({ many }) => ({
    teams: many(teamsTable),
    users: many(usersTable),
}));

export const teamsRelations = relations(teamsTable, ({ one, many }) => ({
    company: one(companiesTable, {
        fields: [teamsTable.companyId],
        references: [companiesTable.id],
    }),
    users: many(usersTable),
}));

export const usersRelations = relations(usersTable, ({ one, many }) => ({
    company: one(companiesTable, {
        fields: [usersTable.companyId],
        references: [companiesTable.id],
    }),
    team: one(teamsTable, {
        fields: [usersTable.teamId],
        references: [teamsTable.id],
    }),
    activityLogs: many(activityLogsTable),
}));

export const activityLogsRelations = relations(activityLogsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [activityLogsTable.userId],
        references: [usersTable.id],
    }),
}));
