import bcrypt from "bcrypt";

import {
  insertUser,
  updateUserAsAdmin,
  updateUserAsMember,
} from "../db/queries.js";

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

export const inductMember = async (req, res) => {
  const { memberPassword } = req.validatedData;
  const user = req.user;

  if (!req.isAuthenticated() || !user) {
    return res.status(401).json({ errors: ["No logged in user present"] });
  } else if (memberPassword !== process.env.MEMBER_PASSWORD) {
    return res.status(401).json({ errors: ["Incorrect member password"] });
  }

  await updateUserAsMember(user.id);

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

  await updateUserAsAdmin(user.id);

  res.status(200).json({ success: true });
};
