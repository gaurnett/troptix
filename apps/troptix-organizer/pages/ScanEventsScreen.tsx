import _ from 'lodash';
import { useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, View, Card, Colors, CardProps, Button, LoaderScreen } from 'react-native-ui-lib';
import events from '../data/events';
import { TropTixResponse, getEvents, GetEventsRequest, GetEventsType } from 'troptix-api';
import { TropTixContext } from '../App';
import { Event, getEventsFromRequest } from 'troptix-models';
import { Image } from 'expo-image';
import { format } from 'date-fns'

export default function ScanEventsScreen({ navigation }) {
  const [user, setUser] = useContext(TropTixContext);
  const [isFetchingEvents, setIsFetchingEvents] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchScannableEvents = async () => {
    try {
      const getEventsRequest: GetEventsRequest = {
        getEventsType: GetEventsType.GET_EVENTS_SCANNABLE_BY_ORGANIZER,
        organizerId: user.id
      }
      const response: TropTixResponse = await getEvents(getEventsRequest);

      if (response.response !== undefined && response.response.length !== 0) {
        setEvents(getEventsFromRequest(response.response));
      }
    } catch (error) {
      console.log("ManageEventsScreen [fetchScannableEvents] error: " + error)
    }

    setIsFetchingEvents(false);
  };

  useEffect(() => {
    fetchScannableEvents();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchScannableEvents();
    setRefreshing(false);
  }, []);

  function onEventClick(event) {
    navigation.navigate('ScanEventScreen', {
      event: event
    })
  }

  function getDateFormatted(date, time) {
    return format(date, 'MMM dd, yyyy') + " at " + format(time, 'hh:mm a');
  }

  function renderEvents() {
    return _.map(events, (event, i) => {
      return (
        <Card
          borderRadius={5}
          row
          height={120}
          style={{ marginBottom: 16 }}
          key={i}
          onPress={() => onEventClick(event)}
        >
          <View style={{ height: '100%' }}>
            <Image
              contentFit='cover'
              style={{
                height: 120,
                width: 120
              }}
              source={{
                uri: event.imageUrl
              }} />
          </View>

          <View marginL-12>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ flex: 1, flexWrap: 'wrap', fontWeight: 'bold' }} text70 $textDefault>
                  {event.name}
                </Text>
              </View>

              <Text text70 $textDefault>
                {getDateFormatted(new Date(event.startDate), new Date(event.startTime))}
              </Text>
            </View>
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
            <LoaderScreen message={'Fetching scannable events'} color={Colors.grey40} />
          </View>
          :
          <View>
            {
              events.length === 0 ?
                <View style={{ alignItems: 'center', justifyContent: 'center', height: "100%", width: "100%" }}>
                  <Image source={require('../assets/icons/empty-scan.png')} width={120} height={120} />
                  <Text marginT-24 style={{ fontSize: 24 }}>No events scannable</Text>
                </View>
                :
                <View style={{ height: "100%" }}>
                  <ScrollView
                    refreshControl={
                      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }>
                    <View flex padding-20>
                      {renderEvents()}
                    </View>
                  </ScrollView>
                </View>
            }
          </View>
      }
    </View>
  );
}