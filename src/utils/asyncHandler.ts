import type { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * @description Wraps a controller so a rejected promise is forwarded to the
 * error middleware instead of leaving the request hanging.
 */
function asyncHandler(
  requestHandler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err: unknown) => next(err));
  };
}

export { asyncHandler };
