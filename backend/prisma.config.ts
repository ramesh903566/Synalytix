import { defineConfig } from '@prisma/config';

export default defineConfig({
  earlyAccess: true,
  studio: {
    port: 5555,
  },
  migrations: {
    databaseUrl: process.env.DATABASE_URL,
    directDatabaseUrl: process.env.DIRECT_URL,
  },
});
