import bcrypt from "bcrypt";

import { insertUser } from "../db/queries.js";

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

export const signupUser = async (req, res, next) => {
  const { fullName, email, avatarUrl, password } = req.validatedData;
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await insertUser(fullName, email, avatarUrl, passwordHash);

  req.login(user, (error) => {
    if (error) return next(error);
    res.redirect("/");
  });
};
