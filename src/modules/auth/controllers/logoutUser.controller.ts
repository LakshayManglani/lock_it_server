import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { prisma } from "@/utils/prisma";
import {
  hashToken,
  REFRESH_TOKEN,
  ACCESS_TOKEN,
} from "@/utils/tokens";
import { apiResponse } from "@/utils/apiResponse";
import {
  accessCookieOptions,
  refreshCookieOptions,
} from "@/utils/cookie";

export const logoutUser = asyncHandler(
  async (_req: Request, res: Response) => {
    const refreshToken = _req.cookies?.[REFRESH_TOKEN];

    if (refreshToken) {
      const refreshTokenHash = hashToken(refreshToken);

      const user = await prisma().user.findFirst({
        where: {
          refreshTokens: {
            has: refreshTokenHash,
          },
        },
      });

      if (user) {
        await prisma().user.update({
          where: {
            id: user.id,
          },
          data: {
            refreshTokens: {
              set: user.refreshTokens.filter(
                (token) => token !== refreshTokenHash,
              ),
            },
          },
        });
      }
    }

    return res
      .clearCookie(ACCESS_TOKEN, accessCookieOptions())
      .clearCookie(REFRESH_TOKEN, refreshCookieOptions())
      .status(200)
      .json(
        apiResponse(
          200,
          null,
          "Signed out successfully.",
        ),
      );
  },
);
