import { createSlice } from '@reduxjs/toolkit';

export const orderSlice = createSlice({
  name: 'cart',
  initialState: {
    value: {
      orders: [],
      loading: false,
    },
  },
  reducers: {
    setOrders: (state, action) => {
      state.value.orders = action.payload;
    },
    setLoading: (state, action) => {
      state.value.loading = action.payload;
    },
  },
});

export const { setOrders, setLoading } = orderSlice.actions;

export default orderSlice.reducer;
