import { deletePostRow, insertPost } from "../db/queries.js";

export const createPost = async (req, res) => {
  const { content } = req.validatedData;
  const authorId = req.user?.id;

  if (!req.isAuthenticated() || !authorId) return res.sendStatus(401);

  await insertPost(content, authorId);

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

  res.sendStatus(204);
};
