import { Router } from "express";

import { createPost, deletePost } from "../controllers/postController.js";
import { postRules, postDeletionRules } from "../validators/postValidator.js";
import { validateRequest } from "../middleware/validation.js";
import { requireAuthentication } from "../middleware/authentication.js";

const postRouter = new Router();

postRouter.post(
  "/",
  requireAuthentication,
  postRules,
  validateRequest(),
  createPost,
);
postRouter.delete(
  "/:postId",
  requireAuthentication,
  postDeletionRules,
  validateRequest(),
  deletePost,
);

export default postRouter;
