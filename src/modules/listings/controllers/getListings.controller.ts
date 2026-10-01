import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { prisma } from "@/utils/prisma";
import { apiResponse } from "@/utils/apiResponse";

export const getListings = asyncHandler(
  async (_req: Request, res: Response) => {
    const listings = await prisma().listing.findMany({
      orderBy: {
        createdAt: "desc",
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
        { listings },
        "Listings fetched successfully.",
      ),
    );
  },
);
