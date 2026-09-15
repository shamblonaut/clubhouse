import { deletePostRow, insertPost } from "../db/queries.js";

export const createPost = async (req, res) => {
  const { content } = req.validatedData;

  await insertPost(content, req.user.id);

  res.redirect("/");
};

export const deletePost = async (req, res) => {
  const { postId } = req.validatedData;

  if (!req.user.is_admin) {
    return res.status(401).json({ errors: ["Unauthorized action"] });
  }

  await deletePostRow(postId);

  res.sendStatus(204);
};
