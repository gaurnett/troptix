import { RequestType, useFetchEventsById } from '@/hooks/useFetchEvents';
import { format } from 'date-fns';
import { Link, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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

  return (
    <View style={{ height: '100%', backgroundColor: 'white' }}>
      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text>Loading...</Text>
        </View>
      ) : (
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
                renderItem={({ item }) => (
                  <Link
                    href={{
                      pathname: '/event/details',
                      params: { event: item },
                    }}
                  >
                    <View style={styles.card}>
                      <Image
                        source={{ uri: item.imageUrl }}
                        style={styles.image}
                      />
                      <View style={styles.details}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.name}>{item.venue}</Text>
                        <Text style={styles.name}>{item.address}</Text>
                        <Text style={styles.date}>
                          {getDateFormatted(
                            new Date(item.startDate),
                            new Date(item.startTime)
                          )}
                        </Text>
                      </View>
                    </View>
                  </Link>
                )}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  details: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginBottom: 6,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
});
