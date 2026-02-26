import { pgTable, serial, varchar, timestamp, integer, pgEnum, jsonb, boolean, text } from 'drizzle-orm/pg-core';
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
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    role: roleEnum('role').default('employee').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'), // Soft delete
});

// 4. Images Table (S3 Uploads)
export const imagesTable = pgTable('images', {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
        .references(() => usersTable.id, { onDelete: 'cascade' })
        .notNull(),
    s3Key: varchar('s3_key', { length: 1000 }).notNull(),
    url: varchar('url', { length: 1000 }).notNull(),
    size: integer('size'),
    mimeType: varchar('mime_type', { length: 50 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 5. Sessions Table
export const sessionsTable = pgTable('sessions', {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
        .references(() => usersTable.id, { onDelete: 'cascade' })
        .notNull(),
    refreshToken: text('refresh_token').notNull(),
    deviceInfo: text('device_info'),
    ipAddress: varchar('ip_address', { length: 45 }),
    isRevoked: boolean('is_revoked').default(false).notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 5. Company Settings Table
export const companySettingsTable = pgTable('company_settings', {
    id: serial('id').primaryKey(),
    companyId: integer('company_id')
        .references(() => companiesTable.id, { onDelete: 'cascade' })
        .notNull(),
    defaultMaxDailyMinutes: integer('default_max_daily_minutes'),
    defaultMaxWeeklyMinutes: integer('default_max_weekly_minutes'),
    defaultMaxMonthlyMinutes: integer('default_max_monthly_minutes'),
});

// 6. User Settings Table
export const userSettingsTable = pgTable('user_settings', {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
        .references(() => usersTable.id, { onDelete: 'cascade' })
        .notNull(),
    maxDailyMinutes: integer('max_daily_minutes'),
    maxWeeklyMinutes: integer('max_weekly_minutes'),
    maxMonthlyMinutes: integer('max_monthly_minutes'),
});

// 8. Activity Logs Table (For Desktop Tracker Snapshots)
export const activityLogsTable = pgTable('activity_logs', {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
        .references(() => usersTable.id, { onDelete: 'cascade' })
        .notNull(),
    imageId: integer('image_id')
        .references(() => imagesTable.id, { onDelete: 'set null' }),
    timestamp: timestamp('timestamp').notNull(), // Exact execution time of takeSnapshot()
    keystrokes: integer('keystrokes').default(0).notNull(), // Total keys in interval
    mouseMoves: integer('mouse_moves').default(0).notNull(), // Total mouse moves in interval
    focusScore: integer('focus_score').default(0).notNull(),
    category: varchar('category', { length: 100 }), // Deep Work, Communication, etc.
    windowTitle: varchar('window_title', { length: 500 }), // Active window at exact moment
    activities: jsonb('activities'), // Contextual batch of recent window titles
    minuteBreakdown: jsonb('minute_breakdown'), // Array of activity per minute leading up to snapshot
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'), // Soft delete
});

// --- Relations ---

export const companiesRelations = relations(companiesTable, ({ one, many }) => ({
    teams: many(teamsTable),
    users: many(usersTable),
    settings: one(companySettingsTable),
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
    sessions: many(sessionsTable),
    settings: one(userSettingsTable),
    activityLogs: many(activityLogsTable),
    images: many(imagesTable),
}));

export const imagesRelations = relations(imagesTable, ({ one, many }) => ({
    user: one(usersTable, {
        fields: [imagesTable.userId],
        references: [usersTable.id],
    }),
    activityLogs: many(activityLogsTable),
}));

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [sessionsTable.userId],
        references: [usersTable.id],
    })
}));

export const companySettingsRelations = relations(companySettingsTable, ({ one }) => ({
    company: one(companiesTable, {
        fields: [companySettingsTable.companyId],
        references: [companiesTable.id],
    })
}));

export const userSettingsRelations = relations(userSettingsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [userSettingsTable.userId],
        references: [usersTable.id],
    })
}));

export const activityLogsRelations = relations(activityLogsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [activityLogsTable.userId],
        references: [usersTable.id],
    }),
    image: one(imagesTable, {
        fields: [activityLogsTable.imageId],
        references: [imagesTable.id],
    })
}));
