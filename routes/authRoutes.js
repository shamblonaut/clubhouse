import { Router } from "express";
import passport from "passport";

import {
  loginRules,
  logoutUser,
  showLogin,
  showSignup,
  signupRules,
  signupUser,
} from "../controllers/authController.js";
import { validateRequest } from "../middleware/validation.js";

const authRouter = new Router();

authRouter.get("/signup", showSignup);
authRouter.get("/login", showLogin);
authRouter.get("/logout", logoutUser);

authRouter.post("/login", [
  loginRules,
  validateRequest("login"),
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true,
  }),
]);
authRouter.post("/signup", [
  signupRules,
  validateRequest("signup"),
  signupUser,
]);

export default authRouter;
