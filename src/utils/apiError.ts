import { apiResponse, type ApiResponse } from '@/utils/apiResponse.js';

/**
 * @description A single field level problem, used to describe validation failures.
 */
type ApiErrorDetail = {
  field?: string;
  message: string;
  code?: string;
};

/**
 * @description Error class carrying an HTTP status code, so it can be thrown
 * from anywhere and turned into a consistent response by the error handler.
 */
class ApiError extends Error {
  readonly statusCode: number;
  readonly data: null;
  readonly success: false;
  readonly errors: ApiErrorDetail[];

  constructor(
    statusCode: number,
    message = 'Internal Server Error',
    errors: ApiErrorDetail[] = [],
    stack?: string,
  ) {
    super(message);

    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else if (Error.captureStackTrace) {
      Error.captureStackTrace(this, new.target);
    }
  }

  /**
   * @description Serialises this error into the standard API response envelope.
   */
  toResponse(): ApiResponse<never> {
    return apiResponse<never>(this.statusCode, this.data, this.message, this.errors);
  }

  static badRequest(message = 'Bad Request', errors?: ApiErrorDetail[]): ApiError {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = 'Unauthorized', errors?: ApiErrorDetail[]): ApiError {
    return new ApiError(401, message, errors);
  }

  static forbidden(message = 'Forbidden', errors?: ApiErrorDetail[]): ApiError {
    return new ApiError(403, message, errors);
  }

  static notFound(message = 'Not Found', errors?: ApiErrorDetail[]): ApiError {
    return new ApiError(404, message, errors);
  }

  static conflict(message = 'Conflict', errors?: ApiErrorDetail[]): ApiError {
    return new ApiError(409, message, errors);
  }

  static unprocessableEntity(
    message = 'Unprocessable Entity',
    errors?: ApiErrorDetail[],
  ): ApiError {
    return new ApiError(422, message, errors);
  }

  static internalServerError(
    message = 'Internal Server Error',
    errors?: ApiErrorDetail[],
  ): ApiError {
    return new ApiError(500, message, errors);
  }
}

export { ApiError };
export type { ApiErrorDetail };
