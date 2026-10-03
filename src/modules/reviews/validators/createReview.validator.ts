import { body } from "express-validator";

const MAX_COMMENT_LENGTH = 1000;

export const createReviewValidator = [
  body("bookingId")
    .trim()
    .notEmpty()
    .withMessage("Booking ID is required.")
    .isUUID()
    .withMessage("Booking ID must be a valid UUID."),

  body("rating")
    .notEmpty()
    .withMessage("Rating is required.")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be a whole number between 1 and 5.")
    .toInt(),

  body("comment")
    .optional()
    .isString()
    .withMessage("Comment must be text.")
    .trim()
    .isLength({ max: MAX_COMMENT_LENGTH })
    .withMessage(`Comment must be ${MAX_COMMENT_LENGTH} characters or fewer.`),
];
