
import EventCard from '@/components/EventCard';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Event, getEventsFromRequest } from 'troptix-models';
import { TropTixResponse, getEvents, GetEventsRequest, GetEventsType } from 'troptix-api';
import { TropTixContext } from '@/components/WebNavigator';
import Link from 'next/link';
import { Spin } from 'antd';

export default function ManageEventsPage() {
  const router = useRouter();
  const { user } = useContext(TropTixContext);
  const userId = user === null || user === undefined ? null : user.id;
  const [isFetchingEvents, setIsFetchingEvents] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      if (!userId) {
        setIsFetchingEvents(false);
        return;
      }

      const getEventsRequest: any = {
        getEventsType: GetEventsType.GET_EVENTS_BY_ORGANIZER,
        organizerId: userId
      }
      const response: any = await getEvents(getEventsRequest);

      if (response !== undefined && response.length !== 0) {
        setEvents(getEventsFromRequest(response));
      }

      console.log("ManageEventsScreen [fetchEvents]: " + response)

      setIsFetchingEvents(false);
    };

    fetchEvents();
  }, [userId]);

  return (
    <div className="w-full md:max-w-5xl mx-auto">
      <div className="mx-4">
        <h1 className="text-center text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out"><span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-teal-400">Manage Events</span></h1>
        {!isFetchingEvents
          ?
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16 mt-8">
            {
              events.map((event, index: number) => {
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
            }

          </div>
          :
          <Spin className="mt-16" tip="Fetching Events" size="large">
            <div className="content" />
          </Spin>}
      </div>

    </div>
  );
}