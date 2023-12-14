import { createAction } from '@reduxjs/toolkit';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const resetAllSlice = createSlice({
  name: 'resetAll',
  initialState: {},
  reducers: {},
});

export default resetAllSlice.reducer;
const resetAll = createAction('reset/all');
export { resetAll };
