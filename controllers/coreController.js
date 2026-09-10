import pool from "../db/pool.js";

export const showHome = async (req, res) => {
  res.render("home", {
    navLink: req.isAuthenticated() ? "/logout" : "/login",
    isAuthenticated: req.isAuthenticated(),
    user: req.user,
    posts: (
      await pool.query(
        `
SELECT
  posts.content AS content,
  users.full_name AS author_full_name,
  users.avatar_url AS author_avatar_url,
  COUNT(*) FILTER (WHERE reactions.vote = 1) AS likes,
  COUNT(*) FILTER (WHERE reactions.vote = -1) AS dislikes
FROM posts
JOIN users ON users.id = posts.author_id
LEFT JOIN reactions ON reactions.post_id = posts.id
GROUP BY posts.id, users.id
        `,
      )
    ).rows,
  });
};
