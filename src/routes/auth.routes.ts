import { Router } from "express";
import { registerUser } from "@/modules/auth/controllers/registerUser.controller";
import { loginUser } from "@/modules/auth/controllers/loginUser.controller";
import { validate } from "@/utils/validate";
import { loginUserValidator } from "@/modules/auth/validators/loginUser.validator";

function createAuthV1Router(): Router {
  const router = Router();

  router.route("/register").post(registerUser);
  router.route("/login").post(validate(loginUserValidator), loginUser);

  return router;
}

export { createAuthV1Router };
