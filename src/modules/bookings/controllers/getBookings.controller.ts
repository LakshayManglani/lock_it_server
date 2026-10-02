import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { prisma } from "@/utils/prisma";
import { apiResponse } from "@/utils/apiResponse";

export const getBookings = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user!;

    const bookings = await prisma().booking.findMany({
      where: { userId: user.id },
      orderBy: { checkIn: "asc" },
      select: {
        id: true,
        checkIn: true,
        checkOut: true,
        guests: true,
        totalPrice: true,
        createdAt: true,
        listing: {
          select: {
            id: true,
            title: true,
            location: true,
            images: {
              orderBy: { createdAt: "asc" },
              take: 1,
              select: { id: true, url: true },
            },
            host: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = bookings.filter(({ checkOut }) => checkOut >= today);
    const past = bookings.filter(({ checkOut }) => checkOut < today).reverse();

    return res.status(200).json(
      apiResponse(
        200,
        { upcoming, past },
        "Bookings fetched successfully.",
      ),
    );
  },
);
