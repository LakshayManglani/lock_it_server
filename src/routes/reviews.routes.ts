import { Router } from "express";
import { createReview } from "@/modules/reviews/controllers/createReview.controller";
import { createReviewValidator } from "@/modules/reviews/validators/createReview.validator";
import { validate } from "@/utils/validate";
import { requireAuth } from "@/middlewares/auth.middleware";

export function createReviewsV1Router(): Router {
  const router = Router();

  router.route("/").post(requireAuth, validate(createReviewValidator), createReview);

  return router;
}