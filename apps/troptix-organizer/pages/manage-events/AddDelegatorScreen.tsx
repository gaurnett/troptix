import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import {
  View,
  Colors,
  Button,
  Picker
} from 'react-native-ui-lib';
import { Keyboard, KeyboardAvoidingView, Pressable, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import CustomTextField from '../../components/CustomTextField';
import { DelegatedUser, DelegatedAccess } from "troptix-models";

export default function AddDelegatorScreen({ route, navigation }) {
  const { isEditUser, userIndex, user, addUser, editUser } = route.params;
  const userEmailRef = useRef()
  const userRoleRef = useRef()
  const [delegatedUser, setDelegatedUser] = useState<DelegatedUser>(user);
  const roleOptions = [
    { label: 'Owner', value: DelegatedAccess.OWNER },
    { label: 'Ticket Scanner', value: DelegatedAccess.TICKET_SCANNER },
  ];

  function setTextFieldFocused(ref) {
    if (ref === undefined || ref.current === undefined)
      return;

    ref.current.focus();
  }

  function handleChange(name, value) {
    setDelegatedUser(previousUser => ({ ...previousUser, [name]: value }))
  }

  function handlePickerChange(value) {
    setDelegatedUser(previousUser => ({ ...previousUser, ['delegatedAccess']: value }))
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
            value={delegatedUser.delegatedAccess}
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

  function saveUser() {
    if (isEditUser) {
      editUser(userIndex, delegatedUser);
    } else {
      addUser(delegatedUser);
    }
    navigation.goBack();
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
                name="email"
                label="User Email"
                placeholder="johndoe@gmail.com"
                value={delegatedUser.email}
                reference={userEmailRef}
                handleChange={handleChange}
              />
            </View>

            <View flex>
              {fetchPicker("User Role", "OWNER", userRoleRef)}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </View>
      <View
        backgroundColor="transparent"
        marginB-24
        style={{ borderTopColor: '#D3D3D3', borderTopWidth: 1, height: 70, justifyContent: 'center', alignItems: 'center' }}>
        <Button
          onPress={() => saveUser()}
          style={{ width: '70%', height: '70%' }}
          label={"Save User"}
          labelStyle={{ fontSize: 18 }} />
      </View>
    </KeyboardAvoidingView>
  );
}