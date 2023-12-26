import { format } from 'date-fns';
import { Image } from 'expo-image';
import _ from 'lodash';
import { useCallback, useContext, useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { Card, Colors, LoaderScreen, Text, View } from 'react-native-ui-lib';
import { TropTixContext } from '../App';
import { RequestType, useFetchEventsById } from '../hooks/useFetchEvents';

export default function ScanEventsScreen({ navigation }) {
  const { user } = useContext(TropTixContext);
  const userId = user === null || user === undefined ? null : user.id;
  const [refreshing, setRefreshing] = useState(false);

  const { isLoading, isError, data, error } = useFetchEventsById({
    requestType: RequestType.GET_EVENTS_SCANNABLE_BY_ORGANIZER,
    id: userId,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
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
    return _.map(data, (event, i) => {
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
            <View style={{ width: '85%', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ display: 'flex', flexDirection: 'column' }}>
                <Text style={{ fontWeight: 'bold' }} text70 $textDefault>
                  {event.name}
                </Text>
                <Text numberOfLines={1} text70 $textDefault>
                  {event.address}
                </Text>
                <Text text70 $textDefault>
                  {getDateFormatted(new Date(event.startDate), new Date(event.startTime))}
                </Text>
              </View>
            </View>
          </View>
        </Card>
      );
    });
  };

  return (
    <View style={{ height: '100%', backgroundColor: 'white' }}>
      {
        isLoading ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <LoaderScreen message={'Fetching scannable events'} color={Colors.grey40} />
          </View>
          :
          <View>
            {
              data.length === 0 ?
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