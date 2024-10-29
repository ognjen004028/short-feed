import { neon, NeonQueryFunction } from '@neondatabase/serverless';

const DATABASE_URL = import.meta.env.VITE_DATABASE_URL;
const sql: NeonQueryFunction<any> = neon(DATABASE_URL);

export interface WatchHistoryItem {
  id: number;
  user_id: number;
  video_id: string;
  video_title: string;
  watched_at: string;
}

export interface SearchHistoryItem {
  id: number;
  user_id: number;
  search_term: string;
  searched_at: string;
}

// Initialize database tables
async function initDatabase() {
  try {
    // Create watch history table
    await sql`
      CREATE TABLE IF NOT EXISTS watch_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        video_id VARCHAR(255) NOT NULL,
        video_title TEXT NOT NULL,
        watched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create search history table
    await sql`
      CREATE TABLE IF NOT EXISTS search_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        search_term TEXT NOT NULL,
        searched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Call initDatabase when the application starts
initDatabase();

export const db = {
  async saveToWatchHistory(userId: number, videoId: string, title: string): Promise<void> {
    await sql`
      INSERT INTO watch_history (user_id, video_id, video_title)
      VALUES (${userId}, ${videoId}, ${title})
    `;
  },

  async getWatchHistory(userId: number): Promise<WatchHistoryItem[]> {
    const result = await sql<WatchHistoryItem[]>`
      SELECT id, user_id, video_id, video_title, watched_at::text
      FROM watch_history
      WHERE user_id = ${userId}
      ORDER BY watched_at DESC
      LIMIT 10
    `;
    return result || [];
  },

  async clearWatchHistory(userId: number): Promise<void> {
    await sql`
      DELETE FROM watch_history
      WHERE user_id = ${userId}
    `;
  },

  async saveToSearchHistory(userId: number, searchTerm: string): Promise<void> {
    await sql`
      INSERT INTO search_history (user_id, search_term)
      VALUES (${userId}, ${searchTerm})
    `;
  },

  async getSearchHistory(userId: number): Promise<SearchHistoryItem[]> {
    const result = await sql<SearchHistoryItem[]>`
      SELECT id, user_id, search_term, searched_at::text
      FROM search_history
      WHERE user_id = ${userId}
      ORDER BY searched_at DESC
      LIMIT 10
    `;
    return result || [];
  },

  async clearSearchHistory(userId: number): Promise<void> {
    await sql`
      DELETE FROM search_history
      WHERE user_id = ${userId}
    `;
  }
};