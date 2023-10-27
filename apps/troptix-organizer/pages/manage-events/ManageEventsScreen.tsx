import _ from 'lodash';
import { useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, View, Card, Colors, CardProps, Button, LoaderScreen, FloatingButton, FloatingButtonLayouts } from 'react-native-ui-lib';
import { Event, getEventsFromRequest } from 'troptix-models';
import { TropTixResponse, getEvents, GetEventsRequest, GetEventsType } from 'troptix-api';
import { TropTixContext } from '../../App';
import { Image } from 'expo-image';

export default function ManageEventsScreen({ navigation }) {
  const [user, setUser] = useContext(TropTixContext);
  const [isFetchingEvents, setIsFetchingEvents] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = async () => {
    try {
      const getEventsRequest: GetEventsRequest = {
        getEventsType: GetEventsType.GET_EVENTS_BY_ORGANIZER,
        organizerId: user.id
      }
      const response: TropTixResponse = await getEvents(getEventsRequest);

      if (response.response !== undefined && response.response.length !== 0) {
        setEvents(getEventsFromRequest(response.response));
      }
    } catch (error) {
      console.log("ManageEventsScreen [fetchEvents] error: " + error)
    }

    setIsFetchingEvents(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  }, []);

  function formatDate(date: Date) {
    return date.toDateString();
  }

  function onEventClick(event) {
    navigation.navigate('ManageEventScreen', {
      event: event
    })
  }

  function openAddEvents() {
    navigation.navigate('AddEventScreen', {
      eventObject: undefined
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
              {/* {event.price} */}
            </Text>
          </View>
        </Card>
      );
    });
  };

  return (
    <View style={{ flex: 1, height: '100%', backgroundColor: 'white' }}>
      {
        isFetchingEvents ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <LoaderScreen message={'Fetching events'} color={Colors.grey40} />
          </View>
          :
          <View>
            {
              events.length === 0 ?
                <View style={{ alignItems: 'center', justifyContent: 'center', height: "100%", width: "100%" }}>
                  <Image source={require('../../assets/icons/empty-events.png')} width={120} height={120} />
                  <Text marginT-24 style={{ fontSize: 24 }}>No events managed</Text>
                </View>
                :
                <View style={{ height: "100%" }}>
                  <ScrollView
                    refreshControl={
                      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }>
                    <View padding-20>
                      {renderEvents()}
                    </View>
                  </ScrollView>
                </View>
            }
            <View>
              <FloatingButton
                visible={true}
                button={{
                  label: 'Add Event',
                  onPress: openAddEvents
                }}
                buttonLayout={FloatingButtonLayouts.HORIZONTAL}
                bottomMargin={16}
              />
            </View>
          </View>
      }
    </View>
  );
}