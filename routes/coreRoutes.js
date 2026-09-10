import { Router } from "express";

import {
  showHome,
  createPost,
  postRules,
} from "../controllers/coreController.js";
import { validateRequest } from "../middleware/validation.js";

const coreRouter = new Router();

coreRouter.get("/", showHome);
coreRouter.post("/post", postRules, validateRequest("/"), createPost);

export default coreRouter;
