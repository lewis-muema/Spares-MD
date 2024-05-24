import {
  useState, useContext, useEffect, createRef,
} from 'react';
import {
  View, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import {
  Text, Input, Button, CheckBox,
} from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import { Dropdown } from 'react-native-element-dropdown';
import {
  setSelectedDelivery, setLocationName, setLocationObject, setShowLocations,
} from '../reducers/Checkout';
import { fetchPlaces } from '../actions/Checkout';

const locationRef = createRef();

const CheckoutScreen = () => {
  const dispatch = useDispatch();
  const [counter, setCounter] = useState(0);
  const [lastLocation, setLastLocation] = useState('');
  const palettes = useSelector(state => state.palette.value);
  const checkout = useSelector(state => state.checkout.value);
  const styles = paletteStyles(palettes.palette, palettes.fontsLoaded);

  const setLocation = (item) => {
    dispatch(setLocationObject(item));
    dispatch(setShowLocations(false));
    dispatch(setLocationName(item.description));
    setLastLocation(item.description);
    locationRef.current.blur();
  };

  useEffect(() => {
    setTimeout(() => {
      setCounter(counter + 1);
    }, 1000);
  }, [checkout.locationName]);

  useEffect(() => {
    if (lastLocation !== checkout.locationName) {
      dispatch(fetchPlaces(checkout.locationName));
      setLastLocation(checkout.locationName);
      dispatch(setShowLocations(true));
    }
  }, [counter]);

  return <View style={styles.container}>
    <View style={styles.scrollContainer}>
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.productSection}>
      <Text style={styles.title}>Totals</Text>
        <View style={styles.rows}>
          <Text style={styles.fields}>Total cost:</Text>
          <Text style={styles.amounts}>10000</Text>
        </View>
        <View style={styles.rows}>
          <Text style={styles.fields}>Delivery fee:</Text>
          <Text style={styles.amounts}>10000</Text>
        </View>
        <View style={styles.divider}></View>
        <View style={styles.rows}>
          <Text style={styles.fields}>Amount to pay:</Text>
          <Text style={styles.amounts}>Ksh 10000</Text>
        </View>
      </View>
      <View style={styles.productSection}>
        <Text style={styles.title}>Delivery type</Text>
        <View style={styles.rows}>
          <CheckBox
            checked={checkout.selectedDelivery === 0}
            onPress={() => dispatch(setSelectedDelivery(0))}
            checkedIcon={
              <FontAwesome name="dot-circle-o" size={24} color={palettes.palette.text} />
            }
            uncheckedIcon={
              <FontAwesome name="circle-o" size={24} color="grey" />
            }
          />
          <View style={{ marginTop: 17 }}>
            <Text style={styles.fields}>Deliver to my address</Text>
            <Text style={styles.fields}>Enter location</Text>
          </View>
          <Text style={styles.amounts}>Ksh 300</Text>
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
            onPress={() => dispatch(setSelectedDelivery(1))}
            checkedIcon={
              <FontAwesome name="dot-circle-o" size={24} color={palettes.palette.text} />
            }
            uncheckedIcon={
              <FontAwesome name="circle-o" size={24} color="grey" />
            }
          />
          <Text style={styles.fields}>Pick up from store</Text>
          <Text style={styles.amounts}>Free</Text>
        </View>
        <View style={styles.divider}></View>
        <View style={styles.rows}>
          <Text style={styles.fields}>Amount to pay:</Text>
          <Text style={styles.amounts}>10000</Text>
        </View>
      </View>
    </ScrollView>
    </View>
    <View style={styles.buttonContainer}>
      <Button
        title='Confirm Order'
        buttonStyle={styles.confirmButton}
        titleStyle={styles.confirmText}
        onPress={() => {}}
      />
    </View>
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
  locationRows: {
    fontSize: 15,
  },
});

export default CheckoutScreen;
