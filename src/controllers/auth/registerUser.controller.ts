import { asyncHandler } from "@/utils/asyncHandler";
import { prisma } from "@/utils/prisma";
import crypto from 'crypto'
import bcrypt from "bcryptjs";
import { hashToken } from "@/utils/tokens";
import { issueSession } from "@/utils/cookie";
import { sendSession } from "src/utils/sendSession";

const BCRYPT_ROUNDS = 12;

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
    result.tokens,
    result.credentials,
    201,
  );
})
