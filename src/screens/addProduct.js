import React, { useState, useContext, useEffect } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Image,
  KeyboardAvoidingView, ScrollView, SafeAreaView,
} from 'react-native';
import {
  AntDesign, MaterialIcons, MaterialCommunityIcons, Entypo, Ionicons,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  Text, Input, Button, BottomSheet,
} from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import { Dropdown } from 'react-native-element-dropdown';
import { validateAuth } from '../actions/Auth';
import { fetchModels } from '../actions/Product';
import {
  addName, addNameErr, addDescription,
  addPrice, addPriceErr, addSerialNo,
  addSerialNoErr, addModel, setBrand,
  setBrandErr, setUnits, setColor,
  setMaterial, setSize, setWeight,
} from '../reducers/Product';
import ImagePicker from '../components/imagePicker';

const textRef = React.createRef();
const priceRef = React.createRef();
const serialRef = React.createRef();
const brandRef = React.createRef();

const AddProductsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isFocus, setIsFocus] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    dispatch(validateAuth());
    navigation.addListener('focus', () => {
      dispatch(fetchModels());
    });
  }, []);

  const TextValidator = (val, err, field, ref) => {
    if (!/^([a-zA-Z]{2,})$/.test(val)) {
      ref.current.shake();
      err(`Please add ${field}`);
      return true;
    }
    err('');
    return false;
  };

  const NumberValidator = (val, err, field, ref) => {
    if (!/^([0-9])$/.test(val)) {
      ref.current.shake();
      err(`Please add ${field}`);
      return true;
    }
    err('');
    return false;
  };

  const payloadValidator = () => {
    if (!product.nameErr
      && !product.priceErr
      && !product.brandErr
      && !product.serialNoErr
      && product.image
      && product.model) {
      const payload = {
        name: product.name,
        storeId: '65fd733aed18165e80523c46',
        price: product.price,
        modelId: product.modelObj,
        manufacturerId: product.modelObj,
        variants: [
          {
            color: 'Silver',
            size: '5 feet',
            weight: '2kg',
            units: 3,
          },
          {
            color: 'Bronze',
            size: '5 feet',
            weight: '2kg',
            units: 4,
          },
        ],
        description: 'Straight pipes, No Cat, dual tips',
        serialNo: '359OP930JKZ253',
        currency: 'KES',
      };
    }
  };

  const palettes = useSelector(state => state.palette.value);
  const product = useSelector(state => state.product.value);
  const styles = paletteStyles(palettes.palette, palettes.fontsLoaded);

  return <View style={styles.container}>
    <KeyboardAvoidingView
      style={styles.inputCont}
      keyboardVerticalOffset={20}
      behavior={'position'}
    >
      <ScrollView
        horizontal={false}
        scrollEnabled={true}
        contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Add a product</Text>
        <Text style={styles.topLabel}>Image</Text>
        <ImagePicker />
        <View style={styles.inputContainer}>
          <Input
          ref={textRef}
          label='Name'
          value={product.name}
          onChangeText={val => dispatch(addName(val))}
          onBlur={val => TextValidator(val, error => dispatch(addNameErr(error)), 'an email', textRef)}
          errorMessage={product.nameErr}
          labelStyle={styles.label}
          inputStyle={styles.inputTextSytle}
          placeholderTextColor={palettes.palette.text}
          inputContainerStyle={{ borderColor: palettes.palette.text }}
          autoCapitalize='none'
          autoCorrect={false}
          leftIcon={
            <MaterialIcons name="text-fields" size={18} color={palettes.palette.text} />
          } />
        </View>
        <View style={styles.inputContainer}>
          <Input
          label='Description (Optional)'
          value={product.name}
          onChangeText={val => dispatch(addDescription(val))}
          labelStyle={styles.label}
          inputStyle={styles.inputTextSytle}
          placeholderTextColor={palettes.palette.text}
          inputContainerStyle={{ borderColor: palettes.palette.text }}
          autoCapitalize='none'
          autoCorrect={false}
          leftIcon={
            <MaterialCommunityIcons name="focus-field-horizontal" size={18} color={palettes.palette.text} />
          } />
        </View>
        <View style={styles.inputContainer}>
          <Input
          ref={priceRef}
          label='Price'
          value={product.price}
          keyboardType = 'numeric'
          onChangeText={val => dispatch(addPrice(val))}
          onBlur={val => NumberValidator(val, error => dispatch(addPriceErr(error)), 'a valid price', priceRef)}
          errorMessage={product.priceErr}
          labelStyle={styles.label}
          inputStyle={styles.inputTextSytle}
          placeholderTextColor={palettes.palette.text}
          inputContainerStyle={{ borderColor: palettes.palette.text }}
          autoCapitalize='none'
          autoCorrect={false}
          leftIcon={
            <Entypo name="price-tag" size={18} color={palettes.palette.text} />
          } />
        </View>
        <View style={styles.inputContainer}>
          <Input
          ref={serialRef}
          label='Serial Number'
          value={product.serialNo}
          onChangeText={val => dispatch(addSerialNo(val))}
          onBlur={val => TextValidator(val, error => dispatch(addSerialNoErr(error)), 'a serial number', serialRef)}
          errorMessage={product.serialNoErr}
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
        <Text style={styles.topLabel}>Car model</Text>
        <View style={styles.inputContainer}>
          <Dropdown
            style={styles.selectDropdown}
            placeholderStyle={{ fontWeight: '500' }}
            selectedTextStyle={{ fontWeight: '500' }}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={product.models}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? 'Select model' : '...'}
            searchPlaceholder="Search car model"
            value={product.model}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              dispatch(addModel(item));
              setIsFocus(false);
            }}
            renderLeftIcon={() => (
              <AntDesign color={palettes.palette.text} style={{ marginRight: 10 }} name="car" size={18} />
            )}
          />
        </View>
        <View style={styles.inputContainer}>
          <Input
          ref={brandRef}
          label='Brand'
          value={product.brand}
          onChangeText={val => dispatch(setBrand(val))}
          onBlur={val => TextValidator(val, error => dispatch(setBrandErr(error)), 'a brand (or Generic if you are not sure)', brandRef)}
          errorMessage={product.brandErr}
          labelStyle={styles.label}
          inputStyle={styles.inputTextSytle}
          placeholderTextColor={palettes.palette.text}
          inputContainerStyle={{ borderColor: palettes.palette.text }}
          autoCapitalize='none'
          autoCorrect={false}
          leftIcon={
            <MaterialIcons name="branding-watermark" size={18} color={palettes.palette.text} />
          } />
        </View>
        <View style={styles.inputContainer}>
          <Input
            ref={priceRef}
            label='Units in stock (Optional)'
            keyboardType = 'numeric'
            value={product.units}
            onChangeText={val => dispatch(setUnits(val))}
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
          <Input
          label='Color (Optional)'
          value={product.color}
          onChangeText={val => dispatch(setColor(val))}
          labelStyle={styles.label}
          inputStyle={styles.inputTextSytle}
          placeholderTextColor={palettes.palette.text}
          inputContainerStyle={{ borderColor: palettes.palette.text }}
          autoCapitalize='none'
          autoCorrect={false}
          leftIcon={
            <Ionicons name="color-palette-outline" size={18} color={palettes.palette.text} />
          } />
        </View>
        <View style={styles.inputContainer}>
          <Input
          label='Material (Optional)'
          value={product.material}
          onChangeText={val => dispatch(setMaterial(val))}
          labelStyle={styles.label}
          inputStyle={styles.inputTextSytle}
          placeholderTextColor={palettes.palette.text}
          inputContainerStyle={{ borderColor: palettes.palette.text }}
          autoCapitalize='none'
          autoCorrect={false}
          leftIcon={
            <MaterialCommunityIcons name="gold" size={18} color={palettes.palette.text} />
          } />
        </View>
        <View style={styles.inputContainer}>
          <Input
          label='Size (Optional)'
          value={product.size}
          onChangeText={val => dispatch(setSize(val))}
          labelStyle={styles.label}
          inputStyle={styles.inputTextSytle}
          placeholderTextColor={palettes.palette.text}
          inputContainerStyle={{ borderColor: palettes.palette.text }}
          autoCapitalize='none'
          autoCorrect={false}
          leftIcon={
            <MaterialCommunityIcons name="resize" size={18} color={palettes.palette.text} />
          } />
        </View>
        <View style={styles.inputContainer}>
          <Input
          label='Weight (Optional)'
          value={product.weight}
          onChangeText={val => dispatch(setWeight(val))}
          labelStyle={styles.label}
          inputStyle={styles.inputTextSytle}
          placeholderTextColor={palettes.palette.text}
          inputContainerStyle={{ borderColor: palettes.palette.text }}
          autoCapitalize='none'
          autoCorrect={false}
          leftIcon={
            <MaterialCommunityIcons name="weight-kilogram" size={18} color={palettes.palette.text} />
          } />
        </View>
        <View style={styles.inputContainer}>
          <Button
            title='Add Variant'
            buttonStyle={styles.saveButton}
            titleStyle={styles.saveButtonText}
            onPress={() => setIsVisible(true)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Button
            title='Save'
            buttonStyle={styles.saveButton}
            titleStyle={styles.saveButtonText}
            loading={product.loading}
            onPress={() => {}}
          />
        </View>
      </ScrollView>
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
            <Input
              ref={brandRef}
              label='Brand'
              value={product.brand}
              onChangeText={val => dispatch(setBrand(val))}
              onBlur={val => TextValidator(val, error => dispatch(setBrandErr(error)), 'a brand (or Generic if you are not sure)', brandRef)}
              errorMessage={product.brandErr}
              labelStyle={styles.label}
              inputStyle={styles.inputTextSytle}
              placeholderTextColor={palettes.palette.text}
              inputContainerStyle={{ borderColor: palettes.palette.text }}
              autoCapitalize='none'
              autoCorrect={false}
              leftIcon={
                <MaterialIcons name="branding-watermark" size={18} color={palettes.palette.text} />
              } />
            </View>
            <View style={styles.inputContainer}>
              <Input
                ref={priceRef}
                label='Units in stock (Optional)'
                keyboardType = 'numeric'
                value={product.units}
                onChangeText={val => dispatch(setUnits(val))}
                labelStyle={styles.label}
                inputStyle={styles.inputTextSytle}
                placeholderTextColor={palettes.palette.text}
                inputContainerStyle={{ borderColor: palettes.palette.text }}
                autoCapitalize='none'
                autoCorrect={false}
                leftIcon={
                  <Entypo name="price-tag" size={18} color={palettes.palette.text} />
                } />
            </View>
            <View style={styles.inputContainer}>
            <Input
              label='Color (Optional)'
              value={product.color}
              onChangeText={val => dispatch(setColor(val))}
              labelStyle={styles.label}
              inputStyle={styles.inputTextSytle}
              placeholderTextColor={palettes.palette.text}
              inputContainerStyle={{ borderColor: palettes.palette.text }}
              autoCapitalize='none'
              autoCorrect={false}
              leftIcon={
                <Ionicons name="color-palette-outline" size={18} color={palettes.palette.text} />
              } />
            </View>
            <View style={styles.inputContainer}>
              <Input
              label='Material (Optional)'
              value={product.material}
              onChangeText={val => dispatch(setMaterial(val))}
              labelStyle={styles.label}
              inputStyle={styles.inputTextSytle}
              placeholderTextColor={palettes.palette.text}
              inputContainerStyle={{ borderColor: palettes.palette.text }}
              autoCapitalize='none'
              autoCorrect={false}
              leftIcon={
                <MaterialCommunityIcons name="gold" size={18} color={palettes.palette.text} />
              } />
            </View>
            <View style={styles.inputContainer}>
              <Input
              label='Size (Optional)'
              value={product.size}
              onChangeText={val => dispatch(setSize(val))}
              labelStyle={styles.label}
              inputStyle={styles.inputTextSytle}
              placeholderTextColor={palettes.palette.text}
              inputContainerStyle={{ borderColor: palettes.palette.text }}
              autoCapitalize='none'
              autoCorrect={false}
              leftIcon={
                <MaterialCommunityIcons name="resize" size={18} color={palettes.palette.text} />
              } />
            </View>
            <View style={styles.inputContainer}>
              <Input
              label='Weight (Optional)'
              value={product.weight}
              onChangeText={val => dispatch(setWeight(val))}
              labelStyle={styles.label}
              inputStyle={styles.inputTextSytle}
              placeholderTextColor={palettes.palette.text}
              inputContainerStyle={{ borderColor: palettes.palette.text }}
              autoCapitalize='none'
              autoCorrect={false}
              leftIcon={
                <MaterialCommunityIcons name="weight-kilogram" size={18} color={palettes.palette.text} />
              } />
            </View>
            <View style={styles.inputContainer}>
              <Button
                title='Save Variant'
                buttonStyle={styles.saveButton}
                titleStyle={styles.saveButtonText}
                onPress={() => setIsVisible(false)}
              />
            </View>
          </View>
        </BottomSheet>
      </KeyboardAvoidingView>
  </View>;
};

const paletteStyles = palette => StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  joinImg: {
    width: 250,
    height: 100,
    resizeMode: 'cover',
    marginVertical: 10,
  },
  title: {
    marginLeft: 20,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '700',
    color: palette.text,
  },
  label: {
    color: palette.text,
    fontSize: 14,
  },
  topLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 20,
    color: palette.text,
  },
  inputTextSytle: {
    marginLeft: 10,
  },
  inputContainer: {
    marginHorizontal: 10,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'space-between',
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
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
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
});

export default AddProductsScreen;
