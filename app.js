import path from "path";
import express from "express";
import expressLayouts from "express-ejs-layouts";

import indexRouter from "./routes/indexRoutes.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.set("views", path.join(import.meta.dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(import.meta.dirname, "public")));

app.use("/", indexRouter);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.statusCode || 500).send(error.message);
});

app.listen(PORT, (error) => {
  if (error) throw error;

  console.log("Listening on port " + PORT);
});
