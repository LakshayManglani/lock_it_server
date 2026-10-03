import { query } from "express-validator";

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

export const getReviewsValidator = [
  query("listingId").optional().trim().isUUID().withMessage("Listing ID must be a valid UUID."),

  query("rating")
    .optional()
    .trim()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be a whole number between 1 and 5."),

  query("page").optional().trim().isInt({ min: 1 }).withMessage("Page must be 1 or greater."),

  query("limit")
    .optional()
    .trim()
    .isInt({ min: 1, max: MAX_LIMIT })
    .withMessage(`Limit must be between 1 and ${MAX_LIMIT}.`),
];
