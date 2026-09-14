import { body, param } from "express-validator";

export const postRules = [
  body("content").notEmpty().withMessage("Post must not be empty"),
];

export const postDeletionRules = [
  param("postId")
    .isNumeric()
    .withMessage("Value of post id must be a number")
    .toInt(),
];

export const inductionRules = [
  body("memberPassword")
    .notEmpty()
    .withMessage("Member password must not be empty"),
];

export const adminRules = [
  body("adminPassword")
    .notEmpty()
    .withMessage("Admin password must not be empty"),
];
