import env from "@/config/env.config";
import { CookieOptions } from "express";
import { signAccessToken, signRefreshToken } from "./tokens";

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  secure: env.APP_ENV === "production",
};

export function accessCookieOptions(): CookieOptions {
  return { ...cookieOptions, maxAge: env.ACCESS_TOKEN_EXPIRES * 1000 };
}

export function refreshCookieOptions(): CookieOptions {
  return { ...cookieOptions, maxAge: env.REFRESH_TOKEN_EXPIRES * 1000 };
}

export function issueSession(userId: string) {
  return { accessToken: signAccessToken(userId), refreshToken: signRefreshToken(userId) };
}
