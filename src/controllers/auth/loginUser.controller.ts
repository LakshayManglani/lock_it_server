import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { prisma } from "@/utils/prisma";
import bcrypt from "bcryptjs";
import { hashToken } from "@/utils/tokens";
import { apiResponse } from "@/utils/apiResponse";
import {
  issueSession,
} from "@/utils/cookie";
import { sendSession } from "src/utils/sendSession";

export const loginUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await prisma().user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json(
        apiResponse(
          401,
          null,
          "Invalid email or password.",
        ),
      );
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      return res.status(401).json(
        apiResponse(
          401,
          null,
          "Invalid email or password.",
        ),
      );
    }

    const tokens = issueSession(user.id);

    const refreshTokenHash = hashToken(tokens.refreshToken);

    await prisma().user.update({
      where: { id: user.id },
      data: {
        refreshTokens: {
          push: refreshTokenHash,
        },
      },
    });

    return sendSession(res, tokens)
  },
);
