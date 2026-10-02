import { body } from "express-validator";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const TODAY = new Date().toISOString().slice(0, 10);

export const createBookingValidator = [
  body("listingId")
    .trim()
    .notEmpty()
    .withMessage("Listing ID is required.")
    .isUUID()
    .withMessage("Listing ID must be a valid UUID."),

  body("checkIn")
    .trim()
    .notEmpty()
    .withMessage("Check-in date is required.")
    .matches(ISO_DATE)
    .withMessage("Check-in date must be in YYYY-MM-DD format.")
    .isAfter(TODAY)
    .withMessage("Check-in date cannot be in the past.")
    .toDate(),

  body("checkOut")
    .trim()
    .notEmpty()
    .withMessage("Check-out date is required.")
    .matches(ISO_DATE)
    .withMessage("Check-out date must be in YYYY-MM-DD format.")
    .isAfter(TODAY)
    .withMessage("Check-out date cannot be in the past.")
    .toDate(),

  body("guests")
    .notEmpty()
    .withMessage("Number of guests is required.")
    .isInt({ min: 1 })
    .withMessage("Guests must be at least 1.")
    .toInt(),
];
