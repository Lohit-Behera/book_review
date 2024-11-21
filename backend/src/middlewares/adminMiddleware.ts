import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";

export const adminMiddleware = asyncHandler(async (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res
      .status(403)
      .json(
        new ApiResponse(
          403,
          null,
          "You are not authorized to perform this action"
        )
      );
  }
  next();
});
