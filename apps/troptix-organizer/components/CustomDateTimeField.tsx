
import React, { useState } from "react";
import {
  Pressable,
} from "react-native";
import {
  View,
  TextField,
  Colors,
  DateTimePicker,
  DateTimePickerProps,
  DateTimePickerMode,
} from "react-native-ui-lib";
import { format } from 'date-fns';

export default function CustomDateTimeField({ name, label, placeholder, value, reference, dateMode, handleChange }) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  function showDateTime(ref) {
    if (ref === undefined || ref.current === undefined)
      return;

    setShowDatePicker(true);
    ref.current.focus();
  }

  function getDateFormatter(): DateTimePickerProps['dateTimeFormatter'] {
    return (value: Date, mode: DateTimePickerMode) =>
      format(value, mode === 'date' ? 'MMM dd, yyyy' : 'hh:mm a');
  };

  function setTextFieldFocused(ref) {
    if (ref === undefined || ref.current === undefined)
      return;

    ref.current.focus();
  }

  return (
    <Pressable
      // onPress={() => setTextFieldFocused(reference)}
      onPress={() => showDateTime(reference)}
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "white",
      }}
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
        <DateTimePicker
          migrateTextField
          label={label}
          placeholder={placeholder}
          onChange={(date) => handleChange(name, date)}
          ref={reference}
          labelStyle={{
            marginBottom: 4,
          }}
          mode={dateMode}
          dateTimeFormatter={getDateFormatter()}
          value={
            value == undefined
              ? new Date()
              : new Date(value)
          }
        />
      </View>
    </Pressable>
  )
}