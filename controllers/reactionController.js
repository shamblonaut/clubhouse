import {
  deleteReactionRow,
  insertReaction,
  selectReactionForPostByUser,
  selectReactionsForPosts,
  updateReactionRow,
} from "../db/queries.js";
import objectArrayToObject from "../utils/objectify.js";

export const createReaction = async (req, res) => {
  const { postId, vote } = req.validatedData;

  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ errors: ["No logged in user present"] });
  }

  const userId = req.user.id;
  const existingReaction = await selectReactionForPostByUser(postId, userId);
  if (existingReaction) {
    return res.status(400).json({
      errors: ["A reaction by the user already exists on the post"],
    });
  }

  await insertReaction(postId, userId, vote);

  const updatedReactions = objectArrayToObject(
    await selectReactionsForPosts(userId),
    "post_id",
    "vote",
  );
  res.status(200).json({ data: updatedReactions });
};

export const updateReaction = async (req, res) => {
  const { postId, vote } = req.validatedData;

  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ errors: ["No logged in user present"] });
  }

  const userId = req.user.id;
  const existingReaction = await selectReactionForPostByUser(postId, userId);
  if (!existingReaction) {
    return res.status(400).json({
      errors: ["A reaction by the user does not exist on the post"],
    });
  }

  await updateReactionRow(postId, userId, vote);

  const updatedReactions = objectArrayToObject(
    await selectReactionsForPosts(userId),
    "post_id",
    "vote",
  );
  res.status(200).json({ data: updatedReactions });
};

export const deleteReaction = async (req, res) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ errors: ["No logged in user present"] });
  }

  const { postId } = req.validatedData;

  const userId = req.user.id;
  const reaction = await selectReactionForPostByUser(postId, userId);
  if (!reaction) {
    return res
      .status(400)
      .json({ errors: ["Reaction does not exist for post by user"] });
  }

  await deleteReactionRow(postId, userId);
  res.status(200).json({ success: true });
};
