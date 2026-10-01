import { Router } from "express";
import { createAuthV1Router } from "./auth.routes";
import { createUserV1Router } from "./users.routes";
import { createListingsV1Router } from "./listings.routes";

/**
 * @description Mounts the versioned API. New versions get their own branch here
 * rather than mutating the existing one.
 */
function createRouter() {
  const router = Router();

  router.use("/v1", createV1Router());

  return router;
}

function createV1Router() {
  const router = Router();

  router.use("/auth", createAuthV1Router());
  router.use("/users", createUserV1Router());
  router.use("/listings", createListingsV1Router());

  return router;
}

export { createRouter };
