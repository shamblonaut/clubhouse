import { Router } from "express";

import {
  createReaction,
  deleteReaction,
  updateReaction,
} from "../controllers/reactionController.js";
import {
  reactionRules,
  reactionDeletionRules,
} from "../validators/reactionValidator.js";
import { validateRequest } from "../middleware/validation.js";
import { requireAuthentication } from "../middleware/authentication.js";

const reactionRouter = new Router({ mergeParams: true });

reactionRouter.post(
  "/",
  requireAuthentication,
  reactionRules,
  validateRequest(),
  createReaction,
);
reactionRouter.patch(
  "/",
  requireAuthentication,
  reactionRules,
  validateRequest(),
  updateReaction,
);
reactionRouter.delete(
  "/",
  requireAuthentication,
  reactionDeletionRules,
  validateRequest(),
  deleteReaction,
);

export default reactionRouter;
