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

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
