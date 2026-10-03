import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { prisma } from "@/utils/prisma";
import { apiResponse } from "@/utils/apiResponse";
import { ApiError } from "@/utils/apiError";

export const createReview = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user!;
    const { bookingId, rating, comment } = req.body as {
      bookingId: string;
      rating: number;
      comment?: string;
    };

    const booking = await prisma().booking.findUnique({
      where: { id: bookingId },
      select: { id: true, userId: true, listingId: true, checkOut: true },
    });

    if (!booking) {
      throw ApiError.notFound("Booking not found.");
    }

    if (booking.userId !== user.id) {
      throw ApiError.forbidden("You can only review your own bookings.");
    }

    if (booking.checkOut.getTime() > Date.now()) {
      throw ApiError.badRequest("You can only review a stay once it has ended.");
    }

    const existing = await prisma().review.findUnique({
      where: { bookingId },
      select: { id: true },
    });

    if (existing) {
      throw ApiError.conflict("You have already reviewed this stay.");
    }

    const review = await prisma().review.create({
      data: {
        rating,
        comment: comment?.trim() ? comment.trim() : null,
        userId: user.id,
        listingId: booking.listingId,
        bookingId: booking.id,
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        listing: {
          select: { id: true, title: true, location: true },
        },
        user: { select: { id: true, name: true } },
      },
    });

    const { _avg, _count } = await prisma().review.aggregate({
      where: { listingId: booking.listingId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    return res.status(201).json(
      apiResponse(
        201,
        {
          review,
          listingRating: {
            average: _avg.rating ? Math.round(_avg.rating * 100) / 100 : null,
            count: _count.rating,
          },
        },
        "Review created successfully.",
      ),
    );
  },
);
