import { Router } from "express";

import { createPost, deletePost } from "../controllers/postController.js";
import { postRules, postDeletionRules } from "../validators/postValidator.js";
import { validateRequest } from "../middleware/validation.js";

const postRouter = new Router();

postRouter.post("/", postRules, validateRequest(), createPost);
postRouter.delete("/:postId", postDeletionRules, validateRequest(), deletePost);

export default postRouter;
