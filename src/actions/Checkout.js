import spares from '../api/spares';
import { setLocationSuggestions } from '../reducers/Checkout';

export const fetchPlaces = (input) => {
  return async (dispatch) => {
    if (input) {
      spares.post('/locations', { input }).then((res) => {
        dispatch(setLocationSuggestions(res?.data?.data?.predictions));
      }).catch((err) => {});
    }
  };
};

export const checkout = (input) => {
  return async (dispatch) => {
    if (input) {
      spares.post('/locations', { input }).then((res) => {
      }).catch((err) => {});
    }
  };
};
