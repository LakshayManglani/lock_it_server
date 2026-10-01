import { Router } from "express";
import { getCurrentUser } from "@/modules/user/controllers/getCurrentUser.controller";
import { requireAuth } from "@/middlewares/auth.middleware";

function createUserV1Router(): Router {
  const router = Router();

  router.route("/me").get(requireAuth, getCurrentUser);

  return router;
}

export { createUserV1Router };
