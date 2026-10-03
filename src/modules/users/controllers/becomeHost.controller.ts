import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { prisma } from "@/utils/prisma";
import { apiResponse } from "@/utils/apiResponse";
import { ApiError } from "@/utils/apiError";

export const becomeHost = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user!;

    if (user.role === "HOST") {
      throw ApiError.conflict("You are already a host.");
    }

    const updatedUser = await prisma().user.update({
      where: { id: user.id },
      data: { role: "HOST" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json(
      apiResponse(
        200,
        { user: updatedUser },
        "You are now a host.",
      ),
    );
  },
);
