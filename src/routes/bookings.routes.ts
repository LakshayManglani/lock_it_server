import { Router } from "express";
import { createBooking } from "@/modules/bookings/controllers/createBooking.controller";
import { getBookings } from "@/modules/bookings/controllers/getBookings.controller";
import { createBookingValidator } from "@/modules/bookings/validators/createBooking.validator";
import { validate } from "@/utils/validate";
import { requireAuth } from "@/middlewares/auth.middleware";

export function createBookingsV1Router(): Router {
  const router = Router();

  router.route("/").get(requireAuth, getBookings).post(requireAuth, validate(createBookingValidator), createBooking);

  return router;
}