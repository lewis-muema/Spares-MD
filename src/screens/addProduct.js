import React, { useState, useContext, useEffect } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Image, FlatList,
  KeyboardAvoidingView, ScrollView, SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AntDesign, MaterialIcons, MaterialCommunityIcons, Entypo, Ionicons,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  Text, Input, Button, BottomSheet,
} from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import { Dropdown } from 'react-native-element-dropdown';
import { fetchModels, createProduct } from '../actions/Product';
import {
  addName, addNameErr, addDescription,
  addPrice, addPriceErr, addSerialNo,
  addSerialNoErr, addModel, setBrand,
  setBrandErr, setUnits, setColor,
  setMaterial, setSize, setWeight,
  setUnitsErr, setVariant, addVariant,
  removeVariant, resetVariant, setVariantObject,
  editVariant, setErrorMessage, setImageErr,
  setModelErr, setSuccessMessage,
} from '../reducers/Product';
import ImagePicker from '../components/imagePicker';
import Spacer from '../components/Spacer';
import Banner from '../components/banner';

const textRef = React.createRef();
const priceRef = React.createRef();
const serialRef = React.createRef();
const brandRef = React.createRef();
const unitsRef = React.createRef();

const AddProductsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isFocus, setIsFocus] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(0);

  useEffect(() => {
    navigation.addListener('focus', () => {
      dispatch(fetchModels());
      dispatch(setErrorMessage(''));
      dispatch(setSuccessMessage(''));
    });
  }, []);

  const TextValidator = (val, err, field, ref, optional) => {
    if ((!/^([a-zA-Z0-9\s]{2,})$/.test(val) && !optional) || (optional && val && !/^([a-zA-Z0-9\s]{2,})$/.test(val))) {
      ref.current.shake();
      err(`Please add ${field}`);
      return true;
    }
    err('');
    return false;
  };

  const NumberValidator = (val, err, field, ref, optional) => {
    if ((!/^\d+$/.test(val) && !optional) || (optional && val && !/^\d+$/.test(val))) {
      ref.current.shake();
      err(`Please add ${field}`);
      return true;
    }
    err('');
    return false;
  };

  const addVariantValues = () => {
    if (!TextValidator(product.variant.brand,
      error => dispatch(setBrandErr(error)),
      'a brand (or Generic if you are not sure)',
      brandRef)) {
      if (editMode) {
        dispatch(editVariant({ index: editIndex, object: product.variant }));
        setEditMode(false);
        setEditIndex(0);
      } else {
        dispatch(addVariant(product.variant));
      }
      dispatch(resetVariant());
      setIsVisible(false);
    }
  };

  const removeVariantValues = (index) => {
    dispatch(resetVariant());
    dispatch(removeVariant(index));
  };

  const saveVariant = () => {
    setIsVisible(true);
    dispatch(resetVariant());
  };

  const editVariantValues = (item, index) => {
    setIsVisible(true);
    dispatch(resetVariant());
    dispatch(setVariantObject(item));
    setEditMode(true);
    setEditIndex(index);
  };

  const payloadValidator = async () => {
    const storeId = await AsyncStorage.getItem('storeId');
    const currency = await AsyncStorage.getItem('currency');
    if (!TextValidator(product.name, error => dispatch(addNameErr(error)), 'a name', textRef)
      && !NumberValidator(product.price, error => dispatch(addPriceErr(error)), 'a valid price', priceRef)
      && !TextValidator(product.serialNo, error => dispatch(addSerialNoErr(error)), 'a serial number', serialRef)
      && !TextValidator(product.brand, error => dispatch(setBrandErr(error)), 'a brand (or Generic if you are not sure)', brandRef)
      && !NumberValidator(product.units, error => dispatch(setUnitsErr(error)), 'a valid stock number', unitsRef, true)
      && product.image
      && product.model) {
      const payload = {
        name: product.name,
        storeId,
        price: parseInt(product.price, 10),
        image: product.photoId,
        modelId: product.modelObj._id,
        manufacturerId: product.modelObj.manufacturerId,
        variants: [
          {
            color: product.color,
            size: product.size,
            weight: product.weight,
            units: product.units,
            material: product.material,
            brand: product.brand,
          },
          ...product.variants,
        ],
        description: product.description,
        serialNo: product.serialNo,
        currency,
      };
      dispatch(setErrorMessage(''));
      dispatch(createProduct(payload));
    } else {
      !product.image ? dispatch(setImageErr('Please upload an image')) : null;
      !product.model ? dispatch(setModelErr('Please select a car model')) : null;
      TextValidator(product.name, error => dispatch(addNameErr(error)), 'a name', textRef);
      NumberValidator(product.price, error => dispatch(addPriceErr(error)), 'a valid price', priceRef);
      TextValidator(product.serialNo, error => dispatch(addSerialNoErr(error)), 'a serial number', serialRef);
      TextValidator(product.brand, error => dispatch(setBrandErr(error)), 'a brand (or Generic if you are not sure)', brandRef);
      NumberValidator(product.units, error => dispatch(setUnitsErr(error)), 'a valid stock number', unitsRef, true);
      dispatch(setErrorMessage('Please fill in the missing fields'));
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
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Add a product</Text>
        <Text style={styles.topLabel}>Image</Text>
        <ImagePicker />
        { product.imageErr ? <Text style={styles.inputErrImg}>{ product.imageErr }</Text> : null
        }
        <View style={styles.inputContainer}>
          <Input
          ref={textRef}
          label='Name'
          value={product.name}
          onChangeText={val => dispatch(addName(val))}
          onBlur={() => TextValidator(product.name, error => dispatch(addNameErr(error)), 'a name', textRef)}
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
          value={product.description}
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
          onBlur={() => NumberValidator(product.price, error => dispatch(addPriceErr(error)), 'a valid price', priceRef)}
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
          onBlur={() => TextValidator(product.serialNo, error => dispatch(addSerialNoErr(error)), 'a serial number', serialRef)}
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
          { product.modelErr ? <Text style={styles.inputErr}>{ product.modelErr }</Text> : null }
        </View>
        <View style={styles.inputContainer}>
          <Input
          ref={brandRef}
          label='Brand'
          value={product.brand}
          onChangeText={val => dispatch(setBrand(val))}
          onBlur={() => TextValidator(product.brand, error => dispatch(setBrandErr(error)), 'a brand (or Generic if you are not sure)', brandRef)}
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
            ref={unitsRef}
            label='Units in stock (Optional)'
            keyboardType = 'numeric'
            value={product.units}
            onChangeText={val => dispatch(setUnits(val))}
            onBlur={() => NumberValidator(product.units, error => dispatch(setUnitsErr(error)), 'a valid stock number', unitsRef, true)}
            errorMessage={product.unitsErr}
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
          <FlatList
            horizontal={true}
            keyboardShouldPersistTaps='handled'
            showsHorizontalScrollIndicator={false}
            data={product.variants}
            style={styles.variantGroup}
            renderItem={({ item, index }) => <View style={styles.variantOption}>
                <View style={styles.variantActions}>
                  <TouchableOpacity onPress={() => editVariantValues(item, index)}>
                    <AntDesign name="edit" size={18} color={palettes.palette.text} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.variantIcons}
                    onPress={() => removeVariantValues(index)}
                  >
                    <AntDesign name='delete' size={18} color='red' />
                  </TouchableOpacity>
                </View>
                <View style={styles.variantText}>
                  <Text style={styles.textBody}>Brand: { item.brand }</Text>
                  <Text style={styles.textBody}>No of units: { item.units }</Text>
                  <Text style={styles.textBody}>Color: { item.color }</Text>
                  <Text style={styles.textBody}>Size: { item.size }</Text>
                  <Text style={styles.textBody}>Material: { item.material }</Text>
                  <Text style={styles.textBody}>Weight: { item.weight }</Text>
                </View>
              </View>
            }
          />
        </View>
        { product.errorMessage ? <Spacer>
          <Banner message={product.errorMessage} type='error'></Banner>
          </Spacer> : null
        }
        { product.successMessage ? <Spacer>
          <Banner message={product.successMessage} type='success'></Banner>
          </Spacer> : null
        }
        <View style={styles.inputContainer}>
          <Button
            title='Add Variant'
            buttonStyle={styles.saveButton}
            titleStyle={styles.saveButtonText}
            onPress={() => saveVariant()}
          />
        </View>
        <View style={styles.inputContainer}>
          <Button
            title='Save'
            buttonStyle={styles.saveButton}
            titleStyle={styles.saveButtonText}
            loading={product.loading}
            onPress={() => payloadValidator()}
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
              value={product.variant.brand}
              onChangeText={val => dispatch(setVariant({ value: val, key: 'brand' }))}
              onBlur={() => TextValidator(product.variant.brand, error => dispatch(setBrandErr(error)), 'a brand (or Generic if you are not sure)', brandRef)}
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
                ref={unitsRef}
                label='Units in stock (Optional)'
                keyboardType = 'numeric'
                value={product.variant.units}
                onChangeText={val => dispatch(setVariant({ value: val, key: 'units' }))}
                onBlur={() => NumberValidator(product.variant.units, error => dispatch(setUnitsErr(error)), 'a valid stock number', unitsRef, true)}
                errorMessage={product.unitsErr}
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
              value={product.variant.color}
              onChangeText={val => dispatch(setVariant({ value: val, key: 'color' }))}
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
              value={product.variant.material}
              onChangeText={val => dispatch(setVariant({ value: val, key: 'material' }))}
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
              value={product.variant.size}
              onChangeText={val => dispatch(setVariant({ value: val, key: 'size' }))}
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
              value={product.variant.weight}
              onChangeText={val => dispatch(setVariant({ value: val, key: 'weight' }))}
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
                onPress={() => addVariantValues()}
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
  textBody: {
    color: palette.text,
    fontSize: 14,
  },
  variantGroup: {
    height: 'auto',
    marginHorizontal: 10,
  },
  variantOption: {
    borderColor: palette.text,
    borderRadius: 10,
    padding: 10,
    borderWidth: 2,
    marginRight: 10,
    marginBottom: 20,
  },
  variantIcons: {
    marginLeft: 'auto',
  },
  variantText: {
    marginHorizontal: 5,
    marginVertical: 10,
  },
  variantActions: {
    flexDirection: 'row',
    marginHorizontal: 5,
  },
  inputErr: {
    fontSize: 12,
    color: 'red',
    marginLeft: 15,
    marginTop: -15,
    marginBottom: 10,
  },
  inputErrImg: {
    fontSize: 12,
    color: 'red',
    marginLeft: 25,
    marginBottom: 10,
  },
});

export default AddProductsScreen;
