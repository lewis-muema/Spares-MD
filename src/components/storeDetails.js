import React, { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  View, StyleSheet, FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  FontAwesome5,
} from '@expo/vector-icons';
import {
  Text, Input, Button, ButtonGroup,
} from 'react-native-elements';
import {
  setLoading,
  setStoreName,
  setStoreAddress,
  setStoreNameErr,
  setStoreAddressErr,
  setDeliveryOptions,
  setStoreAddressObject,
  setShowLocations,
} from '../reducers/Auth';
import { fetchPlaces, createStore, organizeLocation } from '../actions/Auth';
import Spacer from './Spacer';
import Banner from './banner';

const storeNameRef = React.createRef();
const storeAddressRef = React.createRef();
const deliveryOptionsRef = React.createRef();

const StoreDetails = () => {
  const [counter, setCounter] = useState(0);
  const [lastLocation, setLastLocation] = useState(0);
  const auth = useSelector(state => state.auth.value);
  const palettes = useSelector(state => state.palette.value);
  const styles = paletteStyles(palettes.palette, palettes.fontsLoaded);
  const dispatch = useDispatch();

  const storeNameValidator = () => {
    if (auth.storeName.length === 0) {
      dispatch(setStoreNameErr('Please enter a valid store name'));
      storeNameRef.current.shake();
      return true;
    }
    dispatch(setStoreNameErr(''));
    return false;
  };

  const storeAddressValidator = () => {
    if (!auth.storeAddress.description) {
      dispatch(setStoreAddressErr('Please enter a valid address'));
      storeAddressRef.current.shake();
      return true;
    }
    dispatch(setStoreAddressErr(''));
    return false;
  };

  const signupCTA = () => {
    if (storeNameValidator() || storeAddressValidator()) {
      storeNameValidator();
      setStoreAddress();
    } else {
      dispatch(setLoading(true));
      dispatch(createStore(auth));
    }
  };

  const setLocation = (item) => {
    dispatch(setStoreAddressObject(organizeLocation(item)));
    setLastLocation(item.description);
    storeAddressRef.current.blur();
  };

  useEffect(() => {
    setTimeout(() => {
      setCounter(counter + 1);
    }, 1000);
  }, [auth.storeAddressName]);

  useEffect(() => {
    if (lastLocation !== auth.storeAddressName) {
      dispatch(fetchPlaces(auth.storeAddressName));
      setLastLocation(auth.storeAddressName);
      dispatch(setShowLocations(true));
    }
  }, [counter]);


  return <View style={styles.spacer}>
      <View style={styles.inputContainer}>
        <Input
        ref={storeNameRef}
        label='Store name'
        value={auth.storeName}
        onChangeText={val => dispatch(setStoreName(val))}
        onBlur={storeNameValidator}
        errorMessage={auth.storeNameErr}
        labelStyle={styles.label}
        inputStyle={styles.inputTextSytle}
        placeholderTextColor={palettes.palette.text}
        inputContainerStyle={{ borderColor: palettes.palette.text }}
        autoCapitalize='words'
        autoCorrect={false}
        leftIcon={
          <FontAwesome5 name="user" size={18} color={palettes.palette.text} />
        } />
      </View>
      <View style={styles.inputContainerLocations}>
        <Input
          ref={storeAddressRef}
          label='Store location'
          value={auth.storeAddressName}
          onChangeText={val => dispatch(setStoreAddress(val))}
          onBlur={storeAddressValidator}
          errorMessage={auth.storeAddressErr}
          labelStyle={styles.label}
          inputStyle={styles.inputTextSytle}
          placeholderTextColor={palettes.palette.text}
          inputContainerStyle={{ borderColor: palettes.palette.text }}
          autoCapitalize='words'
          autoCorrect={false}
          leftIcon={
            <FontAwesome5 name="user" size={18} color={palettes.palette.text} />
          }
        />
        {
          auth.showLocations
            ? <View style={styles.locationsList}>
            <FlatList
              horizontal={false}
              keyboardShouldPersistTaps='handled'
              showsVerticalScrollIndicator={false}
              data={auth.locations}
              style={styles.rows}
              renderItem={({ item }) => <TouchableOpacity
              style={styles.locationOption} onPress={() => setLocation(item)}>
                  <Text style={styles.textBody}>{ item.description }</Text>
                </TouchableOpacity>
              }
            />
          </View>
            : null
        }
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.userTypeLabel}>Delivery options</Text>
      <ButtonGroup
        buttons={auth.deliveryOptionsGroup}
        selectedIndex={auth.deliveryOption}
        onPress={(value) => {
          dispatch(setDeliveryOptions(value));
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
          marginBottom: 20,
        }}
      />
      </View>
      { auth.errorMessage ? <Spacer>
        <Banner message={auth.errorMessage} type='error'></Banner>
        </Spacer> : null
      }
      <Spacer>
        <View style={styles.signupButtonContainer}>
          <Button
            title='Save store'
            buttonStyle={styles.signupButton}
            titleStyle={styles.signupButtonText}
            loading={auth.loading}
            onPress={() => signupCTA()}
          />
        </View>
      </Spacer>
    </View>;
};

const paletteStyles = (palette, fontsLoaded) => StyleSheet.create({
  container: {
    backgroundColor: palette.background,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontWeight: '600',
  },
  trailsLogo: {
    width: 250,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: -50,
  },
  label: {
    color: palette.text,
    fontSize: 14,
  },
  inputContainer: {
    width: '90%',
    alignSelf: 'center',
  },
  inputContainerLocations: {
    position: 'relative',
    width: '90%',
    alignSelf: 'center',
  },
  inputCont: {
    backgroundColor: palette.background,
  },
  userTypeLabel: {
    marginLeft: 10,
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 5,
  },
  inputTextSytle: {
    marginLeft: 10,
  },
  signin: {
    textAlign: 'center',
    color: palette.text,
    fontSize: 16,
    fontWeight: '600',
  },
  signinText: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  reset: {
    textAlign: 'center',
    color: palette.metricsBottom,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
  },
  signupButton: {
    backgroundColor: palette.text,
    borderRadius: 10,
    width: '100%',
    fontSize: 14,
  },
  guestButton: {
    backgroundColor: palette.metricsBottom,
    borderRadius: 10,
    width: '100%',
    fontSize: 14,
  },
  signupButtonContainer: {
    width: '60%',
    alignSelf: 'center',
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  trailsLogoCont: {
    fontFamily: fontsLoaded ? 'manuscript-font' : '',
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignSelf: 'center',
    marginTop: -30,
  },
  trailsLogoText: {
    fontFamily: fontsLoaded ? 'manuscript-font' : '',
    fontSize: 80,
    color: palette.text,
  },
  trailsLogoMD: {
    fontFamily: fontsLoaded ? 'manuscript-font' : '',
    fontSize: 18,
    marginTop: 6,
    marginLeft: 2,
    letterSpacing: 1,
    color: palette.text,
  },
  trailsLogoBG: {
    position: 'absolute',
    top: -46,
    left: -19,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  locationsList: {
    position: 'absolute',
    top: 70,
    paddingHorizontal: 10,
    zIndex: 1000,
    backgroundColor: 'white',
    alignSelf: 'center',
    width: '100%',
  },
  locationOption: {
    margin: 10,
  },
});

export default StoreDetails;
