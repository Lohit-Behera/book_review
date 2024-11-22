import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "@/lib/proxy";

type GetBook = {
  _id: string;
  title: string;
  author: string;
  genre: string[];
  description: string;
  createdBy: string;
  averageRating: number;
  totalReview: number;
  createdAt: string;
  updatedAt: string;
};

type AllBooks = {
  docs: GetBook[];
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

export const fetchCreateBook = createAsyncThunk(
  "book/create",
  async (
    book: {
      title: string;
      author: string;
      genre: string[];
      description: string;
      createdBy: string;
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
        `${baseUrl}/api/v1/books/create`,
        book,
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

export const fetchGetBook = createAsyncThunk(
  "book/get",
  async (bookId: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${baseUrl}/api/v1/books/get/${bookId}`,
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

export const fetchGetAllBooks = createAsyncThunk(
  "book/getAll",
  async (
    {
      sortBy,
      page,
      author,
    }: { sortBy?: string; page?: number; author?: string },
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${baseUrl}/api/v1/books/all?sortBy=${sortBy}&page=${page}&author=${author}`,
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

const bookSlice = createSlice({
  name: "book",
  initialState: {
    createBook: { data: {} },
    createBookStatus: "idle",
    createBookError: {},

    getBook: { data: {} as GetBook },
    getBookStatus: "idle",
    getBookError: {},

    getAllBooks: { data: {} as AllBooks },
    getAllBooksStatus: "idle",
    getAllBooksError: {},
  },
  reducers: {
    resetCreateBook: (state) => {
      state.createBook = { data: {} };
      state.createBookStatus = "idle";
      state.createBookError = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // create Book
      .addCase(fetchCreateBook.pending, (state) => {
        state.createBookStatus = "loading";
      })
      .addCase(fetchCreateBook.fulfilled, (state, action) => {
        state.createBookStatus = "succeeded";
        state.createBook = action.payload;
      })
      .addCase(fetchCreateBook.rejected, (state, action) => {
        state.createBookStatus = "failed";
        state.createBookError = action.payload || "Create Book failed";
      })

      // get Book
      .addCase(fetchGetBook.pending, (state) => {
        state.getBookStatus = "loading";
      })
      .addCase(fetchGetBook.fulfilled, (state, action) => {
        state.getBookStatus = "succeeded";
        state.getBook = action.payload;
      })
      .addCase(fetchGetBook.rejected, (state, action) => {
        state.getBookStatus = "failed";
        state.getBookError = action.payload || "Getting Book failed";
      })

      // get All Books
      .addCase(fetchGetAllBooks.pending, (state) => {
        state.getAllBooksStatus = "loading";
      })
      .addCase(fetchGetAllBooks.fulfilled, (state, action) => {
        state.getAllBooksStatus = "succeeded";
        state.getAllBooks = action.payload;
      })
      .addCase(fetchGetAllBooks.rejected, (state, action) => {
        state.getAllBooksStatus = "failed";
        state.getAllBooksError = action.payload || "Getting All Books failed";
      });
  },
});

export default bookSlice.reducer;
