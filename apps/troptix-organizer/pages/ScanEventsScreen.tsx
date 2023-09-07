import _ from 'lodash';
import * as React from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import { Text, View, Card, Colors, CardProps, Button} from 'react-native-ui-lib';
import events from '../data/events';

export default function ScanEventsScreen({ navigation }) {

  function onEventClick(event) {
    navigation.navigate('ScanEventScreen', {
      event: event
    })
  }

  function renderEvents() {
    return _.map(events, (event, i) => {
      return (
        <Card
          key={i}
          style={{marginBottom: 15}}
          onPress={() => onEventClick(event)}
        >
          <Card.Section
            contentStyle = {{
              flex: 1,
            }}
            imageSource={event.coverImage}
            imageStyle={{
              width: '100%',
              height: 200,
            }}
          />

          <View padding-20>
            <Text text50 $textDefault>
              {event.title}
            </Text>
            <View row>
              <Text text70 $textDefault>{event.timestamp} | </Text>
              <Text text70 color={Colors.$textMajor}>
                {event.host}
              </Text>
            </View>

            <Text text70 $textDefault>
              {event.location}
            </Text>

            <Text text70 color={Colors.$textSuccess}>
              {event.price}
            </Text>
          </View>
        </Card>
      );
    });
  };

	return (
    <View style={{backgroundColor: 'white'}}>
      <ScrollView>
        <View flex padding-20>
          {renderEvents()}
        </View>
      </ScrollView>
    </View>
	);
}