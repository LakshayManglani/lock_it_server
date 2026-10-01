import { asyncHandler } from "@/utils/asyncHandler";
import { prisma } from "@/utils/prisma";
import crypto from 'crypto'
import bcrypt from "bcryptjs";
import type { Response } from "express";
import { ACCESS_TOKEN, hashToken, REFRESH_TOKEN } from "@/utils/tokens";
import { apiResponse } from "@/utils/apiResponse";
import { accessCookieOptions, issueSession, refreshCookieOptions } from "@/utils/cookie";

const BCRYPT_ROUNDS = 12;

function sendSession(
  res: Response,
  credentials: { email: string; password: string },
  tokens: { accessToken: string; refreshToken: string },
  statusCode = 200
) {
  return res
    .status(statusCode)
    .cookie(ACCESS_TOKEN, tokens.accessToken, accessCookieOptions())
    .cookie(REFRESH_TOKEN, tokens.refreshToken, refreshCookieOptions())
    .json(
      apiResponse(
        statusCode,
        { credentials, accessToken: tokens.accessToken },
        statusCode === 201 ? "Account created successfully." : "Signed in successfully."
      )
    );
}

export const registerUser = asyncHandler(async (_, res) => {
  const result = await prisma().$transaction(async (tx) => {
    // Generate a unique fake identity.
    const suffix = crypto.randomBytes(6).toString("hex");

    const name = `Demo User ${suffix.slice(0, 6)}`;
    const email = `demo-${suffix}@example.com`;

    const password = crypto.randomBytes(18).toString("base64url");

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    const user = await tx.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "USER",
      },
    });

    const tokens = issueSession(user.id);
    const refreshTokenHash = hashToken(tokens.refreshToken);

    await tx.user.update({
      where: { id: user.id },
      data: {
        refreshTokens: {
          push: refreshTokenHash,
        },
      },
    });

    return {
      user,
      tokens,
      credentials: {
        email,
        password,
      },
    };
  });

  return sendSession(
    res,
    result.credentials,
    result.tokens,
    201,
  );
})
