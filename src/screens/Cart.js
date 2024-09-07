import React, { useState, useContext, useEffect } from 'react';
import {
  View, StyleSheet, SafeAreaView, Image, FlatList,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Text, Input, Button } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';
import { showTotalCount, cartProductDetails, addItemToCart } from '../actions/Cart';

const CartScreen = () => {
  const navigation = useNavigation();
  const cart = useSelector(state => state.cart.value);
  const products = useSelector(state => state.product.value);
  const palettes = useSelector(state => state.palette.value);
  const styles = paletteStyles(palettes.palette, palettes.fontsLoaded);
  const dispatch = useDispatch();

  const pushToCart = (item) => {
    dispatch(addItemToCart(item.productId, item, cart, 1));
  };

  const removeFromCart = (item) => {
    dispatch(addItemToCart(item.productId, item, cart, -1));
  };

  return <View style={styles.container}>
    {
      showTotalCount(cart) === 0
        ? <View style={styles.noCart}>
          <AntDesign name="shoppingcart" size={55} color={palettes.palette.text} />
          <Text style={styles.noCartText}>You have no items in your cart</Text>
        </View>
        : <View style={styles.cartListContainer}>
            <FlatList
              horizontal={false}
              numColumns={1}
              scrollEnabled={true}
              showsHorizontalScrollIndicator={false}
              data={cartProductDetails(cart, products)}
              style={styles.variantGroup}
              renderItem={({ item }) => <View style={styles.productGroup}>
                  <View style={styles.cartItem}>
                    <Image style={styles.productImage} source={
                      { uri: item.image }
                    }/>
                    <View style={styles.cartItemDetails}>
                      <Text numberOfLines={1} style={styles.cartItemText}>{item.name}</Text>
                      <Text numberOfLines={1} style={styles.cartItemTextBottom}>
                        Price: {item.currency} {item.price}</Text>
                      <Text numberOfLines={1} style={styles.cartItemTextBottom}>Quantity</Text>
                        <View style={styles.cartCounter}>
                          <Button
                            buttonStyle={styles.cartCaretCounter}
                            titleStyle={styles.cartButtonText}
                            onPress={() => removeFromCart(item) }
                            icon={
                              <AntDesign name="caretleft" size={12} color={palettes.palette.background} />
                            }
                          ></Button>
                          <Text style={styles.cartCount}>
                            {item.cart}
                          </Text>
                          <Button
                            buttonStyle={styles.cartCaretCounter}
                            titleStyle={styles.cartButtonText}
                            onPress={() => pushToCart(item) }
                            disabled={
                              item.cart >= item.units}
                            icon={
                              <AntDesign name="caretright" size={12} color={palettes.palette.background} />
                            }
                          ></Button>
                        </View>
                      <View style={styles.badges}>
                        <Text numberOfLines={1} style={styles.variantTraits}>{item.brand}</Text>
                        { item.color
                          ? <Text numberOfLines={1} style={styles.variantTraits}>
                            {item.color}
                          </Text> : null }
                        { item.material
                          ? <Text numberOfLines={1} style={styles.variantTraits}>
                            {item.material}</Text> : null }
                        { item.size
                          ? <Text numberOfLines={1} style={styles.variantTraits}>
                            {item.size}</Text> : null }
                        { item.weight
                          ? <Text numberOfLines={1} style={styles.variantTraits}>
                            {item.weight}</Text> : null }
                      </View>
                    </View>
                  </View>
                </View>
              }
            />
          <View style={{ flexGrow: 1 }}></View>
          <View style={styles.cartButtonContainer}>
            <Button
              title='Proceed to checkout'
              buttonStyle={styles.cartButton}
              titleStyle={styles.cartButtonText}
              onPress={() => navigation.navigate('Checkout')}
              icon={
                <AntDesign name="shoppingcart" size={18} color={palettes.palette.background} style={{ marginRight: 5 }} />
              }
            />
          </View>
        </View>
    }
  </View>;
};

const paletteStyles = palette => StyleSheet.create({
  container: {
    height: '100%',
  },
  noCart: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '90%',
  },
  noCartText: {
    fontSize: 15,
    color: palette.text,
    fontWeight: '700',
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  productGroup: {
    borderRadius: 10,
    marginBottom: 20,
    margin: 10,
    padding: 20,
    backgroundColor: palette.background,
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  cartItem: {
    flexDirection: 'row',
  },
  cartItemDetails: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 10,
  },
  cartItemText: {
    width: 200,
    fontSize: 15,
    fontWeight: '700',
    color: palette.text,
    textTransform: 'capitalize',
    marginBottom: 5,
    marginLeft: 5,
  },
  cartItemTextBottom: {
    fontSize: 13,
    color: palette.text,
    fontWeight: '700',
    marginLeft: 5,
  },
  variantTraits: {
    color: palette.background,
    backgroundColor: palette.text,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
    margin: 2,
    flex: 0,
  },
  badges: {
    flexDirection: 'row',
    width: 200,
    flexWrap: 'wrap',
    marginTop: 5,
  },
  cartCounter: {
    flexDirection: 'row',
    width: 100,
    alignItems: 'center',
    marginTop: -5,
    marginBottom: 5,
    marginLeft: 5,
  },
  cartCount: {
    flexGrow: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 7,
  },
  cartCaretCounter: {
    backgroundColor: palette.text,
    paddingHorizontal: 10,
    marginTop: 10,
    justifyContent: 'center',
  },
  cartButton: {
    backgroundColor: palette.text,
    paddingHorizontal: 15,
    marginTop: 10,
    width: '100%',
    justifyContent: 'center',
  },
  cartListContainer: {
    height: '100%',
  },
  cartList: {
    flexShrink: 1,
  },
  cartButtonContainer: {
    margin: 10,
  },
});

export default CartScreen;
