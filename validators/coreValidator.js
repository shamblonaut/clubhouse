import { body } from "express-validator";

export const postRules = [
  body("content").notEmpty().withMessage("Post must not be empty"),
];

export const inductionRules = [
  body("memberPassword")
    .notEmpty()
    .withMessage("Member password must not be empty"),
];
