import { Router } from "express";

import { getIndexPage } from "../controllers/indexController.js";

const indexRouter = new Router();

indexRouter.get("/", getIndexPage);

export default indexRouter;
