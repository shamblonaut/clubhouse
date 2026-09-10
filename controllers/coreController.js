import { body } from "express-validator";

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

export const postRules = [
  body("content").notEmpty().withMessage("Post must not be empty"),
];

export const createPost = async (req, res) => {
  const { content } = req.validatedBody;
  const authorId = req.user?.id;

  if (!req.isAuthenticated() || !authorId) return res.sendStatus(401);

  await pool.query("INSERT INTO posts (content, author_id) VALUES ($1, $2)", [
    content,
    authorId,
  ]);

  res.redirect("/");
};
