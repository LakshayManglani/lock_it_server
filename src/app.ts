import express, { Express } from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import env from "@/config/env.config";
import { errorHandler, notFoundHandler } from "@/middlewares/error.middlewares";
import { createRouter } from "@/routes";

function startApp(): Express {
  const app = express();

  // Disable x-powered-by header from express
  app.disable("x-powered-by");

  // Set security HTTP headers
  app.use(helmet());

  // CORS settings
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
      exposedHeaders: "*",
      methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
    })
  );

  // Body parser
  app.use(
    express.json({
      limit: "50mb",
      type: "application/json",
    })
  );

  app.use(cookieParser());

  // Health check endpoint
  app.get("/health", (_, res) => {
    return res.status(200).json({ message: 'Hello World' });
  });

  app.use("/api", createRouter());

  // notFoundHandler
  app.use(notFoundHandler);

  // errorHandler
  app.use(errorHandler);

  return app;
}

export { startApp };
