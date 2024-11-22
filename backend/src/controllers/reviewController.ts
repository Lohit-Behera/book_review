import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import mongoose from "mongoose";
import { Book } from "../models/bookModel";
import { User } from "../models/userModel";
import { Review } from "../models/reviewModel";

const createReview = asyncHandler(async (req, res) => {
  // get data from req.body
  const { rating, review, bookId } = req.body;
  // validate data
  if (!rating || !review || !bookId) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Please provide all required fields."));
  }
  if (rating < 1 || rating > 5) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Rating must be between 1 and 5."));
  }
  if (review.length < 5) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, null, "Review must be at least 5 characters long.")
      );
  }
  // get user and book
  const user = await User.findById(req.user?._id);
  const book = await Book.findById(bookId);
  if (!user || !book) {
    return res
      .status(404)
      .json(
        new ApiResponse(404, null, "User or book not found. Please try again.")
      );
  }
  // create review
  const reviewCreating = await Review.create({
    rating,
    review,
    book: book._id,
    user: user._id,
  });
  // validate review is created
  const createdReview = await Review.findOne({ _id: reviewCreating._id });

  if (!createdReview) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          "Something went wrong while creating review."
        )
      );
  }
  // send response
  return res
    .status(201)
    .json(new ApiResponse(201, null, "Review created successfully."));
});

const getReviews = asyncHandler(async (req, res) => {
  // get book id from params
  const { bookId } = req.params;
  // get reviews
  const aggregate = Review.aggregate([
    {
      $match: {
        book: new mongoose.Types.ObjectId(bookId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    {
      $unwind: {
        path: "$userInfo",
      },
    },
    {
      $project: {
        _id: 1,
        review: 1,
        createdAt: 1,
        updatedAt: 1,
        rating: 1,
        userName: "$userInfo.name",
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  const reviews = await Review.aggregatePaginate(aggregate, {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
  });
  // validate reviews
  if (!reviews) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Reviews not found. Please try again."));
  }
  // send response
  return res
    .status(200)
    .json(new ApiResponse(200, reviews, "Reviews found successfully."));
});

export { createReview, getReviews };
