import { Router } from "express";
import { registerUser } from "@/modules/auth/controllers/registerUser.controller";
import { loginUser } from "@/modules/auth/controllers/loginUser.controller";
import { logoutUser } from "@/modules/auth/controllers/logoutUser.controller";
import { validate } from "@/utils/validate";
import { loginUserValidator } from "@/modules/auth/validators/loginUser.validator";
import { refreshTokens } from "@/modules/auth/controllers/refresh.controller";

function createAuthV1Router(): Router {
  const router = Router();

  router.route("/register").post(registerUser);
  router.route("/login").post(validate(loginUserValidator), loginUser);
  router.route("/logout").post(logoutUser);
  router.route("/refresh-tokens").post(refreshTokens);

  return router;
}

export { createAuthV1Router };
