import pool from "./pool.js";

export async function selectUserById(id) {
  const { rows } = await pool.query(
    "SELECT id, full_name, email, avatar_url, is_member, created_at, updated_at FROM users WHERE id = $1",
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

export async function insertUser(
  fullName,
  email,
  avatarUrl,
  passwordHash,
  isMember = false,
) {
  const { rows } = await pool.query(
    `
        INSERT INTO users (full_name, email, avatar_url, password_hash, is_member)
        VALUES ($1, $2, $3)
        RETURNING id, full_name, email, avatar_url, is_member, created_at, updated_at
      `,
    [fullName, email, avatarUrl, passwordHash, isMember],
  );
  return rows[0];
}

export async function selectPostsWithAuthors() {
  const { rows } = await pool.query(
    `
SELECT
  posts.id AS id,
  posts.content AS content,
  users.full_name AS author_full_name,
  users.avatar_url AS author_avatar_url
FROM posts
JOIN users ON users.id = posts.author_id
GROUP BY posts.id, users.id
        `,
  );

  return rows;
}

export async function selectReactionsForPosts(userId = null) {
  const { rows } = await pool.query(
    `
SELECT
  posts.id AS post_id,
  COUNT(*) FILTER (WHERE vote = 1) AS likes,
  COUNT(*) FILTER (WHERE vote = -1) AS dislikes,
  COALESCE(MAX(vote) FILTER (WHERE user_id = $1), 0) AS user_reaction
FROM posts
LEFT JOIN reactions ON reactions.post_id = posts.id
GROUP BY posts.id
    `,
    [userId],
  );

  return rows;
}

export async function selectReactionForPostByUser(postId, userId) {
  const { rows } = await pool.query(
    `
SELECT * FROM reactions
WHERE post_id = $1 AND user_id = $2
    `,
    [postId, userId],
  );

  return rows[0];
}

export async function insertReaction(postId, userId, vote) {
  const { rows } = await pool.query(
    `
INSERT INTO reactions (post_id, user_id, vote)
VALUES ($1, $2, $3)
RETURNING *
    `,
    [postId, userId, vote],
  );

  return rows[0];
}

export async function updateReactionRow(postId, userId, vote) {
  const { rows } = await pool.query(
    `
UPDATE reactions
SET vote = $1
WHERE post_id = $2 AND user_id = $3
RETURNING *
    `,
    [vote, postId, userId],
  );

  return rows[0];
}

export async function deleteReactionRow(postId, userId) {
  await pool.query(
    `
DELETE FROM reactions
WHERE post_id = $1 AND user_id = $2
    `,
    [postId, userId],
  );
}
