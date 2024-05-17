import { createSlice } from '@reduxjs/toolkit';

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    value: {
      products: [],
    },
  },
  reducers: {
    addToCart: (state, action) => {
      state.value.products = action.payload;
    },
  },
});

export const { addToCart } = cartSlice.actions;

export default cartSlice.reducer;
