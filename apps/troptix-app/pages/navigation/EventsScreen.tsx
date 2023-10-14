import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, View, Card, Colors, CardProps, Button, LoaderScreen } from 'react-native-ui-lib';
import { Event, getEventsFromRequest } from 'troptix-models';
import { TropTixResponse, getEvents, GetEventsType, GetEventsRequest } from 'troptix-api';
import { Image } from 'expo-image';

const cardImage = require('../../assets/favicon.png');

export default function EventsScreen({ navigation }) {

  const [isFetchingEvents, setIsFetchingEvents] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = async () => {
    const getEventsRequest: GetEventsRequest = {
      getEventsType: GetEventsType.GET_EVENTS_ALL
    }

    try {
      const response: TropTixResponse = await getEvents(getEventsRequest);
      if (response.response !== undefined) {
        setEvents(getEventsFromRequest(response.response));
      }
      console.log("[EventsScreen fetchEvents] response: " + response.response);
    } catch (error) {
      console.log("[EventsScreen fetchEvents] error: " + error);
    }

    setIsFetchingEvents(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
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
          <Image
            contentFit='cover'
            style={{
              height: 200,
              width: '100%'
            }}
            source={{
              uri: event.imageUrl
            }} />

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
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View flex padding-20>
              {renderEvents()}
            </View>
          </ScrollView>
      }
    </View>
  );
}
