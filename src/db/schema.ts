import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').unique().notNull(),
  apiKey: uuid('api_key').defaultRandom(),  
  createdAt: timestamp('created_at').defaultNow(), 
});

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  mediaUrls: text('media_urls').array(),
  platform: text('platform', { enum: ['twitter', 'facebook', 'instagram'] }).notNull(),
  status: text('status', { enum: ['draft', 'published', 'scheduled'] }).default('draft').notNull(),
  publishedAt: timestamp('published_at'),
  scheduledFor: timestamp('scheduled_for'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});