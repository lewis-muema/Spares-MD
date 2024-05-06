import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    value: {
      email: 'test@test.com',
    },
  },
  reducers: {
    saveEmail: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { saveEmail } = userSlice.actions;

export default userSlice.reducer;
