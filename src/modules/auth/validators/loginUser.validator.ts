import { body } from "express-validator";

export const loginUserValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .toLowerCase()
    .isEmail()
    .withMessage("A valid email is required."),
  body("password").isString().notEmpty().withMessage("Password is required."),
];
