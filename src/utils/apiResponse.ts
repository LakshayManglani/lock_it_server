import type { ApiErrorDetail } from '@/utils/apiError.js';

/**
 * @description The response envelope returned by every API endpoint.
 */
type ApiResponse<T> = {
  statusCode: number;
  data: T | null;
  message: string;
  success: boolean;
  errors?: ApiErrorDetail[];
};

/**
 * @description Wraps a payload in the standard API response envelope.
 * @param statusCode HTTP status code, also used to derive `success`.
 * @param data Payload to send back, `null` when there is nothing to return.
 * @param message Human readable summary of the outcome.
 * @param errors Field level details, only attached when provided.
 */
function apiResponse<T>(
  statusCode: number,
  data: T | null = null,
  message = 'Success',
  errors?: ApiErrorDetail[],
): ApiResponse<T> {
  return {
    statusCode,
    data,
    message,
    success: statusCode < 400,
    ...(errors && errors.length > 0 ? { errors } : {}),
  };
}

export { apiResponse };
export type { ApiResponse };
