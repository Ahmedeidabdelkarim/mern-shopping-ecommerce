import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  reviews: [],
};

export const addReview = createAsyncThunk(
  "/order/addReview",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/shop/review/add`,
        formData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: error.message || "Unable to add review.",
        }
      );
    }
  }
);

export const getReviews = createAsyncThunk("/order/getReviews", async (id) => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/api/shop/review/${id}`
  );

  return response.data;
});

export const deleteReview = createAsyncThunk(
  "/order/deleteReview",
  async (reviewId) => {
    const response = await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/api/shop/review/${reviewId}`,
    );
    return response.data;
  }
);

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(getReviews.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
      })
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews.push(action.payload.data);
      })
      .addCase(addReview.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = state.reviews.filter(
          (review) => review._id !== action.payload.data._id
        );
      })
      .addCase(deleteReview.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default reviewSlice.reducer;