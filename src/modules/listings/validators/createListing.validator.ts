import { body } from "express-validator";

export const createListingValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required."),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required."),

  body("price")
    .notEmpty()
    .withMessage("Price is required.")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number."),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required."),

  body("latitude")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90."),

  body("longitude")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180."),

  body("guests")
    .notEmpty()
    .withMessage("Number of guests is required.")
    .isInt({ min: 1 })
    .withMessage("Guests must be at least 1."),

  body("bedrooms")
    .notEmpty()
    .withMessage("Number of bedrooms is required.")
    .isInt({ min: 0 })
    .withMessage("Bedrooms cannot be negative."),

  body("beds")
    .notEmpty()
    .withMessage("Number of beds is required.")
    .isInt({ min: 1 })
    .withMessage("Beds must be at least 1."),

  body("bathrooms")
    .notEmpty()
    .withMessage("Number of bathrooms is required.")
    .isInt({ min: 1 })
    .withMessage("Bathrooms must be at least 1."),
];
