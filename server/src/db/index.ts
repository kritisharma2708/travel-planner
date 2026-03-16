import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

let db: NodePgDatabase<typeof schema> | undefined;
let pool: Pool | undefined;

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.warn(
    "WARNING: DATABASE_URL is not set. Database features will be unavailable."
  );
} else {
  pool = new Pool({ connectionString: DATABASE_URL });
  db = drizzle(pool, { schema });
}

export { db, pool };
export type Database = NonNullable<typeof db>;
