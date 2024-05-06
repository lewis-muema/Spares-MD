import AsyncStorage from '@react-native-async-storage/async-storage';
import spares from '../api/spares';
import * as RootNavigation from '../RootNavigation';
import {
  addError, addToken, storeUser, addSuccess, setLoading, changeStage, setLocations, reset,
} from '../reducers/Auth';

const storeData = async (key, value) => {
  await AsyncStorage.setItem(key, value);
};

const removeData = async (key) => {
  await AsyncStorage.removeItem(key);
};

export const signup = ({
  email, password, firstName, lastName, userType, userTypes,
}) => {
  const status = 'active';
  const currency = 'KSH';
  const paymentMethod = {
    paytype: 'postpay',
  };
  return async (dispatch) => {
    const payload = {
      email,
      password,
      firstname: firstName,
      lastname: lastName,
      type: userTypes[userType],
      status,
      currency,
      paymentMethod,
    };
    spares.post('/signup', payload).then(async (res) => {
      storeData('token', res?.data?.token);
      storeData('email', email);
      storeData('userId', res?.data?.userId);
      dispatch(addToken(res?.data?.token));
      dispatch(setLoading(false));
      if (userType === 1) {
        dispatch(changeStage(2));
        dispatch(setLoading(false));
      } else {
        RootNavigation.navigate('Products');
        dispatch(reset());
      }
    }).catch((err) => {
      dispatch(addError(err?.response?.data?.message));
      dispatch(setLoading(false));
      setTimeout(() => {
        dispatch(addError(''));
      }, 5000);
    });
  };
};

export const signin = ({ email, password }, loading) => {
  return async (dispatch) => {
    spares.post('/signin', { email, password }).then((res) => {
      storeData('token', res?.data?.token);
      storeData('email', email);
      storeData('userId', res?.data?.userId);
      dispatch(addToken(res?.data?.token));
      loading(false);
      RootNavigation.navigate('Products');
    }).catch((err) => {
      dispatch(addError(err?.response?.data?.message));
      loading(false);
    });
  };
};

export const signout = () => {
  return async (dispatch) => {
    removeData('token');
    removeData('photos');
    dispatch(addToken(null));
    RootNavigation.navigate('Auth', { screen: 'Signin' });
  };
};

export const sendResetEmail = ({ email }, stage) => {
  return async (dispatch) => {
    spares.post('/forgot-password', { email }).then((res) => {
      dispatch(storeUser(res?.data?.id));
      dispatch(setLoading(false));
      stage(2);
      dispatch(addSuccess(res?.data?.message));
      setTimeout(() => {
        dispatch(addSuccess(''));
      }, 6000);
    }).catch((err) => {
      dispatch(addError(err?.response?.data?.message));
      setTimeout(() => {
        dispatch(addError(''));
      }, 3000);
      dispatch(setLoading(false));
    });
  };
};

export const validateToken = ({ id, token, password }, loading) => {
  return async (dispatch) => {
    spares.post('/validate-token', { id, token, password }).then((res) => {
      dispatch(storeUser(''));
      dispatch(setLoading(false));
      dispatch(addSuccess(res?.data?.message));
      setTimeout(() => {
        dispatch(addSuccess(''));
        RootNavigation.navigate('Auth', { screen: 'Signin' });
      }, 6000);
    }).catch((err) => {
      dispatch(addError(err?.response?.data?.message));
      setTimeout(() => {
        dispatch(addError(''));
      }, 3000);
      dispatch(setLoading(false));
    });
  };
};

export const deleteAccount = dispatch => (loading) => {
  loading(true);
  spares.delete('/delete-account').then((res) => {
    removeData('token');
    dispatch(addToken(null));
    dispatch(addSuccess(res?.data?.message));
    RootNavigation.navigate('Auth', { screen: 'Signin' });
    loading(false);
    setTimeout(() => {
      dispatch(addSuccess(''));
    }, 6000);
  }).catch((err) => {
    dispatch(addError(err?.response?.data?.message));
    setTimeout(() => {
      dispatch(addError(''));
    }, 3000);
    loading(false);
  });
};

export const validateAuth = () => {
  return async (dispatch) => {
    const value = await AsyncStorage.getItem('token');
    if (value !== null) {
      dispatch(addToken(value));
      RootNavigation.navigate('Products');
    } else {
      RootNavigation.navigate('Auth', { screen: 'Signin' });
    }
  };
};

export const createStore = (auth) => {
  return async (dispatch) => {
    const { storeName, storeAddress, deliveryOptions } = auth;
    const payload = {
      name: storeName,
      address: storeAddress,
      deliveryOptions: [
        deliveryOptions,
      ],
    };
    spares.post('/stores', payload).then((res) => {
      storeData('storeId', res?.data?.data?.storeId);
      RootNavigation.navigate('Products');
      dispatch(setLoading(false));
      dispatch(reset());
    }).catch((err) => {
      dispatch(addError(`${err?.response?.data?.message}, ${err?.response?.data?.error.includes('duplicate key') ? 'it already exists' : ''}`));
      setTimeout(() => {
        dispatch(addError(''));
      }, 3000);
      dispatch(setLoading(false));
    });
  };
};

export const fetchPlaces = (input) => {
  return async (dispatch) => {
    if (input) {
      spares.post('/locations', { input }).then((res) => {
        dispatch(setLocations(res?.data?.data?.predictions));
      }).catch((err) => {});
    }
  };
};
