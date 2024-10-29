import bcrypt from 'bcryptjs';
import { neon, NeonQueryFunction } from '@neondatabase/serverless';

const DATABASE_URL = import.meta.env.VITE_DATABASE_URL;
const sql: NeonQueryFunction<any> = neon(DATABASE_URL);

export interface User {
  id: number;
  username: string;
  email: string;
}

interface UserRecord {
  id: number;
  username: string;
  email: string;
  password_hash: string;
}

// Initialize users table
async function initUsersTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Users table initialized successfully');
  } catch (error) {
    console.error('Error initializing users table:', error);
  }
}

initUsersTable();

export const auth = {
  async signUp(username: string, email: string, password: string): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    try {
      const result = await sql<UserRecord[]>`
        INSERT INTO users (username, email, password_hash)
        VALUES (${username}, ${email}, ${passwordHash})
        RETURNING id, username, email
      `;
      
      if (!result?.[0]) {
        throw new Error('Failed to create user');
      }

      return {
        id: result[0].id,
        username: result[0].username,
        email: result[0].email
      };
    } catch (error: any) {
      if (error.message.includes('unique constraint')) {
        if (error.message.includes('username')) {
          throw new Error('Username already taken');
        }
        if (error.message.includes('email')) {
          throw new Error('Email already registered');
        }
      }
      throw error;
    }
  },

  async signIn(username: string, password: string): Promise<User> {
    const result = await sql<UserRecord[]>`
      SELECT id, username, email, password_hash
      FROM users 
      WHERE username = ${username}
    `;

    if (!result?.[0]) {
      throw new Error('Invalid username or password');
    }

    const user = result[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      throw new Error('Invalid username or password');
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email
    };
  }
};