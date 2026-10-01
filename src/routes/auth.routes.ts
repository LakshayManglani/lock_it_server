import { Router } from "express";
import { registerUser } from "@/controllers/auth/registerUser.controller";

function createAuthV1Router(): Router {
  const router = Router();

  router.route("/register").post(registerUser);

  return router;
}

export { createAuthV1Router };
