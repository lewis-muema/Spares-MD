import {
  useState, useContext, useEffect, createRef,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList, RefreshControl,
} from 'react-native';
import {
  AntDesign, MaterialIcons, MaterialCommunityIcons, Ionicons, FontAwesome,
} from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import {
  Text, Input, Button, CheckBox, BottomSheet, ButtonGroup,
} from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, CommonActions } from '@react-navigation/native';
import {
  setSelectedDelivery, setLocationName, setLocationObject, setShowLocations,
  setSelectedPaymentMethod, setAddedPaymentMethodNumber, setPaymentMethodNumberErr,
  setAddedPaymentMethod, setUserPaymentMethods, setLastLocation, setPaymentTypeOption,
} from '../reducers/Checkout';
import {
  fetchPlaces, fetchPaymentMethods, regexCheck, fetchCoordinates,
  sendPaymentMethods, fetchPrices, fetchUserPaymentMethods, createOrder,
} from '../actions/Checkout';
import { cartProductDetails } from '../actions/Cart';
import Banner from '../components/banner';
import Spacer from '../components/Spacer';

const locationRef = createRef();
const paymentNumberRef = createRef();

const CheckoutScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [counter, setCounter] = useState(0);
  const [isFocus, setIsFocus] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const palettes = useSelector(state => state.palette.value);
  const checkout = useSelector(state => state.checkout.value);
  const cart = useSelector(state => state.cart.value);
  const products = useSelector(state => state.product.value);
  const styles = paletteStyles(palettes.palette, palettes.fontsLoaded);

  useEffect(() => {
    navigation.addListener('focus', async () => {
      const methods = await AsyncStorage.getItem('paymentMethods');
      dispatch(setUserPaymentMethods(JSON.parse(methods)));
      dispatch(fetchPaymentMethods());
      dispatch(fetchUserPaymentMethods());
      fetchPricing(checkout.locationObject);
    });
  }, []);

  const onRefresh = () => {
    dispatch(fetchPaymentMethods());
    fetchPricing(checkout.locationObject);
  };

  const totalProductPrice = () => {
    let price = 0;
    cartProductDetails(cart, products).forEach((product) => {
      price += product.price;
    });
    return price;
  };

  const productPayload = () => {
    const productOutput = [];
    cartProductDetails(cart, products).forEach((product) => {
      productOutput.push({
        id: product.productId,
        name: product.name,
        variantId: product._id,
        serialNo: product.serialNo,
        price: product.price,
        currency: product.currency,
        units: product.cart,
        image: product.photoId,
        color: product.color,
        description: product.description,
        material: product.material,
        size: product.size,
        weight: product.weight,
      });
    });
    return productOutput;
  };

  const fetchPricing = (location) => {
    const payload = {
      location,
      vehicle: 'Bike',
      priority: false,
      productPrice: totalProductPrice(),
    };
    dispatch(fetchPrices(payload));
  };

  const validateString = () => {
    return TextValidator(
      checkout.addedPaymentMethodNumber,
      error => dispatch(setPaymentMethodNumberErr(error)),
      'a valid payment number',
      paymentNumberRef,
      false,
      checkout.addedPaymentMethod,
    );
  };

  const savePaymentMethod = () => {
    if (!validateString()) {
      const payload = {
        id: checkout.addedPaymentMethodNumber,
        provider: checkout.addedPaymentMethod.provider,
        paytype: checkout.addedPaymentMethod.paytype,
      };
      const methods = {
        paymentMethod: [
          ...checkout.userPaymentMethods,
          payload,
        ],
      };
      dispatch(sendPaymentMethods(methods, val => setIsVisible(val)));
    }
  };

  const paymentMethods = () => {
    const methods = [];
    checkout.userPaymentMethods.forEach((method) => {
      if ((method.paytype === 'postpay' && checkout.paymentTypeOption === 1)) {
        methods.push(method);
      }
      if ((method.paytype === 'prepay' && checkout.paymentTypeOption === 0)) {
        methods.push(method);
      }
    });
    return methods;
  };

  const allPaymentMethods = () => {
    const methods = [];
    checkout.allPaymentMethods.forEach((method) => {
      if (method.shown && method.active) {
        methods.push(method);
      }
    });
    return methods;
  };

  const TextValidator = (val, err, field, ref, optional, method) => {
    if ((!regexCheck(method?.provider, val) && !optional)
      || (optional && val && !regexCheck(method?.provider, val))) {
      ref.current.shake();
      err(`Please add ${field}`);
      return true;
    }
    err('');
    return false;
  };

  const getPaymentName = (obj) => {
    if (obj.provider) {
      return obj.provider;
    }
    return 'Payment';
  };

  const confirmOrder = async () => {
    const userId = await AsyncStorage.getItem('userId');
    const payload = {
      type: 'SALE',
      products: productPayload(),
      userId,
      paymentMethod: paymentMethods()[checkout.selectedPaymentMethod],
      totalAmount: checkout?.pricing?.productTotal,
      paidStatus: checkout.paymentTypeOption === 1 ? 'UNPAID' : 'PAID',
      currency: checkout?.pricing?.currency,
      date: Date.now(),
      deliveryDetails: {
        // eslint-disable-next-line no-nested-ternary
        deliveryType: checkout.selectedDelivery === 0 ? checkout?.pricing?.deliveryFee === 0 ? 'PICKUP' : 'DELIVERY' : 'PICKUP',
        fee: checkout?.pricing?.deliveryFee,
        status: 'PENDING',
        address: checkout.locationCoordinates?.location ? {
          name: checkout.locationName,
          coordinatesX: checkout.locationCoordinates?.location?.lat,
          coordinatesY: checkout.locationCoordinates?.location?.lng,
        } : null,

      },
    };
    dispatch(createOrder(payload, () => clearNavigation()));
  };

  const clearNavigation = () => {
    navigation.navigate('Order');
  };

  const changeDeliveryOption = (option) => {
    dispatch(setSelectedDelivery(option));
    fetchPricing(checkout.locationObject);
  };

  const setLocation = (item) => {
    dispatch(fetchCoordinates(item.place_id));
    dispatch(setLocationObject(item));
    dispatch(setShowLocations(false));
    dispatch(setLocationName(item.description));
    dispatch(setLastLocation(item.description));
    dispatch(setSelectedDelivery(0));
    fetchPricing(item);
    locationRef.current.blur();
  };

  useEffect(() => {
    setTimeout(() => {
      setCounter(counter + 1);
    }, 1000);
  }, [checkout.locationName]);

  useEffect(() => {
    if (checkout.lastLocation !== checkout.locationName) {
      dispatch(fetchPlaces(checkout.locationName));
      dispatch(setLastLocation(checkout.locationName));
      dispatch(setShowLocations(true));
    }
  }, [counter]);

  return <View style={styles.container}>
    <View style={styles.scrollContainer}>
    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'
      refreshControl={
        <RefreshControl refreshing={checkout.loading} onRefresh={() => onRefresh()} />
      }>
      <View style={styles.productSection}>
        <Text style={styles.title}>Delivery type</Text>
        <View style={styles.rows}>
          <CheckBox
            checked={checkout.selectedDelivery === 0}
            onPress={() => changeDeliveryOption(0)}
            checkedIcon={
              <FontAwesome name="dot-circle-o" size={24} color={palettes.palette.text} />
            }
            uncheckedIcon={
              <FontAwesome name="circle-o" size={24} color="grey" />
            }
          />
          <TouchableOpacity onPress={() => changeDeliveryOption(0)}>
            <View style={{ marginTop: 17 }}>
              <Text style={styles.fields}>Deliver to my address</Text>
              <Text style={styles.fields}>Enter location</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.amounts}>
          { checkout?.pricing?.currency } { checkout?.pricing?.deliveryFee }
          </Text>
        </View>
        <Input
          ref={locationRef}
          value={checkout.locationName}
          onChangeText={val => dispatch(setLocationName(val))}
          errorMessage={checkout.locationErr}
          labelStyle={styles.label}
          inputStyle={styles.locationInputText}
          placeholderTextColor={palettes.palette.text}
          inputContainerStyle={styles.locationInput}
          autoCapitalize='none'
          autoCorrect={false}
          leftIcon={
            <FontAwesome name="location-arrow" size={18} color={palettes.palette.text} />
          } />
          {
            checkout.showLocations
              ? <View style={styles.locationsList}>
                  <FlatList
                    horizontal={false}
                    keyboardShouldPersistTaps='handled'
                    showsVerticalScrollIndicator={false}
                    data={checkout.locationSuggestions}
                    style={styles.locationRows}
                    scrollEnabled={false}
                    renderItem={({ item }) => <TouchableOpacity
                    style={styles.locationOption} onPress={() => setLocation(item)}>
                        <Text style={styles.textBody}>{ item.description }</Text>
                      </TouchableOpacity>
                    }
                  />
              </View>
              : null
        }
        <View style={styles.rows}>
          <CheckBox
            checked={checkout.selectedDelivery === 1}
            onPress={() => changeDeliveryOption(1)}
            checkedIcon={
              <FontAwesome name="dot-circle-o" size={24} color={palettes.palette.text} />
            }
            uncheckedIcon={
              <FontAwesome name="circle-o" size={24} color="grey" />
            }
          />
          <TouchableOpacity style={styles.rows} onPress={() => changeDeliveryOption(1)}>
            <Text style={styles.fields}>Pick up from store</Text>
            <Text style={styles.amounts}>Free</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.divider}></View>
        <View style={styles.rows}>
          <Text style={styles.fields}>Delivery fee to pay:</Text>
          <Text style={styles.amounts}>
            { checkout?.pricing?.currency } { checkout?.pricing?.deliveryFee }
          </Text>
        </View>
      </View>
      <View style={styles.productSection}>
      <Text style={styles.title}>Totals</Text>
        <View style={styles.rows}>
          <Text style={styles.fields}>Product cost:</Text>
          <Text style={styles.amounts}>{ checkout?.pricing?.productPrice }</Text>
        </View>
        <View style={styles.rows}>
          <Text style={styles.fields}>VAT ({checkout?.pricing?.VATRate}):</Text>
          <Text style={styles.amounts}>+ { checkout?.pricing?.VAT }</Text>
        </View>
        <View style={styles.rows}>
          <Text style={styles.fields}>Service fee ({checkout?.pricing?.serviceFeeRate}):</Text>
          <Text style={styles.amounts}>+ { checkout?.pricing?.serviceFee }</Text>
        </View>
        <View style={styles.rows}>
          <Text style={styles.fields}>Delivery fee:</Text>
          <Text style={styles.amounts}>+ { checkout?.pricing?.deliveryFee }</Text>
        </View>
        <View style={styles.divider}></View>
        <View style={styles.rows}>
          <Text style={styles.fields}>Amount to pay:</Text>
          <Text style={styles.amounts}>
          { checkout?.pricing?.currency } { checkout?.pricing?.productTotal }
          </Text>
        </View>
      </View>
      <View style={styles.productSection}>
        <Text style={styles.title}>Payment methods</Text>
        <ButtonGroup
          buttons={checkout.paymentTypes}
          selectedIndex={checkout.paymentTypeOption}
          onPress={(value) => {
            dispatch(setPaymentTypeOption(value));
          }}
          buttonStyle={{
            margin: 5,
            borderRadius: 5,
            borderWidth: 2,
            borderColor: palettes.palette.text,
          }}
          textStyle={{
            fontWeight: '700',
            fontSize: 16,
          }}
          selectedButtonStyle={{ backgroundColor: palettes.palette.text }}
          innerBorderStyle={{ width: 0 }}
          containerStyle={{
            borderWidth: 0,
            backgroundColor: palettes.palette.background,
            height: 50,
            marginBottom: 0,
          }}
        />
        <FlatList
          horizontal={false}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
          data={paymentMethods()}
          style={styles.locationRows}
          scrollEnabled={false}
          renderItem={({ item, index }) => <TouchableOpacity
          style={styles.paymentOption} onPress={() => dispatch(setSelectedPaymentMethod(index))}>
              <View style={styles.rows}>
                <CheckBox
                  checked={checkout.selectedPaymentMethod === index}
                  onPress={() => dispatch(setSelectedPaymentMethod(index))}
                  checkedIcon={
                    <FontAwesome name="dot-circle-o" size={24} color={palettes.palette.text} />
                  }
                  uncheckedIcon={
                    <FontAwesome name="circle-o" size={24} color="grey" />
                  }
                />
                <View>
                  <Text style={styles.fields}>{item.provider}</Text>
                  <Text style={styles.subfields} numberOfLines={1}>{item.id}</Text>
                </View>
              </View>
            </TouchableOpacity>
          }
        />
        <Button
          title='Add payment method'
          buttonStyle={styles.addPaymentMethod}
          titleStyle={styles.addPaymentText}
          onPress={() => setIsVisible(true)}
        />
      </View>
    </ScrollView>
    </View>
    { checkout.errorMessage
      ? <Spacer><Banner message={checkout.errorMessage} type='error'></Banner></Spacer> : null
    }
    { checkout.successMessage
      ? <Spacer><Banner message={checkout.successMessage} type='success'></Banner></Spacer> : null
    }
    <View style={styles.buttonContainer}>
      <Button
        title='Confirm Order'
        buttonStyle={styles.confirmButton}
        titleStyle={styles.confirmText}
        loading={checkout.loading}
        disabled={checkout.loading}
        onPress={() => confirmOrder()}
      />
    </View>
    <BottomSheet
      modalProps={{}}
      isVisible={isVisible}
      onBackdropPress={() => setIsVisible(false)}
    >
      <View style={styles.BottomSheet}>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.closeIcon} onPress={() => setIsVisible(false)}>
          <AntDesign name="closecircle" size={18} color={palettes.palette.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
        <Dropdown
            style={styles.selectDropdown}
            placeholderStyle={{ fontWeight: '500' }}
            selectedTextStyle={{ fontWeight: '500' }}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={allPaymentMethods()}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? 'Select payment method' : '...'}
            searchPlaceholder="Search payment method"
            value={checkout.addedPaymentMethod}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              dispatch(setAddedPaymentMethod(item));
              setIsFocus(false);
            }}
            renderLeftIcon={() => (
              <MaterialCommunityIcons color={palettes.palette.text} style={{ marginRight: 10 }} name="cash" size={18} />
            )}
          />
        </View>
        <View style={styles.inputContainer}>
          <Input
            ref={paymentNumberRef}
            label={`${getPaymentName(checkout.addedPaymentMethod)} number`}
            value={checkout.addedPaymentMethodNumber}
            onChangeText={val => dispatch(setAddedPaymentMethodNumber(val))}
            onBlur={() => validateString()}
            errorMessage={checkout.paymentMethodNumberErr}
            labelStyle={styles.label}
            inputStyle={styles.inputTextSytle}
            placeholderTextColor={palettes.palette.text}
            inputContainerStyle={{ borderColor: palettes.palette.text }}
            autoCapitalize='none'
            autoCorrect={false}
            leftIcon={
              <MaterialIcons name="numbers" size={18} color={palettes.palette.text} />
            } />
        </View>
        <View style={styles.inputContainer}>
          <Button
            title='Save Payment Method'
            buttonStyle={styles.saveButton}
            titleStyle={styles.saveButtonText}
            loading={checkout.paymentLoading}
            disabled={checkout.paymentLoading}
            onPress={() => savePaymentMethod()}
          />
        </View>
      </View>
    </BottomSheet>
  </View>;
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
  confirmText: {
    fontSize: 20,
  },
  productSection: {
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
  confirmButton: {
    backgroundColor: palette.text,
    paddingHorizontal: 15,
    marginTop: 10,
    justifyContent: 'center',
    marginBottom: 10,
  },
  rows: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  amounts: {
    marginLeft: 'auto',
    fontSize: 19,
    fontWeight: '700',
  },
  title: {
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 5,
  },
  fields: {
    fontSize: 15,
    fontWeight: '700',
  },
  subfields: {
    fontSize: 12,
    fontWeight: '700',
    position: 'absolute',
    top: 20,
    width: 200,
  },
  divider: {
    borderWidth: 1,
    borderColor: palette.text,
    marginVertical: 10,
  },
  locationInput: {
    marginLeft: 50,
    borderColor: palette.text,
  },
  locationsList: {
    position: 'absolute',
    top: 170,
    paddingHorizontal: 10,
    zIndex: 1000,
    backgroundColor: 'white',
    alignSelf: 'center',
    width: '100%',
  },
  locationOption: {
    margin: 10,
  },
  paymentOption: {
    marginTop: 0,
  },
  locationRows: {
    fontSize: 15,
  },
  addPaymentMethod: {
    backgroundColor: palette.background,
    borderColor: palette.text,
    borderWidth: 2,
    paddingHorizontal: 15,
    marginTop: 10,
    justifyContent: 'center',
    marginBottom: 10,
    width: 200,
    alignSelf: 'center',
  },
  addPaymentText: {
    fontSize: 15,
    color: palette.text,
  },
  BottomSheet: {
    backgroundColor: palette.background,
    paddingTop: 20,
    paddingBottom: 10,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    paddingHorizontal: 10,
  },
  closeIcon: {
    alignSelf: 'flex-end',
  },
  inputContainer: {
    marginHorizontal: 10,
  },
  selectDropdown: {
    marginHorizontal: 10,
    marginBottom: 20,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    paddingBottom: 10,
    paddingTop: 10,
  },
  saveButton: {
    backgroundColor: palette.text,
    borderRadius: 10,
    width: '100%',
    fontSize: 14,
    marginBottom: 20,
    marginTop: 10,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CheckoutScreen;
