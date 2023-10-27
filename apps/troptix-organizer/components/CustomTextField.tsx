
import React from "react";
import {
  Pressable,
} from "react-native";
import {
  View,
  TextField,
  Colors,
} from "react-native-ui-lib";

export default function CustomTextField({
  name,
  label,
  placeholder,
  value, reference,
  handleChange,
  secureTextEntry = false,
  isTextArea = false,
  textAreaSize = 60,
  autoCap = "sentences",
  keyboardType = "default" }) {

  function setTextFieldFocused(ref) {
    if (ref === undefined || ref.current === undefined)
      return;

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
          height: isTextArea ? textAreaSize : 60,
          width: "100%",
          borderWidth: 0.5,
          borderColor: "#D3D3D3",
        }}
      >
        <TextField
          label={label}
          placeholder={placeholder}
          multiline={isTextArea}
          scrollEnabled={isTextArea}
          value={value}
          ref={reference}
          labelColor={Colors.black}
          labelStyle={{
            marginBottom: 4,
          }}
          keyboardType={keyboardType}
          autoCapitalize={autoCap}
          enableErrors
          style={{ fontSize: 16 }}
          secureTextEntry={secureTextEntry}
          onChangeText={(txt) => handleChange(name, txt)}
        />
      </View>
    </Pressable>
  )
}