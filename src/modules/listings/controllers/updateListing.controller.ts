import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { prisma } from "@/utils/prisma";
import { apiResponse } from "@/utils/apiResponse";
import { ApiError } from "@/utils/apiError";

export const updateListing = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (Array.isArray(id)) {
      throw ApiError.badRequest("Invalid listing ID.");
    }

    const user = req.user!;

    const listing = await prisma().listing.findUnique({
      where: {
        id,
      },
    });

    if (!listing) {
      throw ApiError.notFound("Listing not found.");
    }

    if (listing.hostId !== user.id) {
      throw ApiError.forbidden(
        "You are not allowed to update this listing.",
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
      images,
    } = req.body;

    const updatedListing = await prisma().listing.update({
      where: {
        id,
      },
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
        images,
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
        images: true,
        createdAt: true,
        updatedAt: true,
        host: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.status(200).json(
      apiResponse(
        200,
        { listing: updatedListing },
        "Listing updated successfully.",
      ),
    );
  },
);
