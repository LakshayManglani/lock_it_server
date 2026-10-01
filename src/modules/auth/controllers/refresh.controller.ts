import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { prisma } from "@/utils/prisma";
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  hashToken,
  verifyRefreshToken,
} from "@/utils/tokens";
import { issueSession } from "@/utils/cookie";
import { apiResponse } from "@/utils/apiResponse";
import {
  accessCookieOptions,
  refreshCookieOptions,
} from "@/utils/cookie";

export const refreshTokens = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.[REFRESH_TOKEN];

    if (!refreshToken) {
      return res.status(401).json(
        apiResponse(
          401,
          null,
          "Refresh token is required.",
        ),
      );
    }

    const payload = verifyRefreshToken(refreshToken);

    const refreshTokenHash = hashToken(refreshToken);

    const user = await prisma().user.findUnique({
      where: {
        id: payload.userId,
      },
    });

    if (!user) {
      return res.status(401).json(
        apiResponse(
          401,
          null,
          "Invalid refresh token.",
        ),
      );
    }

    const tokenExists = user.refreshTokens.includes(
      refreshTokenHash,
    );

    if (!tokenExists) {
      return res.status(401).json(
        apiResponse(
          401,
          null,
          "Refresh token has been revoked.",
        ),
      );
    }

    const tokens = issueSession(user.id);

    const newRefreshTokenHash = hashToken(
      tokens.refreshToken,
    );

    await prisma().user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshTokens: {
          set: [
            ...user.refreshTokens.filter(
              (token) => token !== refreshTokenHash,
            ),
            newRefreshTokenHash,
          ],
        },
      },
    });

    return res
      .cookie(
        ACCESS_TOKEN,
        tokens.accessToken,
        accessCookieOptions(),
      )
      .cookie(
        REFRESH_TOKEN,
        tokens.refreshToken,
        refreshCookieOptions(),
      )
      .status(200)
      .json(
        apiResponse(
          200,
          {
            accessToken: tokens.accessToken,
          },
          "Token refreshed successfully.",
        ),
      );
  },
);
