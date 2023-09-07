import _ from 'lodash';
import { useEffect, useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Text, View, Card, Colors, CardProps, Button, LoaderScreen } from 'react-native-ui-lib';
import { Event, getEventsFromRequest } from '../models/event';

export default function ManageEventsScreen({ navigation }) {

  const [isFetchingEvents, setIsFetchingEvents] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);

  const getMovies = async () => {
    try {
      const response = await fetch('https://troptix-backend.vercel.app/api/get-events');
      const json = await response.json();
      setEvents(getEventsFromRequest(json));
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingEvents(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  function formatDate(date: Date) {
    return date.toDateString();
  }

  function onEventClick(event) {
    navigation.navigate('ManageEventScreen', {
      event: event
    })
  }

  function renderEvents() {
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
              {/* {event.price} */}
            </Text>
          </View>
        </Card>
      );
    });
  };

  return (
    <View style={{ height: '100%', backgroundColor: 'white' }}>
      {
        isFetchingEvents ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <LoaderScreen message={'Fetching events'} color={Colors.grey40} />
          </View>
          :
          <ScrollView>
            <View flex padding-20>
              {renderEvents()}
            </View>
          </ScrollView>
      }
    </View>
  );
}