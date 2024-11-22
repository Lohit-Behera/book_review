import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { Book } from "../models/bookModel";
import { User } from "../models/userModel";
import mongoose from "mongoose";

const createBook = asyncHandler(async (req, res) => {
  // get data from req.body
  const { title, author, genre, description } = req.body;
  // validate data
  if (!title || !author || !genre || !description) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Please provide all required fields."));
  }
  if (!Array.isArray(genre)) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Please provide an array of genres."));
  }
  if (genre.length < 1) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Please provide at least one genre."));
  }
  if (title.length < 1) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, null, "Title must be at least 1 characters long.")
      );
  }
  if (author.length < 3) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, null, "Author must be at least 3 characters long.")
      );
  }
  if (description.length < 10) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          null,
          "Description must be at least 10 characters long."
        )
      );
  }
  const user = await User.findById(req.user?._id);
  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found."));
  }
  // create book
  const book = await Book.create({
    title,
    author,
    genre,
    description,
    createdBy: user._id,
  });
  // validate book is created
  const createdBook = await Book.findOne({ _id: book._id });
  if (!createdBook) {
    return res
      .status(500)
      .json(
        new ApiResponse(500, null, "Something went wrong while creating book.")
      );
  }
  // send response
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { id: createdBook._id },
        "Book created successfully."
      )
    );
});

const getBook = asyncHandler(async (req, res) => {
  const bookId = req.params.bookId;
  const book = await Book.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(bookId),
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "book",
        as: "reviews",
      },
    },
    {
      $addFields: {
        averageRating: {
          $cond: {
            if: { $gt: [{ $size: "$reviews" }, 0] },
            then: { $avg: "$reviews.rating" },
            else: null,
          },
        },
        totalReview: {
          $size: "$reviews",
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        author: 1,
        genre: 1,
        description: 1,
        averageRating: 1,
        totalReview: 1,
        createdAt: 1,
        updatedAt: 1,
        createdBy: "$user.name",
      },
    },
  ]);
  if (!book) {
    return res.status(404).json(new ApiResponse(404, null, "Book not found."));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, book[0], "Book found successfully."));
});

const getAllBooks = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, sortBy = "desc" } = req.query;

  // Building the aggregation pipeline
  const pipeline: any[] = [
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "book",
        as: "reviews",
      },
    },
    {
      $addFields: {
        averageRating: {
          $cond: {
            if: { $gt: [{ $size: "$reviews" }, 0] },
            then: { $avg: "$reviews.rating" },
            else: null,
          },
        },
        totalReview: { $size: "$reviews" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: { path: "$user" },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        author: 1,
        genre: 1,
        description: 1,
        averageRating: 1,
        totalReview: 1,
        createdAt: 1,
        updatedAt: 1,
        createdBy: "$user.name",
      },
    },
  ];

  // Sorting by createdAt
  if (sortBy === "reviews") {
    pipeline.push({
      $sort: { totalReview: -1 },
    });
  } else {
    pipeline.push({
      $sort: { createdAt: sortBy === "asc" ? 1 : -1 },
    });
  }
  // Pagination
  const options = {
    page: Number(page),
    limit: Number(limit),
  };

  const books = await Book.aggregatePaginate(Book.aggregate(pipeline), options);

  if (books.docs.length === 0) {
    return res.status(200).json(new ApiResponse(200, null, "No books found."));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, books, "Books found successfully."));
});

export { createBook, getBook, getAllBooks };
