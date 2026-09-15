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
import { requireAuthentication } from "../middleware/authentication.js";

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
authRouter.post(
  "/join",
  requireAuthentication,
  inductionRules,
  validateRequest(),
  inductMember,
);
authRouter.post(
  "/admin",
  requireAuthentication,
  adminRules,
  validateRequest(),
  appointAdmin,
);

export default authRouter;
