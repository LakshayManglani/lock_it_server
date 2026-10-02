import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { prisma } from "@/utils/prisma";
import { apiResponse } from "@/utils/apiResponse";
import { ApiError } from "@/utils/apiError";
import { deleteImage } from "@/utils/cloudinary";

/**
 * @description Deletes the row first, then the Cloudinary asset. Reversing the order
 * would leave a row pointing at a live asset that nothing can ever remove again if
 * the second call fails; this way a failed asset delete only leaves an orphaned
 * asset, which costs storage but breaks nothing the user can see.
 */
export const deleteListingImage = asyncHandler(
  async (req: Request, res: Response) => {
    const { id, imageId } = req.params;

    if (Array.isArray(id) || Array.isArray(imageId)) {
      throw ApiError.badRequest("Invalid listing or image ID.");
    }

    const user = req.user!;

    if (user.role !== "HOST") {
      throw ApiError.forbidden("Only hosts can delete images.");
    }

    const listing = await prisma().listing.findUnique({
      where: { id },
      select: { id: true, hostId: true },
    });

    if (!listing) {
      throw ApiError.notFound("Listing not found.");
    }

    if (listing.hostId !== user.id) {
      throw ApiError.forbidden("You are not allowed to modify this listing.");
    }

    const image = await prisma().image.findFirst({
      where: { id: imageId, listingId: listing.id },
      select: { id: true, publicId: true },
    });

    if (!image) {
      throw ApiError.notFound("Image not found for this listing.");
    }

    await prisma().image.delete({ where: { id: image.id } });

    await deleteImage(image.publicId);

    return res.status(200).json(
      apiResponse(200, null, "Image deleted successfully."),
    );
  },
);
