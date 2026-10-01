import { Router } from "express";
import { getCurrentUser } from "@/modules/users/controllers/getCurrentUser.controller";
import { requireAuth } from "@/middlewares/auth.middleware";

function createUserV1Router(): Router {
  const router = Router();

  router.route("/me").get(requireAuth, getCurrentUser);

  return router;
}

export { createUserV1Router };
