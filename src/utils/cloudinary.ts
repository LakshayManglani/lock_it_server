import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { cloudinaryConfig } from "@/config/cloudinary.config";

cloudinary.config(cloudinaryConfig);

type UploadImageOptions = {
  folder?: string;
};

async function uploadImage(
  buffer: Buffer,
  uploadImageOptions: UploadImageOptions = {}
): Promise<{ url: string; publicId: string }> {
  const { folder = "lockit/listings" } = uploadImageOptions;

  const response = await new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        overwrite: false,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary returned no upload result."));
          return;
        }

        resolve(result);
      }
    );

    stream.end(buffer);
  });

  return { url: response.secure_url, publicId: response.public_id };
}

async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId, {
    invalidate: true,
    resource_type: "image",
  });
}

export { uploadImage, deleteImage };
