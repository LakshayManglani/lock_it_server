import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { prisma } from "@/utils/prisma";
import { apiResponse } from "@/utils/apiResponse";
import { ApiError } from "@/utils/apiError";

export const getHostBookings = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user!;

    if (user.role !== "HOST") {
      throw ApiError.forbidden("Only hosts can access host bookings.");
    }

    const bookings = await prisma().booking.findMany({
      where: {
        listing: {
          hostId: user.id,
        },
      },
      orderBy: {
        checkIn: "asc",
      },
      select: {
        id: true,
        checkIn: true,
        checkOut: true,
        guests: true,
        totalPrice: true,
        createdAt: true,

        user: {
          select: {
            id: true,
            name: true,
          },
        },

        listing: {
          select: {
            id: true,
            title: true,
            location: true,
            images: {
              orderBy: {
                createdAt: "asc",
              },
              take: 1,
              select: {
                id: true,
                url: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json(
      apiResponse(
        200,
        { bookings },
        "Host bookings fetched successfully.",
      ),
    );
  },
);
