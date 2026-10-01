import { Response } from "express";
import { apiResponse } from "./apiResponse";
import { accessCookieOptions, refreshCookieOptions } from "./cookie";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./tokens";

export function sendSession(
  res: Response,
  tokens: { accessToken: string; refreshToken: string },
  credentials?: { email: string; password: string },
  statusCode = 200
) {
  return res
    .status(statusCode)
    .cookie(ACCESS_TOKEN, tokens.accessToken, accessCookieOptions())
    .cookie(REFRESH_TOKEN, tokens.refreshToken, refreshCookieOptions())
    .json(
      apiResponse(
        statusCode,
        { accessToken: tokens.accessToken, ...(credentials && { credentials }) },
        statusCode === 201 ? "Account created successfully." : "Signed in successfully."
      )
    );
}
