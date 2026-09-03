import { body } from "express-validator";
import bcrypt from "bcrypt";

import { insertUser, userExistsByEmail } from "../db/queries.js";

export const showSignup = (req, res) => {
  res.render("signup", { errors: req.session?.messages });

  if (req.session) {
    req.session.messages = [];
  }
};

export const showLogin = (req, res) => {
  res.render("login", { errors: req.session?.messages });

  if (req.session) {
    req.session.messages = [];
  }
};

export const logoutUser = (req, res, next) => {
  req.logout((error) => {
    if (error) return next(error);
  });

  res.redirect("/");
};

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
  body("password")
    .isStrongPassword()
    .withMessage(
      "Password must be atleast 8 characters long, and contain at least one uppercase letter, lowercase letter, number and special character",
    ),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Both password and confirm password should be equal"),
];

export const signupUser = async (req, res, next) => {
  const { fullName, email, password } = req.validatedBody;
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await insertUser(fullName, email, passwordHash);

  req.login(user, (error) => {
    if (error) return next(error);
    res.redirect("/");
  });
};

export const loginRules = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password should not be empty"),
];
