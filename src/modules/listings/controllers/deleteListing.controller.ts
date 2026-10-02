import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { prisma } from "@/utils/prisma";
import { apiResponse } from "@/utils/apiResponse";
import { ApiError } from "@/utils/apiError";
import { deleteImage } from "@/utils/cloudinary";

export const deleteListing = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (Array.isArray(id)) {
      throw ApiError.badRequest("Invalid listing ID.");
    }

    const user = req.user!;

    const listing = await prisma().listing.findUnique({
      where: { id },
    });

    if (!listing) {
      throw ApiError.notFound("Listing not found.");
    }

    if (listing.hostId !== user.id) {
      throw ApiError.forbidden(
        "You are not allowed to delete this listing.",
      );
    }

    const images = await prisma().image.findMany({
      where: { listingId: id },
      select: { publicId: true },
    });

    await prisma().listing.delete({
      where: { id },
    });

    await Promise.allSettled(images.map(({ publicId }) => deleteImage(publicId)));

    return res.status(200).json(
      apiResponse(
        200,
        null,
        "Listing deleted successfully.",
      ),
    );
  },
);
