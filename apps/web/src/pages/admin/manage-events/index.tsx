
import EventCard from '@/components/EventCard';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Event, getEventsFromRequest } from 'troptix-models';
import { TropTixResponse, getEvents, GetEventsRequest, GetEventsType } from 'troptix-api';
import { TropTixContext } from '@/components/WebNavigator';
import Link from 'next/link';

export default function ManageEventsPage() {
  const router = useRouter();
  const { user } = useContext(TropTixContext);
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

      if (response !== undefined && response.length !== 0) {
        setEvents(getEventsFromRequest(response));
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

  function onChange(key: string) {
    console.log(key);
  }

  return (
    <div className="w-full md:max-w-5xl mx-auto">
      <div className="mx-4">
        <h1 className="text-center text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out"><span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-teal-400">Manage Events</span></h1>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16 mt-8">
          {!isFetchingEvents
            ? events.map((event, index: number) => {
              return (
                <Link href={{ pathname: "/admin/manage-event", query: { eventId: event.id } }} key={index} >
                  <EventCard
                    image={event.imageUrl}
                    eventName={event.name}
                    date={""}
                    location={event.address}
                    price={""}
                  />
                </Link>
              );
            })
            : null}
        </div>
      </div>

    </div>
  );
}