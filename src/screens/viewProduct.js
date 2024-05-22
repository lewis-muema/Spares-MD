import React, { useState, useContext, useEffect } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, FlatList,
  ScrollView,
} from 'react-native';
import {
  AntDesign, MaterialIcons, Ionicons, MaterialCommunityIcons, FontAwesome5,
} from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Text, Input, Button } from 'react-native-elements';
import Rating from '../components/rating';
import { addItemToCart, showCount, showTotalCount } from '../actions/Cart';

const ViewProductScreen = () => {
  const navigation = useNavigation();
  const product = useSelector(state => state.product.value);
  const cart = useSelector(state => state.cart.value);
  const palettes = useSelector(state => state.palette.value);
  const styles = paletteStyles(palettes.palette, palettes.fontsLoaded);
  const dispatch = useDispatch();

  const pushToCart = (item) => {
    dispatch(addItemToCart(product?.productDetails._id, item, cart, 1));
  };

  const removeFromCart = (item) => {
    dispatch(addItemToCart(product?.productDetails._id, item, cart, -1));
  };

  return <View style={styles.container}>
    <View style={styles.scrollContainer}>
    <ScrollView showsVerticalScrollIndicator={false}>
    {
      product?.productDetails?._id
        ? <View>
          <Image style={styles.productImage} source={{ uri: product?.productDetails?.image }}/>
          <View style={styles.productDetails}>
            <View style={styles.topRow}>
              <Text style={styles.productName}>
                {product?.productDetails?.name}
              </Text>
              <View style={styles.priceDetails}>
                <Text style={styles.productCurrency}>
                  {product?.productDetails?.currency}
                </Text>
                <Text style={styles.productPrice}>
                  {product?.productDetails?.price}
                </Text>
              </View>
            </View>
            <View style={styles.topRow}>
              <Text style={styles.brandText}>
                Brand: {product?.productDetails?.variants[0].brand}
              </Text>
              <Text style={styles.unitsText}>
                Units available: {product?.productDetails?.variants[0].units}
              </Text>
            </View>
            <View style={styles.titleRow}>
              <MaterialIcons name="description" size={18} color={palettes.palette.text} />
              <Text style={styles.title}>Description</Text>
            </View>
            <Text style={styles.description}>{product?.productDetails?.description}</Text>
            <View style={styles.titleRow}>
              <MaterialIcons name="fit-screen" size={18} color={palettes.palette.text} />
              <Text style={styles.title}>Compatibility</Text>
            </View>
            <View style={styles.topRow}>
              <Text style={styles.descriptionLeft}>
                Car: {product?.productDetails?.manufacturer?.name}
              </Text>
              <Text style={styles.descriptionMid}>
                Model: {product?.productDetails?.model?.name}
              </Text>
              <Text style={styles.descriptionRight}>
                Year: {product?.productDetails?.model?.year}
              </Text>
            </View>
            <View style={styles.titleRow}>
              <FontAwesome5 name="store" size={18} color={palettes.palette.text} />
              <Text style={styles.title}>Seller</Text>
            </View>
            <Text style={styles.description}>
              {product?.productDetails?.store?.name}
            </Text>
            <View style={styles.titleRow}>
              <MaterialIcons name="star-rate" size={18} color={palettes.palette.text} />
              <Text style={styles.title}>Rating</Text>
            </View>
            <Rating rating={product?.productDetails?.rating} />
            <View style={styles.titleRow}>
              <MaterialCommunityIcons name="cards-variant" size={18} color={palettes.palette.text} />
              <Text style={styles.title}>Variants</Text>
            </View>
            <FlatList
              horizontal={true}
              keyboardShouldPersistTaps='handled'
              showsHorizontalScrollIndicator={false}
              data={product?.productDetails?.variants}
              style={styles.variantGroup}
              renderItem={({ item }) => <View style={styles.variantOption}>
                  <View style={styles.variantCard}>
                    <Image style={styles.variantImage}
                    source={{ uri: product?.productDetails?.image }}/>
                    <View style={styles.variantText}>
                      <MaterialIcons name="text-fields" size={18} color={palettes.palette.text} />
                      <Text numberOfLines={1} style={styles.textBody}>{ item?.brand }</Text>
                    </View>
                    <View style={styles.variantText}>
                      <MaterialIcons name="numbers" size={18} color={palettes.palette.text} />
                      <Text numberOfLines={1} style={styles.textBody}>
                        { item?.units } Units
                      </Text>
                    </View>
                      { item?.color
                        ? <View style={styles.variantText}>
                        <Ionicons name="color-palette-outline" size={18} color={palettes.palette.text} />
                        <Text numberOfLines={1} style={styles.textBody}>
                          { item?.color }
                        </Text></View>
                        : null }
                      { item?.color
                        ? <View style={styles.variantText}>
                        <MaterialCommunityIcons name="resize" size={18} color={palettes.palette.text} />
                        <Text numberOfLines={1} style={styles.textBody}>
                          { item?.size }
                        </Text></View>
                        : null }
                      { item?.color
                        ? <View style={styles.variantText}>
                        <MaterialCommunityIcons name="gold" size={18} color={palettes.palette.text} />
                        <Text numberOfLines={1} style={styles.textBody}>
                          { item?.material }
                        </Text></View>
                        : null }
                      { item?.color
                        ? <View style={styles.variantText}>
                        <MaterialCommunityIcons name="weight-kilogram" size={18} color={palettes.palette.text} />
                        <Text numberOfLines={1} style={styles.textBody}>
                          { item?.weight }
                        </Text></View>
                        : null }
                      {
                        showCount(product?.productDetails._id, item, cart) > 0
                          ? <View style={styles.cartCounter}>
                            <Button
                              buttonStyle={styles.cartCaretCounter}
                              titleStyle={styles.cartButtonText}
                              onPress={() => removeFromCart(item) }
                              icon={
                                <AntDesign name="caretleft" size={18} color={palettes.palette.background} />
                              }
                            ></Button>
                            <Text style={styles.cartCount}>
                              { showCount(product?.productDetails._id, item, cart) }
                            </Text>
                            <Button
                              buttonStyle={styles.cartCaretCounter}
                              titleStyle={styles.cartButtonText}
                              onPress={() => pushToCart(item) }
                              disabled={
                                showCount(product?.productDetails._id, item, cart) >= item.units}
                              icon={
                                <AntDesign name="caretright" size={18} color={palettes.palette.background} />
                              }
                            ></Button>
                          </View>
                          : <Button
                            title='Add to cart'
                            buttonStyle={styles.cartButton}
                            titleStyle={styles.cartButtonText}
                            onPress={() => pushToCart(item) }
                            icon={
                              <AntDesign name="shoppingcart" size={18} color={palettes.palette.background} style={{ marginRight: 5 }} />
                            }
                          />
                      }


                  </View>
                </View>
              }
            />
          </View>
        </View>
        : null
    }
  </ScrollView>
  </View>
  <View style={styles.buttonContainer}>
    <Button
      title={`Proceed to cart (${showTotalCount(cart)} items)`}
      buttonStyle={styles.proceedToCartButton}
      titleStyle={styles.proceedToCartText}
      onPress={() => navigation.navigate('Cart')}
    />
  </View></View>;
};

