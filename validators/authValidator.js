import { body } from "express-validator";

import { userExistsByEmail } from "../db/queries.js";

export const signupRules = [
  body("fullName").trim().notEmpty().withMessage("Full name must not be empty"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail()
    .custom(async (email) => {
      if (await userExistsByEmail(email)) {
        throw new Error(`A user already exists with the email (${email})`);
      }
    })
    .bail({ level: "request" }),
  body("avatarUrl")
    .trim()
    .isURL()
    .withMessage("Avatar URL must be a valid URL"),
  body("password")
    .isStrongPassword()
    .withMessage(
      "Password must be atleast 8 characters long, and contain at least one uppercase letter, lowercase letter, number and special character",
    ),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Both password and confirm password should be equal"),
];

export const loginRules = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password should not be empty"),
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
