import AsyncStorage from '@react-native-async-storage/async-storage';
import { setOrders, setLoading } from '../reducers/Orders';
import * as RootNavigation from '../RootNavigation';
import spares from '../api/spares';

const storeData = async (key, value) => {
  await AsyncStorage.setItem(key, value);
};

export const fetchOrders = () => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    spares.get('/transactions/sale').then((res) => {
      dispatch(setOrders(res?.data?.transactions));
      dispatch(setLoading(false));
    }).catch((err) => {});
  };
};

export const setExpanded = (orders, index, expanded) => {
  return async (dispatch) => {
    const expandedOrders = [];
    orders.forEach((order, i) => {
      if (i === index) {
        expandedOrders.push({
          ...order,
          expanded: expanded ? !expanded : true,
        });
      } else {
        expandedOrders.push(order);
      }
    });
    dispatch(setOrders(expandedOrders));
  };
};

export const cancelOrder = (orderId) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    spares.post(`/transactions/cancel/${orderId}`).then((res) => {
      dispatch(setLoading(false));
      RootNavigation.navigate('Orders');
    }).catch((err) => {
      dispatch(setLoading(false));
    });
  };
};
