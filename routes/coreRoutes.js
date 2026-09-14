import { Router } from "express";

import {
  showHome,
  createPost,
  inductMember,
  showAdmin,
  appointAdmin,
  deletePost,
} from "../controllers/coreController.js";
import {
  postRules,
  postDeletionRules,
  inductionRules,
  adminRules,
} from "../validators/coreValidator.js";
import { validateRequest } from "../middleware/validation.js";

const coreRouter = new Router();

coreRouter.get("/", showHome);
coreRouter.post("/post", postRules, validateRequest(), createPost);
coreRouter.delete(
  "/posts/:postId",
  postDeletionRules,
  validateRequest(),
  deletePost,
);
coreRouter.post("/join", inductionRules, validateRequest(), inductMember);
coreRouter.get("/admin", showAdmin);
coreRouter.post("/admin", adminRules, validateRequest(), appointAdmin);

export default coreRouter;
