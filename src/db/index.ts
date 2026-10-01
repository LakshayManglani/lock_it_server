import env from '@/config/env.config.js';
import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

class DbClient {
  #db: PrismaClient | null = null;

  #createClient(): PrismaClient {
    const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
    return new PrismaClient({ adapter });
  }

  async connect(): Promise<void> {
    if (this.#db) {
      return;
    }

    try {
      const db = this.#createClient();
      await db.$connect();
      console.log('\n☘️  PostgreSQL connected');

      this.#db = db;
    } catch (error) {
      console.error('Failed to connect to database:', error);
      process.exit(1);
    }
  }

  getInstance(): PrismaClient | null {
    return this.#db;
  }

  async disconnect(): Promise<void> {
    if (this.#db) {
      await this.getInstance()?.$disconnect();
      console.log('\n☘️  PostgreSQL disconnected');
      this.#db = null;
    }
  }
}

const dbClient = new DbClient();
Object.freeze(dbClient);

export default dbClient;
