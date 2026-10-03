import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  MAX_LIMIT,
} from "@/modules/reviews/validators/getReviews.validator";
import { apiResponse } from "@/utils/apiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { prisma } from "@/utils/prisma";
import type { Request, Response } from "express";

function toPositiveInt(value: unknown): number | undefined {
  if (typeof value !== "string" || value.trim() === "") {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isInteger(parsed) ? parsed : undefined;
}

export const getReviews = asyncHandler(async (req: Request, res: Response) => {
  const listingId = typeof req.query.listingId === "string" ? req.query.listingId : undefined;

  const page = Math.max(1, toPositiveInt(req.query.page) ?? DEFAULT_PAGE);
  const limit = Math.min(toPositiveInt(req.query.limit) ?? DEFAULT_LIMIT, MAX_LIMIT);

  const where = { ...(listingId ? { listingId } : {}) };

  const [reviews, totalReviews, summary] = await Promise.all([
    prisma().review.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        user: { select: { id: true, name: true } },
        listing: { select: { id: true, title: true, location: true } },
      },
    }),
    prisma().review.count({ where }),
    prisma().review.aggregate({
      where: listingId ? { listingId } : {},
      _avg: { rating: true },
      _count: { rating: true },
    }),
  ]);

  const summaryCount = summary._count.rating;

  return res.status(200).json(
    apiResponse(
      200,
      {
        reviews,
        pagination: {
          page,
          limit,
          total: totalReviews,
          totalPages: Math.max(1, Math.ceil(totalReviews / limit)),
          hasNextPage: page * limit < totalReviews,
          hasPreviousPage: page > 1,
        },
        summary: {
          average: summary._avg.rating ? Math.round(summary._avg.rating * 100) / 100 : null,
          count: summaryCount,
        },
      },
      "Reviews fetched successfully.",
    ),
  );
});
