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

export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async () => {
    const response = await api.get('/admin/users');
    return response.data;
  }
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (userId) => {
    await api.delete(`/admin/users/${userId}`);
    return userId;
  }
);

export const updateUserRole = createAsyncThunk(
  'user/updateUserRole',
  async ({ userId, role }) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  }
);

export const toggleFavoriteTool = createAsyncThunk(
  'user/toggleFavoriteTool',
  async (toolId) => {
    const response = await api.post(`/user/favorites/${toolId}`);
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
    users: [],
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
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(toggleFavoriteTool.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.favorites = action.payload.favorites;
        }
      })
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.preferences = action.payload;
        }
      })
      .addCase(logout.fulfilled, (state) => {
        state.profile = null;
        state.error = null;
      });
  }
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer; 