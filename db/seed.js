import { Client } from "pg";
import { readFileSync } from "fs";
import path from "path";

import { getDatabaseConfiguration } from "./config.js";

async function seed() {
  const client = new Client(getDatabaseConfiguration(process.argv[2]));

  try {
    console.log("Seeding data...");

    await client.connect();
    await client.query(
      readFileSync(path.join(import.meta.dirname, "seed.sql"), "utf8"),
    );

    console.log("Seeding completed successfully!");
  } finally {
    client.end();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
