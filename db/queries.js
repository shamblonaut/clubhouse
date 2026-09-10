import pool from "./pool.js";

export async function selectUserById(id) {
  const { rows } = await pool.query(
    "SELECT id, full_name, email, avatar_url, created_at, updated_at FROM users WHERE id = $1",
    [id],
  );
  return rows[0];
}

export async function userExistsByEmail(email) {
  const { rows } = await pool.query(
    "SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)",
    [email],
  );
  return rows[0].exists;
}

export async function insertUser(fullName, email, avatarUrl, passwordHash) {
  const { rows } = await pool.query(
    `
        INSERT INTO users (full_name, email, password_hash, avatar_url)
        VALUES ($1, $2, $3)
        RETURNING id, full_name, email, avatar_url, created_at, updated_at
      `,
    [fullName, email, avatarUrl, passwordHash],
  );
  return rows[0];
}
