import pool from "../db/pool.js";
import {
  selectPostsWithAuthors,
  selectReactionsForPosts,
  deletePostRow,
} from "../db/queries.js";
import objectArrayToObject from "../utils/objectify.js";

export const showHome = async (req, res) => {
  const posts = await selectPostsWithAuthors();
  const reactions = objectArrayToObject(
    await selectReactionsForPosts(req.user?.id),
    "post_id",
    "vote",
  );
  res.render("home", {
    user: req.user,
    isAuthenticated: req.isAuthenticated(),
    isMember: req.user?.is_member,
    isAdmin: req.user?.is_admin,
    posts,
    reactions,
  });
};

export const createPost = async (req, res) => {
  const { content } = req.validatedData;
  const authorId = req.user?.id;

  if (!req.isAuthenticated() || !authorId) return res.sendStatus(401);

  await pool.query("INSERT INTO posts (content, author_id) VALUES ($1, $2)", [
    content,
    authorId,
  ]);

  res.redirect("/");
};

export const deletePost = async (req, res) => {
  const { postId } = req.validatedData;

  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ errors: ["No logged in user present"] });
  } else if (!req.user.is_admin) {
    return res.status(401).json({ errors: ["Unauthorized action"] });
  }

  await deletePostRow(postId);

  res.status(200).json({ success: true });
};

export const inductMember = async (req, res) => {
  const { memberPassword } = req.validatedData;
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

export const showAdmin = (req, res) => {
  res.render("admin");
};

export const appointAdmin = async (req, res) => {
  const { adminPassword } = req.validatedData;
  const user = req.user;

  if (!req.isAuthenticated() || !user) {
    return res.status(401).json({ errors: ["No logged in user present"] });
  } else if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ errors: ["Incorrect admin password"] });
  }

  await pool.query("UPDATE users SET is_admin = TRUE WHERE id = $1", [user.id]);

  res.status(200).json({ success: true });
};
