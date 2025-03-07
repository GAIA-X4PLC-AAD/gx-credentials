import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import morgan from "morgan";
import { fileURLToPath } from "node:url";
import path from "path";
import { createTablesIfNotExist } from "./db/migrations";
import applicationRouter from "./routes/application.routes";
import credentialRouter from "./routes/credential.routes";
import indexRouter from "./routes/index";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();

// Middleware setup
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRouter);
app.use("/api/application", applicationRouter);
app.use("/api/credential", credentialRouter);

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

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
