import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { User } from "../models/userModel";
import { Review } from "../models/reviewModel";
import { Response } from "express";
import mongoose from "mongoose";

function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// generate access token and refresh token
const generateTokens = async (userId: string, res: Response) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json(new ApiResponse(404, null, "User not found"));
      return null;
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          "Something went wrong while generating tokens"
        )
      );
    return null;
  }
};

// register user
const userRegister = asyncHandler(async (req, res) => {
  // get data from req.body
  const { name, email, password, confirmPassword } = req.body;

  // validate data
  if (!name || !email || !password || !confirmPassword) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Please provide all required fields."));
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          null,
          "Password must be at least 6 characters long."
        )
      );
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Passwords do not match."));
  }

  if (name.length < 3) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, null, "Name must be at least 3 characters long.")
      );
  }
  if (name.length > 30) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, null, "Name must be at most 30 characters long.")
      );
  }
  if (!validateEmail(email)) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, null, "Please provide a valid email address.")
      );
  }

  // check user already exists
  if (await User.findOne({ email })) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "User already exists."));
  }

  // create user
  const user = await User.create({
    name,
    email,
    password,
  });

  // give admin access to first user
  if ((await User.countDocuments()) === 1) {
    user.isAdmin = true;
    await user.save({ validateBeforeSave: false });
  }

  // validate user created
  const createdUser = await User.findOne({ _id: user._id });
  if (!createdUser) {
    return res
      .status(500)
      .json(
        new ApiResponse(500, null, "Something went wrong while creating user.")
      );
  }

  // send response
  return res
    .status(201)
    .json(new ApiResponse(201, null, "User created successfully."));
});

// login user
const userLogin = asyncHandler(async (req, res) => {
  // get data from req.body
  const { email, password } = req.body;

  // validate data
  if (!email || !password) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Please provide all required fields."));
  }

  // check user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Invalid credentials."));
  }

  // check password
  if (!(await user.comparePassword(password))) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Invalid credentials."));
  }

  // generate tokens
  const tokens = await generateTokens(user._id, res);
  if (!tokens) {
    return; // Exit if tokens generation failed
  }
  const { accessToken, refreshToken } = tokens;

  const updatedUser = await User.findOne({ _id: user._id });

  // send response
  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 24 * 60 * 60 * 1000,
    })
    .json(new ApiResponse(200, updatedUser, "Login successful."));
});

// logout user
const userLogout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        refreshToken: null,
      },
    },
    {
      new: true,
    }
  );
  // send response
  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, null, "Logout successful."));
});

const userDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select(
    "-password -refreshToken -__v"
  );
  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found."));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User found successfully."));
});

const getUserInfo = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const user = await Review.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: "$user",
        totalReviews: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: "$userDetails",
    },
    {
      $project: {
        _id: 0,
        userId: "$_id",
        name: "$userDetails.name",
        email: "$userDetails.email",
        isAdmin: "$userDetails.isAdmin",
        totalReviews: 1,
      },
    },
  ]);

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found."));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user[0], "User found successfully."));
});

const userUpdate = asyncHandler(async (req, res) => {
  // get data from req.body
  const { name, email } = req.body;

  const user = await User.findById(req.user?._id);

  // validate data
  if (!name || !email) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Please provide all required fields."));
  }
  if (user?.name !== name && user) {
    user.name = name;
    await user.save({ validateBeforeSave: false });
  }
  if (user?.email !== email && user) {
    user.email = email;
    await user.save({ validateBeforeSave: false });
  }

  // send response
  return res
    .status(200)
    .json(new ApiResponse(200, null, "User updated successfully."));
});

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Please provide all required fields."));
  }

  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Passwords do not match."));
  }

  const user = await User.findById(req.user?._id);
  if (user) {
    if (!(await user?.comparePassword(oldPassword))) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Old password is incorrect."));
    } else {
      user.password = newPassword;
      await user.save({ validateBeforeSave: false });

      return res
        .status(200)
        .json(new ApiResponse(200, null, "Password updated successfully."));
    }
  }
});

export {
  userRegister,
  userLogin,
  userLogout,
  userDetails,
  getUserInfo,
  userUpdate,
  updatePassword,
};
