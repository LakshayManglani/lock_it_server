import express, { Express } from "express";

function startApp(): Express {
  const app = express();

  // Disable x-powered-by header from express
  app.disable("x-powered-by");

  // Health check endpoint
  app.get("/health", (_, res) => {
    return res.status(200).json({ message: 'Hello World' });
  });

  return app;
}

export { startApp };
