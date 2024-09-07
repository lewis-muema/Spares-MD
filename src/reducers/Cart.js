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
    clearCart: (state) => {
      state.value.products = [];
    },
  },
});

export const { addToCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
