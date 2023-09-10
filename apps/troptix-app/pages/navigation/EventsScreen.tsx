import _ from 'lodash';
import { useEffect, useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Text, View, Card, Colors, CardProps, Button, LoaderScreen } from 'react-native-ui-lib';
import { Event, getEventsFromRequest } from 'troptix-models';
import { TropTixResponse, getEvents } from 'troptix-api';

const cardImage = require('../../assets/favicon.png');

export default function EventsScreen({ navigation }) {

  const [isFetchingEvents, setIsFetchingEvents] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = async () => {
    try {
      const response: TropTixResponse = await getEvents();
      if (response.response !== undefined) {
        setEvents(getEventsFromRequest(response.response));
      }
    } catch (error) {
      console.log("Fetching Events Error: " + error)
    }

    setIsFetchingEvents(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  function formatDate(date: Date) {
    return date.toDateString();
  }

  function onEventClick(event) {
    navigation.navigate('EventDetailsScreen', {
      event: event
    })
  }

  function renderEvents() {
    if (events.length === 0) {
      return;
    }

    return _.map(events, (event, i) => {
      return (
        <Card
          key={i}
          style={{ marginBottom: 15 }}
          onPress={() => onEventClick(event)}
        >
          <Card.Section
            contentStyle={{
              flex: 1,
            }}
            imageSource={{
              uri: event.imageUrl
            }}
            imageStyle={{
              width: '100%',
              height: 200,
            }}
          />

          <View padding-20>
            <Text text50 $textDefault>
              {event.name}
            </Text>
            <View row>
              <Text text70 $textDefault>{formatDate(new Date(event.startDate))} | </Text>
              <Text text70 color={Colors.$textMajor}>
                {event.organizer}
              </Text>
            </View>

            <Text text70 $textDefault>
              {event.address}
            </Text>

            <Text text70 color={Colors.$textSuccess}>
              $200
            </Text>
          </View>
        </Card>
      );
    });
  };

  return (
    <View style={{ backgroundColor: 'white', height: '100%', }}>
      {
        isFetchingEvents ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <LoaderScreen message={'Fetching events'} color={Colors.grey40} />
          </View> :
          <ScrollView>
            <View flex padding-20>
              {renderEvents()}
            </View>
          </ScrollView>
      }
    </View>
  );
}