const paletteStyles = palette => StyleSheet.create({
  container: {
    height: '100%',
  },
  scrollContainer: {
    flexShrink: 1,
  },
  buttonContainer: {
    padding: 10,
  },
  productImage: {
    width: '100%',
    height: 400,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  variantImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  productDetails: {
    marginHorizontal: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  cartCounter: {
    flexDirection: 'row',
    width: 150,
    alignItems: 'center',
  },
  cartCount: {
    flexGrow: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 5,
  },
  cartCaretCounter: {
    backgroundColor: palette.text,
    paddingHorizontal: 15,
    marginTop: 10,
    justifyContent: 'center',
  },
  proceedToCartText: {
    fontSize: 20,
  },
  proceedToCartButton: {
    backgroundColor: palette.text,
    paddingHorizontal: 15,
    marginTop: 10,
    justifyContent: 'center',
    marginBottom: 10,
  },
  brandText: {
    fontSize: 14,
    color: palette.text,
    fontWeight: '700',
  },
  unitsText: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 'auto',
  },
  openText: {
    color: 'green',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 'auto',
  },
  productName: {
    fontSize: 25,
    color: palette.text,
    fontWeight: '700',
    textTransform: 'capitalize',
    width: '50%',
  },
  priceDetails: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  productCurrency: {
    fontSize: 17,
    color: palette.text,
    fontWeight: '700',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 30,
    color: palette.text,
    fontWeight: '700',
    marginLeft: 5,
  },
  title: {
    fontSize: 20,
    color: palette.text,
    fontWeight: '700',
    marginLeft: 10,
  },
  titleRow: {
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  description: {
    fontSize: 14,
    color: palette.text,
    fontWeight: '700',
    marginTop: 5,
  },
  descriptionLeft: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 5,
    marginRight: 'auto',
  },
  descriptionMid: {
    fontSize: 14,
    color: palette.text,
    fontWeight: '700',
    marginTop: 5,
    marginHorizontal: 'auto',
  },
  descriptionRight: {
    fontSize: 14,
    color: palette.text,
    fontWeight: '700',
    marginTop: 5,
    marginLeft: 'auto',
  },
  variantGroup: {
    height: 'auto',
    marginLeft: -20,
    marginRight: -20,
  },
  variantOption: {
    borderRadius: 10,
    marginBottom: 20,
    height: 320,
    margin: 10,
    width: 200,
    backgroundColor: palette.background,
    alignItems: 'center',
    justifyContent: 'center',
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
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  textBody: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 'auto',
    width: 115,
  },
  variantText: {
    flexDirection: 'row',
    width: 150,
  },
  cartButtonText: {
    fontSize: 15,
    marginRight: 10,
  },
  cartButton: {
    backgroundColor: palette.text,
    paddingHorizontal: 15,
    marginTop: 10,
    width: '100%',
    justifyContent: 'center',
  },
});

export default ViewProductScreen;
