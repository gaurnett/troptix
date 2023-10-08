import _ from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Text, View, Card, Colors, CardProps, Button } from 'react-native-ui-lib';
import events from '../data/events';
import { TropTixResponse, getEventsForOrganizer } from 'troptix-api';
import { TropTixContext } from '../App';
import { Event, getEventsFromRequest } from 'troptix-models';

export default function ScanEventsScreen({ navigation }) {
  const [user, setUser] = useContext(TropTixContext);
  const [isFetchingEvents, setIsFetchingEvents] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = async () => {
    try {
      const response: TropTixResponse = await getEventsForOrganizer(user.id);

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

  function onEventClick(event) {
    navigation.navigate('ScanEventScreen', {
      event: event
    })
  }

  function renderEvents() {
    return _.map(events, (event, i) => {
      return (
        <Card
          borderRadius={5}
          // enableShadow={false}
          row
          height={120}
          style={{ marginBottom: 16 }}
          key={i}
          onPress={() => onEventClick(event)}
        >
          <View style={{ height: '100%' }}>
            <Card.Section
              imageSource={{
                uri: event.imageUrl
              }}
              imageStyle={{
                width: 115,
                height: 120,
              }}
            />
          </View>

          <View style={{ justifyContent: 'center', alignItems: 'center' }} marginL-12>
            <View >
              <Text text60 $textDefault>
                {event.name}
              </Text>

              <Text text70 $textDefault>
                {new Date(event.startDate).toDateString()} at 8PM
              </Text>
            </View>
          </View>
        </Card>
      );
    });
  };

  return (
    <View style={{ height: '100%', backgroundColor: 'white' }}>
      <ScrollView>
        <View flex padding-20>
          {renderEvents()}
        </View>
      </ScrollView>
    </View>
  );
}