import type { Request, RequestHandler } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { prisma } from "@/utils/prisma";
import {
  ACCESS_TOKEN,
  verifyAccessToken,
} from "@/utils/tokens";
import { ApiError } from "@/utils/apiError";

function readAccessToken(req: Request): string | undefined {
  const fromCookie = req.cookies?.[ACCESS_TOKEN];

  if (fromCookie) {
    return fromCookie;
  }

  const header = req.headers.authorization;

  if (header?.startsWith("Bearer ")) {
    return header.slice(7).trim() || undefined;
  }

  return undefined;
}

const requireAuth: RequestHandler = asyncHandler(
  async (req, _res, next) => {
    const token = readAccessToken(req);

    if (!token) {
      throw ApiError.unauthorized("Authentication required.");
    }

    const { userId } = verifyAccessToken(token);

    const user = await prisma().user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw ApiError.unauthorized("User no longer exists.");
    }

    req.user = user;

    return next();
  },
);

export { requireAuth };
