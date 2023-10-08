import _ from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Text, View, Card, Colors, CardProps, Button, LoaderScreen, FloatingButton, FloatingButtonLayouts } from 'react-native-ui-lib';
import { Event, getEventsFromRequest } from 'troptix-models';
import { TropTixResponse, getEventsForOrganizer } from 'troptix-api';
import { TropTixContext } from '../App';

export default function ManageEventsScreen({ navigation }) {
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
          <Card.Section
            contentStyle={{
              // flex: 1,
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
    <View style={{ flex: 1, height: '100%', backgroundColor: 'white' }}>
      {
        isFetchingEvents ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <LoaderScreen message={'Fetching events'} color={Colors.grey40} />
          </View>
          :
          <View>
            <View style={{ height: "100%" }}>
              <ScrollView>
                <View padding-20>
                  {renderEvents()}
                </View>
              </ScrollView>
            </View>
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