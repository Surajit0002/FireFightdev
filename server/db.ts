import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Validate database URL format
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl.includes('postgresql://') && !dbUrl.includes('postgres://')) {
  throw new Error("Invalid DATABASE_URL format. Expected PostgreSQL connection string.");
}

export const pool = new Pool({ 
  connectionString: dbUrl,
  // Add connection configuration for better reliability
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  max: 10,
});

export const db = drizzle({ client: pool, schema });