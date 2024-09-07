import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

export const trackSlice = createSlice({
  name: 'track',
  initialState: {
    value: {
      order: {},
      loading: false,
      timeline: [
        {
          time: moment().format('hh:mm:ss a'),
          activity: 'Order created',
          event: 'past',
        },
        {
          time: moment().format('hh:mm:ss a'),
          activity: 'Order pending',
          event: 'present',
        },
        {
          time: moment().format('hh:mm:ss a'),
          activity: 'Order dispatched',
          event: 'future',
        },
      ],
    },
  },
  reducers: {
    setOrder: (state, action) => {
      state.value.order = action.payload;
    },
    setLoading: (state, action) => {
      state.value.loading = action.payload;
    },
    setTimeline: (state, action) => {
      state.value.timeline = action.payload;
    },
  },
});

export const { setOrder, setLoading, setTimeline } = trackSlice.actions;

export default trackSlice.reducer;
