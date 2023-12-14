import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import AuthReducer from './feature/authSlice';
import UserReducer from './feature/userSlice';
import resetAllSlice from './feature/resetAllSlice';

export const store = configureStore({
  reducer: {
    auth: AuthReducer,
    user: UserReducer,
    resetAll: resetAllSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
