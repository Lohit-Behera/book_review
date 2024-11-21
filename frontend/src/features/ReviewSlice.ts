import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "@/lib/proxy";

type Review = {
  _id: string;
  review: string;
  createdAt: string;
  updatedAt: string;
  username: string;
  rating: number;
};

type GetReviews = {
  docs: Review[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
};

export const fetchCreateReview = createAsyncThunk(
  "review/create",
  async (
    review: {
      rating: number;
      review: string;
      bookId: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.post(
        `${baseUrl}/api/v1/reviews/create`,
        review,
        config
      );
      return data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchGetReviews = createAsyncThunk(
  "review/get",
  async (bookId: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${baseUrl}/api/v1/reviews/get/${bookId}`,
        config
      );
      return data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

const reviewSlice = createSlice({
  name: "review",
  initialState: {
    createReview: {},
    createReviewStatus: "idle",
    createReviewError: {},

    getReviews: { data: {} as GetReviews },
    getReviewsStatus: "idle",
    getReviewsError: {},
  },
  reducers: {
    resetCreateReview: (state) => {
      state.createReview = {};
      state.createReviewStatus = "idle";
      state.createReviewError = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreateReview.pending, (state) => {
        state.createReviewStatus = "loading";
      })
      .addCase(fetchCreateReview.fulfilled, (state, action) => {
        state.createReviewStatus = "succeeded";
        state.createReview = action.payload;
      })
      .addCase(fetchCreateReview.rejected, (state, action) => {
        state.createReviewStatus = "failed";
        state.createReviewError = action.payload || "Failed to create review";
      })

      .addCase(fetchGetReviews.pending, (state) => {
        state.getReviewsStatus = "loading";
      })
      .addCase(fetchGetReviews.fulfilled, (state, action) => {
        state.getReviewsStatus = "succeeded";
        state.getReviews = action.payload;
      })
      .addCase(fetchGetReviews.rejected, (state, action) => {
        state.getReviewsStatus = "failed";
        state.getReviewsError = action.payload || "Failed to get reviews";
      });
  },
});

export default reviewSlice.reducer;
