import { Router } from "express";
import passport from "passport";

import {
  appointAdmin,
  inductMember,
  logoutUser,
  showAdmin,
  showLogin,
  showSignup,
  signupUser,
} from "../controllers/authController.js";
import {
  signupRules,
  loginRules,
  inductionRules,
  adminRules,
} from "../validators/authValidator.js";
import { validateRequest } from "../middleware/validation.js";

const authRouter = new Router();

authRouter.get("/signup", showSignup);
authRouter.get("/login", showLogin);
authRouter.get("/logout", logoutUser);
authRouter.get("/admin", showAdmin);

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
authRouter.post("/join", inductionRules, validateRequest(), inductMember);
authRouter.post("/admin", adminRules, validateRequest(), appointAdmin);

export default authRouter;
