import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { resetAll } from './resetAllSlice';

interface JwtTokens {
  accessToken: null | string;
  refreshToken: null | string;
}

const initialState: JwtTokens = {
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    addJwtTokens: (state, action: PayloadAction<JwtTokens>) => {
      return { ...state, ...action.payload };
    },
    resetAuth: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(resetAll, () => initialState);
  },
});

export const authSelector = (state: {
  auth: { accessToken: null | string; refreshToken: null | string };
}) => state.auth;
export default authSlice.reducer;
export const { addJwtTokens, resetAuth } = authSlice.actions;
