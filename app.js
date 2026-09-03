import path from "path";
import express from "express";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";
import pgStore from "connect-pg-simple";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import pool from "./db/pool.js";
import {
  deserializeUser,
  serializeUser,
  verify,
} from "./middleware/authentication.js";
import authRouter from "./routes/authRoutes.js";

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

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("Missing required environment variable: SESSION_SECRET");
}

app.use(
  session({
    secret: sessionSecret,
    store: new (pgStore(session))({
      pool,
      tableName: "sessions",
    }),
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.session());
passport.use(new LocalStrategy({ usernameField: "email" }, verify));
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

app.get("/", (req, res) => {
  res.render("index", {
    isAuthenticated: req.isAuthenticated(),
    user: req.user,
  });
});

app.use("/", authRouter);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.statusCode || 500).send(error.message);
});

app.listen(PORT, (error) => {
  if (error) throw error;

  console.log("Listening on port " + PORT);
});
