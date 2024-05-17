import React, { useState, useContext, useEffect } from 'react';
import {
  View, StyleSheet, TouchableOpacity, RefreshControl,
  Image, KeyboardAvoidingView, FlatList, ActivityIndicator,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  Text, Input, Button, SearchBar,
} from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import { validateAuth } from '../actions/Auth';
import { fetchProducts, searchProduct } from '../actions/Product';
import { showTotalCount } from '../actions/Cart';

import {
  setSearchLoading,
  setProductDetails,
} from '../reducers/Product';

const ProductsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [counter, setCounter] = useState(0);
  const product = useSelector(state => state.product.value);
  const palettes = useSelector(state => state.palette.value);
  const cart = useSelector(state => state.cart.value);

  const viewProduct = (prodct) => {
    dispatch(setProductDetails(prodct));
    navigation.navigate('ViewProduct');
  };

  const onRefresh = () => {
    dispatch(fetchProducts());
  };

  useEffect(() => {
    dispatch(validateAuth());
    navigation.addListener('focus', () => {
      dispatch(fetchProducts());
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setCounter(counter + 1);
    }, 1000);
  }, [search]);

  useEffect(() => {
    if (search) {
      dispatch(searchProduct(search, true));
    } else {
      dispatch(setSearchLoading(false));
      dispatch(fetchProducts());
    }
  }, [counter]);

  const styles = paletteStyles(palettes.palette, palettes.fontsLoaded);
  return <View style={styles.container}>
    <TouchableOpacity style={styles.addButtonOuter} onPress={() => navigation.navigate('AddProduct')}>
      <View style={styles.addButton}>
        <Text style={styles.addButtonText}>+</Text>
      </View>
    </TouchableOpacity>
    <View style={styles.topBar}>
      <SearchBar
        placeholder="Search product"
        onChangeText={setSearch}
        value={search}
        containerStyle={styles.searchBarStyle}
        inputContainerStyle={{ backgroundColor: palettes.palette.background }}
        showLoading={product.searchLoading}
        />
        <View style={styles.cartIcon}>
          <Text style={styles.cartCount}>{showTotalCount(cart)}</Text>
          <AntDesign name="shoppingcart" size={25} color={palettes.palette.text} />
        </View>
    </View>
    <FlatList
      horizontal={false}
      numColumns={2}
      scrollEnabled={true}
      keyboardShouldPersistTaps='handled'
      showsHorizontalScrollIndicator={false}
      data={product.products}
      style={styles.variantGroup}
      refreshControl={
        <RefreshControl refreshing={product.loading} onRefresh={() => onRefresh()} />
      }
      renderItem={({ item, index }) => <View style={styles.variantOption}>
          <TouchableOpacity onPress={() => viewProduct(item)}>
            <View style={styles.variantCard}>
              <Image style={styles.productImage} source={{ uri: item.image }}/>
              <View style={styles.productText}>
                <Text numberOfLines={1} style={styles.productName}>{item.name}</Text>
                { item.description
                  ? <Text numberOfLines={1}
                      style={styles.productDescription}>
                    {item.description}
                    </Text>
                  : null }
              <Text numberOfLines={1} style={styles.productPrice}>
                {item.currency} {item.price}
              </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      }
    />
    {
      product.products.length === 0 && !product.loading ? <View style={styles.noProducts}>
        <Image style={styles.loaderImg} source={require('../../assets/spares.png')}/>
        <Text style={styles.noProductsText}>No products found</Text>
      </View> : null
    }
  </View>;
};

const paletteStyles = palette => StyleSheet.create({
  container: {
    height: '100%',
  },
  loader: {
    marginVertical: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartIcon: {
    marginHorizontal: 20,
  },
  cartCount: {
    backgroundColor: palette.text,
    color: palette.background,
    borderRadius: 10,
    height: 20,
    width: 20,
    fontSize: 12,
    textAlign: 'center',
    paddingTop: 2,
    marginLeft: 'auto',
    marginBottom: -3,
  },
  variantOption: {
    flexGrow: 1,
    height: 250,
    margin: 10,
    width: '40%',
    backgroundColor: palette.background,
    borderRadius: 10,
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
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  loaderImg: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  noProducts: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noProductsText: {
    fontSize: 15,
    fontWeight: '700',
  },
  productText: {
    width: '100%',
    alignSelf: 'center',
    color: palette.text,
  },
  productName: {
    fontSize: 17,
    fontWeight: '700',
    textTransform: 'capitalize',
    textAlign: 'center',
    marginVertical: 10,
  },
  productDescription: {
    fontSize: 15,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 19,
    fontWeight: '700',
    textTransform: 'capitalize',
    textAlign: 'center',
    marginVertical: 10,
  },
  cartButtonText: {
    fontSize: 15,
  },
  cartButton: {
    backgroundColor: palette.text,
    paddingHorizontal: 15,
  },
  addButton: {
    height: 70,
    width: 70,
    borderRadius: 50,
    backgroundColor: palette.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: palette.background,
    fontSize: 35,
    fontWeight: '900',
  },
  addButtonOuter: {
    position: 'absolute',
    zIndex: 1000,
    bottom: 30,
    right: 20,
  },
  searchBarStyle: {
    backgroundColor: 'white',
    borderColor: palette.background,
    marginHorizontal: 10,
    flexGrow: 1,
  },
});

export default ProductsScreen;
