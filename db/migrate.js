import { Client } from "pg";
import fs from "fs";
import path from "path";

import { getDatabaseConfiguration } from "./config.js";

async function migrate() {
  const client = new Client(getDatabaseConfiguration(process.argv[2]));
  try {
    await client.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name text UNIQUE NOT NULL,
        ran_at timestamptz DEFAULT now()
      )
    `);

    const files = fs
      .readdirSync(path.join(import.meta.dirname, "migrations"))
      .filter((fileName) => fileName.endsWith(".sql"))
      .sort();

    for (const file of files) {
      const { rows } = await client.query(
        "SELECT 1 FROM migrations WHERE name = $1",
        [file],
      );
      if (rows && rows.length > 0) {
        console.log(`Skipping: ${file}`);
        continue;
      }

      const sql = fs.readFileSync(
        path.join(import.meta.dirname, "migrations", file),
        "utf8",
      );
      await client.query("BEGIN");
      try {
        console.log(`Applying: ${file}`);
        await client.query(sql);
        await client.query("INSERT INTO migrations (name) VALUES ($1)", [file]);
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }
    console.log("Applied all migrations successfully!");
  } finally {
    await client.end();
  }
}

migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});
