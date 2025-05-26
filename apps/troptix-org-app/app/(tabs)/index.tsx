import { RequestType, useFetchEventsById } from '@/hooks/useFetchEvents';
import { format } from 'date-fns';
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../_layout';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const { isLoading, isError, data, error } = useFetchEventsById({
    requestType: RequestType.GET_EVENTS_SCANNABLE_BY_ORGANIZER,
    id: user?.uid,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setRefreshing(false);
  }, []);

  function getDateFormatted(date, time) {
    return format(date, 'MMM dd, yyyy') + ' at ' + format(time, 'hh:mm a');
  }

  function Card(event) {
    return (
      <View style={styles.cardContainer}>
        <Link href={`/event/${event.id}`}>
          <View style={styles.card}>
            <Image source={{ uri: event.imageUrl }} style={styles.image} />
            <View style={styles.detailsContainer}>
              <Text style={styles.title}>{event.name}</Text>
              <Text style={styles.info}>
                {getDateFormatted(
                  new Date(event.startDate),
                  new Date(event.startTime)
                )}{' '}
                | <Text style={styles.organizer}>{event.organizer}</Text>
              </Text>
              <Text style={styles.location}>
                {event.venue}, {event.address}
              </Text>
            </View>
          </View>
        </Link>
      </View>
    );
  }

  if (isLoading || !data) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ height: '100%', backgroundColor: 'white' }}>
      <View>
        {data.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
            }}
          >
            <Text>No events scannable</Text>
          </View>
        ) : (
          <View style={{ height: '100%' }}>
            <FlatList
              data={data}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                return <Card {...item} />;
              }}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  card: {
    width: '100%',
    borderWidth: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsContainer: {
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  info: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  organizer: {
    color: '#7B2CFF',
    fontWeight: '500',
  },
  location: {
    fontSize: 14,
    color: '#555',
  },
  image: {
    width: '100%',
    height: 150,
  },
});
