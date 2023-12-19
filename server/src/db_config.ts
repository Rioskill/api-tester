import { Pool } from 'pg'

export const db_pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "kursach",
    port: 5432
});

