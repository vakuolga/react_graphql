import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import resetAll from './resetAllSlice';

interface User {
  name: null | string;
  id: undefined | string;
  activated: boolean;
  email: null | string;
  isDeleted: boolean;
}

const initialState: User = {
  name: null,
  id: undefined,
  activated: false,
  email: null,
  isDeleted: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.name = action.payload.name;
      state.id = action.payload.id;
      state.activated = action.payload.activated;
      state.email = action.payload.email;
      state.isDeleted = action.payload.isDeleted;
    },
    resetUser: () => {
      console.log('resetUser');
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetAll, () => initialState);
  },
});

export const userSelector = (state: { user: User }) => state.user;
export default userSlice.reducer;
export const { addUser, resetUser } = userSlice.actions;
