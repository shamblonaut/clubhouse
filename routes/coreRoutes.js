import { Router } from "express";

import { showHome } from "../controllers/coreController.js";

const coreRouter = new Router();

coreRouter.get("/", showHome);

export default coreRouter;
