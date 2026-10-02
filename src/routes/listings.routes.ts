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

export function createListingsV1Router(): Router {
  const router = Router();

  router.route("/").get(getListings).post(requireAuth, validate(createListingValidator), createListing);
  router.route("/:id").get(getListingById).patch(requireAuth, validate(updateListingValidator), updateListing).delete(requireAuth, deleteListing);

  return router;
}

