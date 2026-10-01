import env from '@/config/env.config';
import { Prisma } from '@/generated/prisma/client';
import { ApiError, type ApiErrorDetail } from '@/utils/apiError';
import type { ErrorRequestHandler, RequestHandler } from 'express';

/**
 * @description Prisma error codes that map onto a meaningful HTTP status.
 * Anything not listed here is treated as a server side fault.
 */
const PRISMA_ERROR_STATUS: Record<string, number> = {
  P2002: 409, // unique constraint violation
  P2003: 400, // foreign key constraint violation
  P2014: 400, // required relation violation
  P2025: 404, // record required but not found
};

/**
 * @description Narrows to an error carrying an HTTP status code, e.g. one thrown
 * by a third party library rather than by `ApiError`.
 */
function isHttpLike(err: unknown): err is Error & { statusCode: number } {
  return err instanceof Error && typeof (err as { statusCode?: unknown }).statusCode === 'number';
}

/**
 * @description Detects malformed request bodies rejected by `express.json()`.
 */
function isMalformedBody(err: unknown): err is Error {
  return err instanceof Error && (err as { type?: unknown }).type === 'entity.parse.failed';
}

/**
 * @description Coerces anything thrown inside the app into an `ApiError`, so every
 * failure leaves through the same response shape.
 */
function normalizeError(err: unknown): ApiError {
  if (err instanceof ApiError) {
    return err;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const statusCode = PRISMA_ERROR_STATUS[err.code] ?? 500;
    return new ApiError(
      statusCode,
      statusCode >= 500 ? 'Database error' : 'Database request failed',
      [],
      err.stack,
    );
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return new ApiError(400, 'Invalid database query', [], err.stack);
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    return new ApiError(503, 'Database unavailable', [], err.stack);
  }

  if (isMalformedBody(err)) {
    return new ApiError(400, 'Malformed JSON body', [], err.stack);
  }

  // An error from a library that already knows its HTTP status. Safe to surface
  // the message because the status is client facing, not a server side fault.
  if (isHttpLike(err)) {
    return new ApiError(
      err.statusCode,
      err.message,
      toErrorDetails((err as { errors?: unknown }).errors),
      err.stack,
    );
  }

  // Anything else is unknown, so the message is not forwarded: it could contain
  // SQL, file paths or other internals.
  return new ApiError(
    500,
    'Internal Server Error',
    [],
    err instanceof Error ? err.stack : undefined,
  );
}

/**
 * @description Converts a malformed `ApiErrorDetail` list into something safe to send.
 */
function toErrorDetails(value: unknown): ApiErrorDetail[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is ApiErrorDetail =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as ApiErrorDetail).message === 'string',
  );
}

/**
 * @description Terminal error middleware. Must keep all four parameters, Express
 * identifies error handlers by their arity, and must be registered last.
 */
const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  const error = normalizeError(err);

  if (res.headersSent) {
    return next(err);
  }

  if (error.statusCode >= 500) {
    console.error(`\n[error] ${error.statusCode} ${error.message}\n`, error.stack);
  }

  const body = error.toResponse();

  if (env.APP_ENV !== 'production' && error.stack) {
    return res.status(body.statusCode).json({ ...body, stack: error.stack });
  }

  return res.status(body.statusCode).json(body);
};

/**
 * @description Catches requests that matched no route and hands them to
 * `errorHandler` as a 404.
 */
const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};

export { errorHandler, normalizeError, notFoundHandler };
