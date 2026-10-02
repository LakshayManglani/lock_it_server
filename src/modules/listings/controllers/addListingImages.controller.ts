import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { prisma } from "@/utils/prisma";
import { apiResponse } from "@/utils/apiResponse";
import { ApiError } from "@/utils/apiError";
import { uploadImage, deleteImage } from "@/utils/cloudinary";

const MAX_IMAGES_PER_LISTING = 20;

/**
 * @description Uploads each file to Cloudinary, then records one `Image` row per
 * asset. Cloudinary is called first because it is the step that can fail slowly;
 * if the database write then fails, the uploaded assets are destroyed so they do
 * not linger as orphans with no row pointing at them.
 */
export const addListingImages = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (Array.isArray(id)) {
      throw ApiError.badRequest("Invalid listing ID.");
    }

    const user = req.user!;

    if (user.role !== "HOST") {
      throw ApiError.forbidden("Only hosts can add images.");
    }

    const listing = await prisma().listing.findUnique({
      where: { id },
      select: { id: true, hostId: true, _count: { select: { images: true } } },
    });

    if (!listing) {
      throw ApiError.notFound("Listing not found.");
    }

    if (listing.hostId !== user.id) {
      throw ApiError.forbidden("You are not allowed to add images to this listing.");
    }

    const files = req.files as Express.Multer.File[] | undefined;

    if (!files?.length) {
      throw ApiError.badRequest("Attach at least one image under the \"images\" field.");
    }

    const existing = listing._count.images;

    if (existing + files.length > MAX_IMAGES_PER_LISTING) {
      throw ApiError.badRequest(
        `A listing can hold at most ${MAX_IMAGES_PER_LISTING} images, ${existing} already attached.`,
      );
    }

    const uploaded: { url: string; publicId: string }[] = [];

    try {
      for (const file of files) {
        uploaded.push(await uploadImage(file.buffer));
      }
    } catch {
      await Promise.allSettled(uploaded.map(({ publicId }) => deleteImage(publicId)));

      throw ApiError.unprocessableEntity("One or more images could not be uploaded.");
    }

    try {
      await prisma().image.createMany({
        data: uploaded.map(({ url, publicId }) => ({
          url,
          publicId,
          listingId: listing.id,
        })),
      });
    } catch (error) {
      await Promise.allSettled(uploaded.map(({ publicId }) => deleteImage(publicId)));

      throw error;
    }

    const images = await prisma().image.findMany({
      where: { listingId: listing.id },
      orderBy: { createdAt: "asc" },
      select: { id: true, url: true, publicId: true, createdAt: true },
    });

    return res.status(201).json(
      apiResponse(
        201,
        { images, uploaded: uploaded.length },
        "Images added successfully.",
      ),
    );
  },
);

export { MAX_IMAGES_PER_LISTING };
