import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import spares from '../api/spares';
import {
  setLocationSuggestions, setAllPaymentMethods, setPaymentLoading, setPaymentMethodNumberErr,
  setUserPaymentMethods, setAddedPaymentMethodNumber, setAddedPaymentMethod, setPricing, setLoading,
  setLocationCoordinates, setSuccessMessage, setErrorMessage, setOrderDetails, reset,
} from '../reducers/Checkout';
import { clearCart } from '../reducers/Cart';
import * as RootNavigation from '../RootNavigation';

const storeData = async (key, value) => {
  await AsyncStorage.setItem(key, value);
};

export const fetchPlaces = (input) => {
  return async (dispatch) => {
    if (input) {
      spares.post('/locations', { input }).then((res) => {
        dispatch(setLocationSuggestions(res?.data?.data?.predictions));
      }).catch((err) => {});
    }
  };
};

export const fetchCoordinates = (placeId) => {
  return async (dispatch) => {
    if (placeId) {
      spares.post('/coordinates', { placeId }).then((res) => {
        dispatch(setLocationCoordinates(res?.data?.data?.result?.geometry));
      }).catch((err) => {});
    }
  };
};

export const fetchPrices = (payload) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    spares.post('/pricing', payload).then((res) => {
      dispatch(setPricing(res.data));
      dispatch(setLoading(false));
    }).catch((err) => {
      dispatch(setLoading(false));
      dispatch(setErrorMessage('Something went worng while fetching the prices'));
      setTimeout(() => {
        dispatch(setErrorMessage(''));
      }, 3000);
    });
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

export const fetchPaymentMethods = () => {
  return async (dispatch) => {
    spares.get('/payment-methods').then((res) => {
      const methods = [];
      res.data.paymethods.forEach((method) => {
        method.label = method.provider;
        method.value = method._id;
        methods.push(method);
      });
      dispatch(setAllPaymentMethods(methods));
    }).catch((err) => {});
  };
};

export const fetchUserPaymentMethods = () => {
  return async (dispatch) => {
    spares.get('/user-payment-methods').then((res) => {
      storeData('paymentMethods', JSON.stringify(res?.data?.paymethods));
      dispatch(setUserPaymentMethods(res?.data?.paymethods));
    }).catch((err) => {});
  };
};

export const sendPaymentMethods = (methods, setVisible) => {
  return async (dispatch) => {
    dispatch(setPaymentLoading(true));
    spares.post('/edit-account', methods).then(() => {
      spares.get('/user-payment-methods').then((res) => {
        dispatch(setPaymentLoading(false));
        storeData('paymentMethods', JSON.stringify(res?.data?.paymethods));
        dispatch(setUserPaymentMethods(res?.data?.paymethods));
        dispatch(setAddedPaymentMethodNumber(''));
        dispatch(setAddedPaymentMethod({}));
        setVisible(false);
      });
    }).catch((err) => {
      dispatch(setPaymentMethodNumberErr(err?.response?.data?.error));
      dispatch(setPaymentLoading(false));
    });
  };
};

export const createOrder = (payload, clearNavigation) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    spares.post('/transactions', payload).then((res) => {
      dispatch(setOrderDetails(res?.data?.data));
      dispatch(setLoading(false));
      dispatch(setSuccessMessage('Order created successfully'));
      setTimeout(() => {
        clearNavigation();
        dispatch(reset());
        dispatch(clearCart());
      }, 3000);
    }).catch((err) => {
      dispatch(setLoading(false));
      dispatch(setErrorMessage(`${err.response.data.message}, ${err.response.data.error}`));
      setTimeout(() => {
        dispatch(setErrorMessage(''));
      }, 3000);
    });
  };
};

export const regexCheck = (provider, val) => {
  const visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
  const mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
  const amexpRegEx = /^(?:3[47][0-9]{13})$/;
  const discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
  const mpesaRegex = /^([0-9\s]{10,})$/;
  const otherRegex = /^([a-zA-Z0-9\s]{2,})$/;

  const value = val.replaceAll(' ', '');

  if (provider.includes('CARD')) {
    return visaRegEx.test(value) || mastercardRegEx.test(value)
      || amexpRegEx.test(value) || discovRegEx.test(value);
  }
  if (provider.includes('MPESA')) {
    return mpesaRegex.test(value);
  }
  return otherRegex.test(value);
};
