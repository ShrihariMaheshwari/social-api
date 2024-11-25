import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').unique().notNull(),
  apiKey: uuid('api_key').defaultRandom(),  
  createdAt: timestamp('created_at').defaultNow(), 
});