import { body, param } from "express-validator";

export const reactionRules = [
  param("postId")
    .isNumeric()
    .withMessage("Value of post id must be a number")
    .toInt(),
  body("vote")
    .isNumeric()
    .withMessage("Value of vote must be a valid number (1 or -1)")
    .toInt()
    .custom((value) => value === 1 || value === -1)
    .withMessage("Value of vote must be either 1 or -1"),
];

export const reactionDeletionRules = [
  param("postId")
    .isNumeric()
    .withMessage("Value of post id must be a number")
    .toInt(),
];
