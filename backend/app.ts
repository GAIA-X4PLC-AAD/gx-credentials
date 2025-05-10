import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import morgan from "morgan";
import { fileURLToPath } from "node:url";
import path from "path";
import { createTablesIfNotExist } from "./db/migrations";
import authRouter from "./routes/auth.routes";
import applicationRouter from "./routes/application.routes";
import credentialRouter from "./routes/credential.routes";
import takeoutRouter from "./routes/takeout.routes";
import indexRouter from "./routes/index.routes";
import passport from "passport";
import session from "express-session";
import strategy from "./middleware/signatureStrategy";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
// const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(morgan("dev"));
// TODO: make origin env variable
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(
  session({
    secret: process.env.AUTH_SECRET!,
    resave: false,
    saveUninitialized: false,
  }),
);
passport.use(strategy);
app.use(express.json());

// Initialize passport.js with session
app.use(passport.initialize());
app.use(passport.session());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/api/application", applicationRouter);
app.use("/api/credential", credentialRouter);
app.use("/api/vci", takeoutRouter);

// Error handler
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  res.status(err.status || 500);
  res.send(err.message);
});

// Init DB
(async () => {
  try {
    console.log("Initializing DB with the following details:");
    console.log("PG_DB_ROOT_USERNAME:", process.env.PG_DB_ROOT_USERNAME);
    console.log("PG_DB_ROOT_PASSWORD:", process.env.PG_DB_ROOT_PASSWORD);
    console.log("PG_DB_DATABASE:", process.env.PG_DB_DATABASE);
    console.log("PG_DB_PORT:", process.env.PG_DB_PORT);
    await createTablesIfNotExist();
  } catch (error) {
    console.error("Error running DB migrations:", error);
    process.exit(1);
  }
})();

app.use((req, res, next) => {
  next(createError(404));
});

export default app;
