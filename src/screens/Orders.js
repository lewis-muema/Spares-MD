import React, { useState, useContext, useEffect } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Image, FlatList, RefreshControl,
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Text, Input, Button } from 'react-native-elements';
import { fetchOrders, setExpanded } from '../actions/Orders';
import { setOrder } from '../reducers/Track';

const OrdersScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const palettes = useSelector(state => state.palette.value);
  const orders = useSelector(state => state.orders.value);

  useEffect(() => {
    navigation.addListener('focus', async () => {
      dispatch(fetchOrders());
    });
  }, []);

  const onRefresh = () => {
    dispatch(fetchOrders());
  };

  const totalQuantity = (products) => {
    let val = 0;
    products.forEach((product) => {
      val = product.units + val;
    });
    return val;
  };

  const productNames = (products) => {
    let name = '';
    const names = [];
    products.forEach((product, i) => {
      if (i === 0) {
        // eslint-disable-next-line prefer-destructuring
        name = product.name;
        names.push(product.name);
      } else if (!names.includes(product.name)) {
        name = `${product.name}, ${name}`;
        names.push(product.name);
      }
    });
    return name;
  };

  const trackOrder = (order) => {
    dispatch(setOrder(order));
    navigation.navigate('Track');
  };

  const styles = paletteStyles(palettes.palette, palettes.fontsLoaded);
  return <View style={styles.container}>
    <Text numberOfLines={3} style={styles.title}>My orders</Text>
    <FlatList
      horizontal={false}
      numColumns={1}
      scrollEnabled={true}
      keyboardShouldPersistTaps='handled'
      showsHorizontalScrollIndicator={false}
      data={orders.orders}
      style={styles.variantGroup}
      refreshControl={
        <RefreshControl refreshing={orders.loading} onRefresh={() => onRefresh()} />
      }
      renderItem={({ item, index }) => <View style={
          item.expanded ? styles.variantOptionExpanded : styles.variantOption}>
          <TouchableOpacity onPress={
            () => dispatch(setExpanded(orders.orders, index, item.expanded))}>
            <View style={styles.variantCard}>
              <Image style={styles.productImage} source={{ uri: item.products[0].image }}/>
              <View style={styles.productText}>
                <Text numberOfLines={3} style={styles.productName}>
                  {productNames(item.products)}</Text>
              <Text numberOfLines={1} style={styles.productPrice}>
                {item.currency} {item.totalAmount}
              </Text>
              <Text numberOfLines={1} style={styles.productPrice}>
                Quantity: {totalQuantity(item.products)}
              </Text>
              <Text numberOfLines={1} style={styles.productPrice}>
                Status: {item.deliveryDetails.status}
              </Text>
              </View>
              <View style={styles.rowExpand}>
                <Entypo name="chevron-down" size={25} color={palettes.palette.text} />
              </View>
            </View>
          </TouchableOpacity>
          {
            item.expanded ? <View style={styles.expandedRows}>
              <View style={styles.expandedBG}>
                <View style={styles.expandedView}>
                  <Text numberOfLines={1} style={styles.expandedText}>
                    Order details
                  </Text>
                </View>
                <View style={styles.expandedView}>
                  <View style={styles.expandedColumn}>
                    <Text numberOfLines={1} style={styles.expandedText}>
                      Delivery fee: {item.deliveryDetails.fee} { item.currency }
                    </Text>
                  </View>
                  <View style={styles.expandedColumn}>
                    <Text numberOfLines={1} style={styles.expandedText}>
                      Delivery type: {item.deliveryDetails.deliveryType}
                    </Text>
                  </View>
                </View>
                <View style={styles.expandedView}>
                  <View style={styles.expandedColumn}>
                    <Text numberOfLines={1} style={styles.expandedText}>
                      Pay status: {item.paidStatus}
                    </Text>
                  </View>
                  <View style={styles.expandedColumn}>
                    <Text numberOfLines={1} style={styles.expandedText}>
                      Pay method: {item.paymentMethod.provider}
                    </Text>
                  </View>
                </View>
                <Button
                  title='Track Order'
                  buttonStyle={styles.trackOrderButton}
                  titleStyle={styles.trackOrderText}
                  onPress={() => trackOrder(item)}
                />
              </View>
            </View> : null
          }
        </View>
      }
    />
  </View>;
};

const paletteStyles = palette => StyleSheet.create({
  container: {
    height: '100%',
  },
  title: {
    fontWeight: '700',
    fontSize: 20,
    marginLeft: 20,
    marginVertical: 10,
  },
  variantOption: {
    flexGrow: 1,
    height: 'auto',
    margin: 10,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: palette.background,
    borderRadius: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  variantOptionExpanded: {
    flexGrow: 1,
    height: 'auto',
    margin: 10,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: palette.background,
    borderRadius: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    shadowColor: 'black',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  variantCard: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: palette.background,
    width: '99%',
    height: 'auto',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    padding: 20,
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  productText: {
    marginLeft: 15,
    flexGrow: 1,
  },
  productName: {
    textTransform: 'capitalize',
    fontWeight: '700',
    fontSize: 17,
    marginBottom: 5,
    width: 150,
  },
  productPrice: {
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 2,
  },
  rowExpand: {
    marginBottom: 'auto',
    marginTop: 10,
  },
  expandedView: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 5,
  },
  expandedColumn: {
    width: '50%',
  },
  expandedText: {
    fontSize: 15,
    fontWeight: '700',
    color: 'white',
  },
  expandedRows: {
    paddingBottom: 0,
    width: '100%',
  },
  productDetails: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  productDescription: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productDetailsName: {
    textTransform: 'capitalize',
    fontWeight: '700',
    fontSize: 17,
    marginBottom: 5,
    width: 250,
  },
  expandedBG: {
    backgroundColor: palette.text,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  trackOrderButton: {
    marginHorizontal: 20,
    marginVertical: 5,
    backgroundColor: palette.background,
  },
  trackOrderText: {
    color: palette.text,
    fontWeight: '700',
  },
});

export default OrdersScreen;
