import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { apiResponse } from "@/utils/apiResponse";

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user!;

    const publicUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    return res.status(200).json(
      apiResponse(
        200,
        { user: publicUser },
        "User fetched successfully.",
      ),
    );
  },
);
