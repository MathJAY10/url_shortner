/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Create short URL thunk
export const createShortUrl = createAsyncThunk('createShortUrl', async (originalUrl, thunkAPI) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_API_URL}/url/shorten`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      },
      body: JSON.stringify({
        originalUrl,
        userId: localStorage.getItem("userId")
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create short URL");
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Fetch all URLs thunk
export const fetchAllUrls = createAsyncThunk('fetchAllUrls', async (_, thunkAPI) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_API_URL}/analytics/getlinks`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch URLs");
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Slice
const urlSlice = createSlice({
  name: 'urls',
  initialState: {
    isLoading: false,
    urls: [],
    isError: false,
  },
  reducers: {
    setUrls: (state, action) => {
      state.urls = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder

      // Fetch all URLs
      .addCase(fetchAllUrls.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchAllUrls.fulfilled, (state, action) => {
        state.isLoading = false;
        state.urls = action.payload;
      })
      .addCase(fetchAllUrls.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        console.error("Fetch failed:", action.payload);
      })

      // Create short URL
      .addCase(createShortUrl.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createShortUrl.fulfilled, (state, action) => {
        state.isLoading = false;
        state.urls.push(action.payload);
      })
      .addCase(createShortUrl.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        console.error("Create URL failed:", action.payload);
      });
  }
});

// Selector and export
export const { setUrls } = urlSlice.actions;
export const urls = (state) => state.urls; // useSelector(urls).urls
export default urlSlice.reducer;
