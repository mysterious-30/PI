import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const login = createAsyncThunk(
  'user/login',
  async (credentials) => {
    const response = await axios.post('/api/auth/login', credentials);
    return response.data;
  }
);

export const register = createAsyncThunk(
  'user/register',
  async (userData) => {
    const response = await axios.post('/api/auth/register', userData);
    return response.data;
  }
);

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async () => {
    const response = await axios.get('/api/auth/me');
    return response.data;
  }
);

export const updateUserPreferences = createAsyncThunk(
  'user/updatePreferences',
  async (preferences) => {
    const response = await axios.put('/api/auth/preferences', preferences);
    return response.data;
  }
);

export const toggleFavoriteTool = createAsyncThunk(
  'user/toggleFavorite',
  async (toolId) => {
    const response = await axios.post(`/api/auth/favorites/${toolId}`);
    return response.data;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem('token')
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
      })
      // Update preferences
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.user.preferences = action.payload.preferences;
      })
      // Toggle favorite
      .addCase(toggleFavoriteTool.fulfilled, (state, action) => {
        state.user.favorites = action.payload.favorites;
      });
  }
});

export const { logout, clearError } = userSlice.actions;
export default userSlice.reducer; 