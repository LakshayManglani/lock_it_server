import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { prisma } from "@/utils/prisma";
import { apiResponse } from "@/utils/apiResponse";
import { ApiError } from "@/utils/apiError";

export const getListingById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (Array.isArray(id)) {
      throw ApiError.badRequest("Invalid listing ID.");
    }

    const listing = await prisma().listing.findUnique({
      where: {
        id,
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

    if (!listing) {
      throw ApiError.notFound("Listing not found.");
    }

    return res.status(200).json(
      apiResponse(
        200,
        { listing },
        "Listing fetched successfully.",
      ),
    );
  },
);
