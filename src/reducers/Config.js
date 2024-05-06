import { createSlice } from '@reduxjs/toolkit';

export const configSlice = createSlice({
  name: 'config',
  initialState: {
    value: {
      accessToken: null,
    },
  },
  reducers: {
    storeConfig: (state, action) => {
      state.value.accessToken = action.payload;
    },
  },
});

export const { storeConfig } = configSlice.actions;

export default configSlice.reducer;
