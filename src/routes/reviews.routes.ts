import { Router } from "express";
import { createReview } from "@/modules/reviews/controllers/createReview.controller";
import { getReviews } from "@/modules/reviews/controllers/getReviews.controller";
import { createReviewValidator } from "@/modules/reviews/validators/createReview.validator";
import { getReviewsValidator } from "@/modules/reviews/validators/getReviews.validator";
import { validate } from "@/utils/validate";
import { requireAuth } from "@/middlewares/auth.middleware";

export function createReviewsV1Router(): Router {
  const router = Router();

  router
    .route("/")
    .get(validate(getReviewsValidator), getReviews)
    .post(requireAuth, validate(createReviewValidator), createReview);

  return router;
}
