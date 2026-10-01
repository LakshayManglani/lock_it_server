import type { RequestHandler } from "express";
import { validationResult, type ContextRunner } from "express-validator";
import { ApiError, type ApiErrorDetail } from "@/utils/apiError";
import { asyncHandler } from "@/utils/asyncHandler";

/**
 * @description Runs a validation chain and turns any failures into a single 400
 * listing every offending field. Reusable across routes.
 */
function validate(validations: ContextRunner[]): RequestHandler {
  return asyncHandler(async (req, _res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const result = validationResult(req);
    if (result.isEmpty()) {
      return next();
    }

    const errors: ApiErrorDetail[] = result.array({ onlyFirstError: true }).map((error) =>
      error.type === "field" ? { field: error.path, message: error.msg } : { message: error.msg }
    );

    throw ApiError.badRequest("Missing or invalid data.", errors);
  });
}

export { validate };
