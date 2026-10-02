import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { prisma } from "@/utils/prisma";
import { apiResponse } from "@/utils/apiResponse";
import { ApiError } from "@/utils/apiError";

export const createListing = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user!;

    if (user.role !== "HOST") {
      throw ApiError.forbidden(
        "Only hosts can create listings.",
      );
    }

    const {
      title,
      description,
      price,
      location,
      latitude,
      longitude,
      guests,
      bedrooms,
      beds,
      bathrooms,
    } = req.body;

    const listing = await prisma().listing.create({
      data: {
        title,
        description,
        price,
        location,
        latitude,
        longitude,
        guests,
        bedrooms,
        beds,
        bathrooms,
        hostId: user.id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        location: true,
        latitude: true,
        longitude: true,
        guests: true,
        bedrooms: true,
        beds: true,
        bathrooms: true,
        images: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            url: true,
            publicId: true,
            createdAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(201).json(
      apiResponse(
        201,
        { listing },
        "Listing created successfully.",
      ),
    );
  },
);