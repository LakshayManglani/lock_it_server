import env from "@/config/env.config";
import { startApp } from "@/app";
import { Express } from "express";
import dbClient from "@/db";

/**
 * @description Start the server.
 */
async function startServer(): Promise<Express> {
  try {
    // Add other services
    await dbClient.connect();

    return startApp();
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

/**
 * Graceful shutdown
 */
function shutdown() {
  let shuttingDown = false;

  async function handleShutdown(signal: string) {
    if (shuttingDown) return;
    shuttingDown = true;

    console.log(`\nReceived ${signal}, closing HTTP server...`);

    try {
      await Promise.all([
        dbClient.disconnect(),
      ]);

      console.log("\nAll services disconnected.");
    } catch (error) {
      console.error("\nError during shutdown:", error);
    } finally {
      process.exit(0);
    }
  }

  process.on("SIGINT", handleShutdown.bind(null, "SIGINT"));
  process.on("SIGTERM", handleShutdown.bind(null, "SIGTERM"));
}

(async () => {
  try {
    const app = await startServer();

    const PORT = env.PORT;
    app.listen(PORT, () => {
      console.log("\n⚙️ Server is running on port:", PORT);
    });

    shutdown();
  } catch (error) {
    console.error("Failed to listen server:", error);
    process.exit(1);
  }
})();

export { startServer };
