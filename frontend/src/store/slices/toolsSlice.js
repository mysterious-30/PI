import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/api';

// Async thunks
export const fetchTools = createAsyncThunk(
  'tools/fetchTools',
  async () => {
    const response = await api.get('/tools');
    return response.data;
  }
);

export const fetchToolBySlug = createAsyncThunk(
  'tools/fetchToolBySlug',
  async (slug) => {
    const response = await api.get(`/tools/${slug}`);
    return response.data;
  }
);

export const fetchToolsByCategory = createAsyncThunk(
  'tools/fetchToolsByCategory',
  async (category) => {
    const response = await api.get(`/tools/category/${category}`);
    return response.data;
  }
);

export const searchTools = createAsyncThunk(
  'tools/searchTools',
  async (query) => {
    const response = await api.get(`/tools/search?q=${query}`);
    return response.data;
  }
);

export const deleteTool = createAsyncThunk(
  'tools/deleteTool',
  async (toolId) => {
    await api.delete(`/admin/tools/${toolId}`);
    return toolId;
  }
);

export const createTool = createAsyncThunk(
  'tools/createTool',
  async (toolData) => {
    const response = await api.post('/admin/tools', toolData);
    return response.data;
  }
);

export const updateTool = createAsyncThunk(
  'tools/updateTool',
  async ({ toolId, ...toolData }) => {
    const response = await api.put(`/admin/tools/${toolId}`, toolData);
    return response.data;
  }
);

export const trackToolUsage = createAsyncThunk(
  'tools/trackToolUsage',
  async (toolId) => {
    const response = await api.post(`/analytics/track-usage/${toolId}`);
    return response.data;
  }
);

const toolsSlice = createSlice({
  name: 'tools',
  initialState: {
    items: [],
    currentTool: null,
    categoryTools: [],
    searchResults: [],
    loading: false,
    error: null
  },
  reducers: {
    clearCurrentTool: (state) => {
      state.currentTool = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all tools
      .addCase(fetchTools.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTools.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTools.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch tool by slug
      .addCase(fetchToolBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchToolBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTool = action.payload;
      })
      .addCase(fetchToolBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch tools by category
      .addCase(fetchToolsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchToolsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryTools = action.payload;
      })
      .addCase(fetchToolsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Search tools
      .addCase(searchTools.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchTools.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchTools.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete tool
      .addCase(deleteTool.fulfilled, (state, action) => {
        state.items = state.items.filter(tool => tool._id !== action.payload);
      })
      // Create tool
      .addCase(createTool.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update tool
      .addCase(updateTool.fulfilled, (state, action) => {
        const index = state.items.findIndex(tool => tool._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  }
});

export const { clearCurrentTool, clearSearchResults } = toolsSlice.actions;
export default toolsSlice.reducer; 