// src/db/test.ts
import { db } from './index';
import { users } from './schema';

async function testDatabase() {
  try {
    // Try to create a test user
    const newUser = await db.insert(users).values({
      email: 'test@example.com'
    }).returning();
    
    console.log('✅ Database connection successful!');
    console.log('Created user:', newUser[0]);

    // Fetch all users
    const allUsers = await db.select().from(users);
    console.log('All users:', allUsers);

  } catch (error) {
    console.error('❌ Database test failed:', error);
  }
}

testDatabase();