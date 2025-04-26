import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/api';

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async () => {
    const response = await api.get('/user/profile');
    return response.data;
  }
);

export const updateUserPreferences = createAsyncThunk(
  'user/updateUserPreferences',
  async (preferences) => {
    const response = await api.put('/user/preferences', preferences);
    return response.data;
  }
);

export const logout = createAsyncThunk(
  'user/logout',
  async () => {
    await api.post('/auth/logout');
    return null;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
    loading: false,
    error: null
  },
  reducers: {
    clearUser: (state) => {
      state.profile = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.profile = { ...state.profile, preferences: action.payload };
      })
      .addCase(logout.fulfilled, (state) => {
        state.profile = null;
        state.error = null;
      });
  }
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer; 