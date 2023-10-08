
import React from "react";
import {
  Pressable,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { GooglePlaceData, GooglePlaceDetail } from "react-native-google-places-autocomplete";
import {
  View,
  TextField,
  Colors,
} from "react-native-ui-lib";

export default function CustomLocationTextField({ label, placeholder, value, reference, setMapsResults, navigation }) {

  function openGoogleMaps() {
    navigation.navigate("GooglePlacesScreen", {
      getMapsResults: getMapsResults
    });
  }

  function getMapsResults(data: GooglePlaceData, details: GooglePlaceDetail) {
    setMapsResults(data, details);
  }

  return (
    <TouchableOpacity
      activeOpacity={.6}
      onPress={() => openGoogleMaps()}
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
          editable={false}
          pointerEvents="none"
          placeholder={placeholder}
          multiline={true}
          scrollEnabled={true}
          value={value}
          ref={reference}
          labelColor={Colors.black}
          color={Colors.black}
          labelStyle={{
            marginBottom: 4,
          }}
          enableErrors
          style={{ fontSize: 16 }}
        />
      </View>
    </TouchableOpacity>
  )
}