import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "@/features/UserSlice";
import BookSlice from "@/features/BookSlice";
import ReviewSlice from "@/features/ReviewSlice";

const store = configureStore({
  reducer: {
    user: UserSlice,
    book: BookSlice,
    review: ReviewSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
