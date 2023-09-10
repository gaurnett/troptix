
import React from "react";
import {
  Pressable,
} from "react-native";
import {
  View,
  TextField,
  Colors,
} from "react-native-ui-lib";

export default function CustomTextField({ name, label, placeholder, value, reference, handleChange, secureTextEntry = false }) {

  function setTextFieldFocused(ref) {
    ref.current.focus();
  }

  return (
    <Pressable
      onPress={() => setTextFieldFocused(reference)}
    >
      <View
        marginT-16
        paddingT-6
        paddingL-8
        style={{
          height: 60,
          width: "100%",
          borderWidth: 0.5,
          borderColor: "#D3D3D3",
        }}
      >
        <TextField
          label={label}
          placeholder={placeholder}
          value={value}
          ref={reference}
          labelColor={Colors.black}
          labelStyle={{
            marginBottom: 4,
          }}
          enableErrors
          style={{ fontSize: 16 }}
          secureTextEntry={secureTextEntry}
          onChangeText={(txt) => handleChange(name, txt)}
        />
      </View>
    </Pressable>
  )
}