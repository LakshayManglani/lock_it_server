import { Router } from "express";
import { registerUser } from "@/controllers/auth/registerUser.controller";
import { loginUser } from "@/controllers/auth/loginUser.controller";
import { validate } from "@/validators";
import { loginUserValidator } from "@/validators/auth/loginUser.validator";

function createAuthV1Router(): Router {
  const router = Router();

  router.route("/register").post(registerUser);
  router.route("/login").post(validate(loginUserValidator), loginUser);

  return router;
}

export { createAuthV1Router };
