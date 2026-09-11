import { body } from "express-validator";

import pool from "../db/pool.js";

export const showHome = async (req, res) => {
  res.render("home", {
    user: req.user,
    isAuthenticated: req.isAuthenticated(),
    isMember: req.user?.is_member,
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

export const inductionRules = [
  body("memberPassword")
    .notEmpty()
    .withMessage("Member password must not be empty"),
];

export const inductMember = async (req, res) => {
  const { memberPassword } = req.validatedBody;
  const user = req.user;

  if (!req.isAuthenticated() || !user) {
    return res.status(401).json({ errors: ["No logged in user present"] });
  } else if (memberPassword !== process.env.MEMBER_PASSWORD) {
    return res.status(401).json({ errors: ["Incorrect member password"] });
  }

  await pool.query("UPDATE users SET is_member = TRUE WHERE id = $1", [
    user.id,
  ]);

  res.status(200).json({ success: true });
};
