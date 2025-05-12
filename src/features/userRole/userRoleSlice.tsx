import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface UserRole {
  id: number;
  name: string;
  permissions: string[];
}

interface UserRoleState {
  roles: UserRole[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserRoleState = {
  roles: [],
  status: 'idle',
  error: null,
};

export const fetchUserRoles = createAsyncThunk(
  'userRoles/fetchUserRoles',
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/roles/get_roles`
    );
    return response.data.roles;
  }
);

export const deleteUserRole = createAsyncThunk(
  'userRoles/deleteUserRole',
  async (id: number) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/roles/delete_role/${id}`
      );
      return id;
    } catch (error) {
      throw new Error('Failed to delete role');
    }
  }
);

export const createUserRole = createAsyncThunk(
  'userRoles/createUserRole',
  async (roleData: { name: string; permissions: string[] }) => {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/roles/create_role`,
      roleData
    );
    return response.data.role;
  }
);

export const updateUserRole = createAsyncThunk(
  'userRoles/updateUserRole',
  async (roleData: { id: number; name: string; permissions: string[] }) => {
    const response = await axios.put(
      'https://DOB-ecomm-be.onrender.com/api/v1/roles/update_role',
      roleData
    );
    return response.data;
  }
);

const userRoleSlice = createSlice({
  name: 'userRoles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserRoles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchUserRoles.fulfilled,
        (state, action: PayloadAction<UserRole[]>) => {
          state.status = 'succeeded';
          state.roles = action.payload;
        }
      )
      .addCase(fetchUserRoles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch roles';
      })
      .addCase(
        deleteUserRole.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.roles = state.roles.filter(
            (role) => role.id !== action.payload
          );
        }
      )
      .addCase(createUserRole.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        createUserRole.fulfilled,
        (state, action: PayloadAction<UserRole>) => {
          state.roles.push(action.payload);
        }
      )
      .addCase(deleteUserRole.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteUserRole.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to delete role';
      })
      .addCase(updateUserRole.pending, (state) => {
        state.status = 'loading';
      })

      .addCase(updateUserRole.fulfilled, (state, action) => {
        const index = state.roles.findIndex(
          (role) => role.id === action.payload.id
        );
        if (index !== -1) {
          state.roles[index] = action.payload; // Update the existing role
        }
        state.status = 'succeeded';
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update role'; // Set error message
      });
  },
});

export default userRoleSlice.reducer;
