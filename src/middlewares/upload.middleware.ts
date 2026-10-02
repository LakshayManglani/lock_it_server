import multer, { type FileFilterCallback } from "multer";
import type { RequestHandler } from "express";
import { ApiError } from "@/utils/apiError";
import { asyncHandler } from "@/utils/asyncHandler";

const MAX_IMAGES_PER_UPLOAD = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

/**
 * @description Files are held in memory rather than written to disk, since
 * `uploadImage` only needs a buffer to forward to Cloudinary.
 */
const storage = multer.memoryStorage();

function fileFilter(_req: Express.Request, file: Express.Multer.File, callback: FileFilterCallback) {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    callback(ApiError.badRequest(`Unsupported image type "${file.mimetype}". Allowed: jpeg, png, webp, avif.`));
    return;
  }

  callback(null, true);
}

const uploader = multer({
  storage,
  limits: {
    files: MAX_IMAGES_PER_UPLOAD,
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter,
});

const uploadListingImages: RequestHandler = asyncHandler(async (req, _res, next) => {
  await new Promise<void>((resolve, reject) => {
    uploader.array("images", MAX_IMAGES_PER_UPLOAD)(req, _res, (error: unknown) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  }).catch((error: unknown) => {
    if (error instanceof multer.MulterError) {
      const message =
        error.code === "LIMIT_FILE_SIZE"
          ? `Each image must be ${MAX_FILE_SIZE / 1024 / 1024}MB or smaller.`
          : error.code === "LIMIT_FILE_COUNT"
            ? `Upload at most ${MAX_IMAGES_PER_UPLOAD} images per request.`
            : "Invalid image upload.";

      throw ApiError.badRequest(message);
    }

    throw error;
  });

  return next();
});

export { uploadListingImages, MAX_IMAGES_PER_UPLOAD, MAX_FILE_SIZE };
