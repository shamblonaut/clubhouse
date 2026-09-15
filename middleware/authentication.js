import bcrypt from "bcrypt";

import {
  selectUserByEmailWithPasswordHash,
  selectUserById,
} from "../db/queries.js";

export async function verify(email, password, done) {
  try {
    const user = await selectUserByEmailWithPasswordHash(email);
    if (!user) {
      return done(null, false, { message: `User does not exist (${email})` });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return done(null, false, { message: "Incorrect password" });
    }

    delete user.password_hash;
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}

export function serializeUser(user, done) {
  return done(null, user.id);
}

export async function deserializeUser(id, done) {
  try {
    const user = await selectUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
}

export async function requireAuthentication(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ errors: ["No logged in user present"] });
  }

  next();
}
