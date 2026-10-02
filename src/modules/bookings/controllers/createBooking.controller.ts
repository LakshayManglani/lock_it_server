import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { prisma } from "@/utils/prisma";
import { apiResponse } from "@/utils/apiResponse";
import { ApiError } from "@/utils/apiError";

const MS_PER_DAY = 86_400_000;

function rangesOverlap(
  existing: { checkIn: Date; checkOut: Date },
  requested: { checkIn: Date; checkOut: Date },
): boolean {
  return (
    existing.checkIn < requested.checkOut &&
    existing.checkOut > requested.checkIn
  );
}

export const createBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user!;

    const { listingId, checkIn, checkOut, guests } = req.body as {
      listingId: string;
      checkIn: Date;
      checkOut: Date;
      guests: number;
    };

    if (checkOut <= checkIn) {
      throw ApiError.badRequest(
        "Check-out date must be after check-in date.",
      );
    }

    const listing = await prisma().listing.findUnique({
      where: { id: listingId },
      select: {
        id: true,
        title: true,
        price: true,
        guests: true,
        hostId: true,
      },
    });

    if (!listing) {
      throw ApiError.notFound("Listing not found.");
    }

    if (listing.hostId === user.id) {
      throw ApiError.badRequest("You cannot book your own listing.");
    }

    if (guests > listing.guests) {
      throw ApiError.badRequest(
        `This listing sleeps ${listing.guests} guests, ${guests} requested.`,
      );
    }

    const nights = Math.round(
      (checkOut.getTime() - checkIn.getTime()) / MS_PER_DAY,
    );

    const totalPrice = listing.price.mul(nights);

    const booking = await prisma().$transaction(async (tx) => {
      const existingBookings = await tx.booking.findMany({
        where: {
          listingId,
        },
        select: {
          checkIn: true,
          checkOut: true,
        },
      });

      const hasOverlap = existingBookings.some((existing) =>
        rangesOverlap(existing, {
          checkIn,
          checkOut,
        }),
      );

      if (hasOverlap) {
        throw ApiError.conflict("Those dates are already booked.");
      }

      return tx.booking.create({
        data: {
          checkIn,
          checkOut,
          guests,
          totalPrice,
          userId: user.id,
          listingId,
        },
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
            },
          },
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    });

    return res.status(201).json(
      apiResponse(
        201,
        {
          booking,
          nights,
        },
        "Booking created successfully.",
      ),
    );
  },
);
