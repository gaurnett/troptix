import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native-ui-lib';
import { Keyboard, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { Event } from 'troptix-models';
import CustomTextField from '../../components/CustomTextField';
import CustomDateTimeField from '../../components/CustomDateTimeField';
import {
  PlaceType,
  GooglePlacesAutocomplete,
} from 'react-native-google-places-autocomplete';

export default function GooglePlacesScreen({ route }) {
  const placesRef = useRef();
  const { getMapsResults } = route.params;

  useEffect(() => {
    if (placesRef.current !== undefined) {
      placesRef.current.focus();
    }
  }, []);

  return (
    <View
      paddingT-16
      paddingL-16
      paddingR-16
      style={{ height: '100%', flex: 1, backgroundColor: 'white' }}
    >
      <View
        style={{
          height: '100%',
          width: '100%',
          borderColor: '#D3D3D3',
        }}
      >
        <GooglePlacesAutocomplete
          ref={placesRef}
          placeholder="Enter location"
          onPress={(data, details = null) => {
            getMapsResults(data, details);
          }}
          query={{
            key: 'AIzaSyD8RUphX2zD_n9uzXhIwhBo-5oQD2n0B3M',
            language: 'en',
          }}
          nearbyPlacesAPI="GooglePlacesSearch"
          fetchDetails={true}
          styles={{
            textInputContainer: {
              borderWidth: 1,
            },
          }}
        />
      </View>
    </View>
  );
}
