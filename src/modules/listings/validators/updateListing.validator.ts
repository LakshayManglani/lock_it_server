import { body } from "express-validator";

export const updateListingValidator = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty."),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty."),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number.")
    .toFloat(),

  body("location")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Location cannot be empty."),

  body("latitude")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90.")
    .toFloat(),

  body("longitude")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180.")
    .toFloat(),

  body("guests")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Guests must be at least 1.")
    .toInt(),

  body("bedrooms")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Bedrooms cannot be negative.")
    .toInt(),

  body("beds")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Beds must be at least 1.")
    .toInt(),

  body("bathrooms")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Bathrooms must be at least 1.")
    .toInt(),
];