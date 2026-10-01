import { Router } from "express";
import { getListings } from "@/modules/listings/controllers/getListings.controller";

export function createListingsV1Router(): Router {
  const router = Router();

  router.route("/").get(getListings);

  return router;
}

