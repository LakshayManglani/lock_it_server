import { Router } from "express";
import { getCurrentUser } from "@/modules/users/controllers/getCurrentUser.controller";
import { becomeHost } from "@/modules/users/controllers/becomeHost.controller";
import { requireAuth } from "@/middlewares/auth.middleware";

function createUserV1Router(): Router {
  const router = Router();

  router.route("/me").get(requireAuth, getCurrentUser);
  router.route("/me/become-host").patch(requireAuth, becomeHost);

  return router;
}

export { createUserV1Router };
