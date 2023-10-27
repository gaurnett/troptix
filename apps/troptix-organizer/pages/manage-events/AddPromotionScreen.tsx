import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import {
  View,
  Colors,
  Button,
  Picker
} from 'react-native-ui-lib';
import { Alert, Keyboard, KeyboardAvoidingView, Pressable, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import CustomTextField from '../../components/CustomTextField';
import { Promotion, PromotionType } from "troptix-models";
import { TropTixResponse, addPromotion } from 'troptix-api';

export default function AddPromotionScreen({ route, navigation }) {
  const { isEditPromotion, promotionIndex, promo, addPromo, editPromo } = route.params;
  const promoCodeRef = useRef()
  const promoTypeRef = useRef()
  const promoValueRef = useRef()
  const [promotion, setPromotion] = useState<Promotion>(promo);
  const [isFetchingPromotions, setIsFetchingPromotions] = useState(true);
  const roleOptions = [
    { label: 'Percentage', value: PromotionType.PERCENTAGE },
    { label: 'Dollar Amount', value: PromotionType.DOLLAR_AMOUNT },
  ];

  function setTextFieldFocused(ref) {
    if (ref === undefined || ref.current === undefined)
      return;

    ref.current.focus();
  }

  function handleChange(name, value) {
    let formattedValue = value;
    if (formattedValue.includes(' ')) {
      formattedValue = formattedValue.trim();
    }

    setPromotion(previousPromo => ({ ...previousPromo, [name]: formattedValue }))
  }

  function handlePickerChange(value) {
    setPromotion(previousPromo => ({ ...previousPromo, ['promotionType']: value }))
  }

  function fetchPicker(textLabel, placeholder, textFieldReference) {
    return (
      <Pressable onPress={() => setTextFieldFocused(textFieldReference)} style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
        <View marginT-16 paddingT-6 paddingL-8 style={{ height: 60, width: '100%', borderWidth: 0.5, borderColor: '#D3D3D3' }}>
          <Picker
            label={textLabel}
            placeholder={placeholder}
            migrate
            useSafeArea
            labelStyle={{
              marginBottom: 4
            }}
            topBarProps={{
              doneLabel: 'Save',
            }}
            value={promotion.promotionType}
            onChange={value => handlePickerChange(value)}
            mode={Picker.modes.SINGLE}
          >
            {_.map(roleOptions, option => (
              <Picker.Item key={option.value} value={option.value} label={option.label} disabled={option.disabled} />
            ))}
          </Picker>
        </View>
      </Pressable>
    )
  }

  async function savePromotion() {
    try {
      const response = await addPromotion(promotion, isEditPromotion);
      if (response.error === null || response.error === undefined) {
        if (isEditPromotion) {
          editPromo(promotionIndex, promotion);
        } else {
          addPromo(promotion);
        }
        navigation.goBack();
      } else {
        Alert.alert('Adding promotion failed', 'Please check the details and try again.', [
          {
            text: 'Okay', onPress: () => {
            }
          },
        ]);
        console.log("AddPromotionScreen [savePromotion] response error: " + JSON.stringify(response));
        return;
      }
    } catch (error) {
      console.log("AddPromotionScreen [savePromotion] error: " + error);
      return;
    }
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={{ height: "100%", backgroundColor: Colors.white }}>
      <View paddingR-16 paddingL-16 style={{ flex: 1, backgroundColor: 'white' }}>
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          accessible={false}>
          <ScrollView>
            <View>
              <CustomTextField
                name="code"
                label="Promotion Code"
                autoCap='none'
                placeholder="SAVE15"
                value={promotion.code}
                reference={promoCodeRef}
                handleChange={handleChange}
              />
            </View>

            <View row>
              <View marginR-8 flex>
                <CustomTextField
                  name="value"
                  label="Value"
                  autoCap='none'
                  placeholder="15"
                  keyboardType="numeric"
                  value={promotion.value}
                  reference={promoValueRef}
                  handleChange={handleChange}
                />
              </View>
              <View marginL-8 flex>
                {fetchPicker("Promotion Type", "Percentage", promoTypeRef)}
              </View>
            </View>

          </ScrollView>
        </TouchableWithoutFeedback>
      </View>
      <View
        backgroundColor="transparent"
        marginB-24
        style={{ borderTopColor: '#D3D3D3', borderTopWidth: 1, height: 70, justifyContent: 'center', alignItems: 'center' }}>
        <Button
          onPress={() => savePromotion()}
          style={{ width: '70%', height: '70%' }}
          label={"Save Promotion"}
          labelStyle={{ fontSize: 18 }} />
      </View>
    </KeyboardAvoidingView>
  );
}