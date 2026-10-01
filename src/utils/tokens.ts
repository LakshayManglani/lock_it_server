import { createHash, randomUUID } from "node:crypto";
import jwt, { type JwtPayload } from "jsonwebtoken";
import env from "@/config/env.config";
import { ApiError } from "@/utils/apiError";

const ACCESS_TOKEN = "accessToken";
const REFRESH_TOKEN = "refreshToken";

type TokenPayload = JwtPayload & { userId: string, jti?: string };

const ACCESS_SECRET = env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = env.REFRESH_TOKEN_SECRET;

function signAccessToken(userId: string): string {
  return jwt.sign({ userId }, ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES,
  });
}

function signRefreshToken(userId: string): string {
  return jwt.sign({ userId, jti: randomUUID() }, REFRESH_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES,
  });
}

function verifyAccessToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, ACCESS_SECRET) as unknown as TokenPayload;
  } catch {
    throw ApiError.unauthorized("Invalid or expired access token.");
  }
}

function verifyRefreshToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, REFRESH_SECRET) as unknown as TokenPayload;
  } catch {
    throw ApiError.unauthorized("Invalid or expired refresh token.");
  }
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export { ACCESS_TOKEN, REFRESH_TOKEN, signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken, hashToken };

export type { TokenPayload };
