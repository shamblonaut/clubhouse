export function getDatabaseConfiguration(connectionString) {
  if (connectionString) {
    return { connectionString };
  } else if (process.env.DATABASE_URL) {
    return { connectionString: process.env.DATABASE_URL };
  }

  const missingEnvs = [
    "DATABASE_NAME",
    "DATABASE_USER",
    "DATABASE_PASSWORD",
  ].filter((v) => !process.env[v]);
  if (missingEnvs.length > 0) {
    throw new Error(
      "Missing required environement variable(s): " + missingEnvs.join(", "),
    );
  }

  return {
    host: process.env.DATABASE_HOST ?? "localhost",
    port: process.env.DATABASE_PORT ?? 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  };
}
