import { Router } from "express";

import {
  createReaction,
  deleteReaction,
  reactionDeletionRules,
  reactionRules,
  updateReaction,
} from "../controllers/reactionController.js";
import { validateRequest } from "../middleware/validation.js";

const reactionRouter = new Router({ mergeParams: true });

reactionRouter.post("/", reactionRules, validateRequest(), createReaction);
reactionRouter.patch("/", reactionRules, validateRequest(), updateReaction);
reactionRouter.delete(
  "/",
  reactionDeletionRules,
  validateRequest(),
  deleteReaction,
);

export default reactionRouter;
