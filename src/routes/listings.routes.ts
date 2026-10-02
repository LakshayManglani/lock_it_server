import { Router } from "express";
import { getListings } from "@/modules/listings/controllers/getListings.controller";
import { getListingById } from "@/modules/listings/controllers/getListingById.controller";
import { createListingValidator } from "@/modules/listings/validators/createListing.validator";
import { createListing } from "@/modules/listings/controllers/createListing.controller";
import { validate } from "@/utils/validate";
import { requireAuth } from "@/middlewares/auth.middleware";
import { updateListingValidator } from "@/modules/listings/validators/updateListing.validator";
import { updateListing } from "@/modules/listings/controllers/updateListing.controller";
import { deleteListing } from "@/modules/listings/controllers/deleteListing.controller";
import { addListingImages } from "@/modules/listings/controllers/addListingImages.controller";
import { deleteListingImage } from "@/modules/listings/controllers/deleteListingImage.controller";
import { uploadListingImages } from "@/middlewares/upload.middleware";

export function createListingsV1Router(): Router {
  const router = Router();

  router.route("/").get(getListings).post(requireAuth, validate(createListingValidator), createListing);
  router.route("/:id").get(getListingById).patch(requireAuth, validate(updateListingValidator), updateListing).delete(requireAuth, deleteListing);

  router.route("/:id/images").post(requireAuth, uploadListingImages, addListingImages);
  router.route("/:id/images/:imageId").delete(requireAuth, deleteListingImage);

  return router;
}
