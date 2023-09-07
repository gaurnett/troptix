import * as React from 'react';
import { Text, View, TextField, Colors } from 'react-native-ui-lib';
import { Keyboard, ScrollView, TouchableWithoutFeedback } from 'react-native';
import EventForm from '../components/EventForm';
import { Event } from '../models/event';

export default function AddEventScreen({navigation}) {
  return (
    <View style={{height: "100%"}} backgroundColor='white'>
      <EventForm eventObject={new Event()} editEvent={false} navigation={navigation} />
    </View>
  );
}