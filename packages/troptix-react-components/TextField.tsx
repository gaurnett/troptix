import React from 'react';
import { Pressable } from 'react-native';
import { View, TextField, Colors } from 'react-native-ui-lib';

export default function CustomTextField(
  name: string,
  label: string,
  placeholder: string,
  value: string,
  reference,
  handleChange
) {
  function setTextFieldFocused(ref) {
    if (ref === undefined || ref.current === undefined) return;

    ref.current.focus();
  }

  return (
    <Pressable
      onPress={() => setTextFieldFocused(reference)}
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
      }}
    >
      <View
        marginT-16
        paddingT-6
        paddingL-8
        style={{
          height: 150,
          width: '100%',
          borderWidth: 0.5,
          borderColor: '#D3D3D3',
        }}
      >
        <TextField
          label={label}
          placeholder={placeholder}
          multiline={true}
          scrollEnabled={true}
          value={value}
          ref={reference}
          labelColor={Colors.black}
          labelStyle={{
            marginBottom: 4,
          }}
          enableErrors
          style={{ fontSize: 16 }}
          onChangeText={(txt) => handleChange(name, txt)}
        />
      </View>
    </Pressable>
  );
}
