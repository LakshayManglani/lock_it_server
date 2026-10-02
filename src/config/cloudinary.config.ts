import env from "./env.config";
import { ConfigOptions } from "cloudinary"

const cloudinaryConfig: ConfigOptions = {
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
};

export { cloudinaryConfig };
