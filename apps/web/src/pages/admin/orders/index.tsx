import { TropTixContext } from '@/components/WebNavigator';
import { Spinner } from '@/components/ui/spinner';
import { List } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { GetEventsType, getEvents } from 'troptix-api';
import { getEventsFromRequest } from 'troptix-models';

export default function OrdersPage() {
  const { user } = useContext(TropTixContext);
  const userId = user === null || user === undefined ? null : user.id;
  const [isFetchingEvents, setIsFetchingEvents] = useState(true);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      if (!userId) {
        setIsFetchingEvents(false);
        return;
      }

      const getEventsRequest: any = {
        getEventsType: GetEventsType.GET_EVENTS_BY_ORGANIZER,
        organizerId: userId,
      };
      const response: any = await getEvents(getEventsRequest);

      if (response !== undefined && response.length !== 0) {
        setEvents(getEventsFromRequest(response));
      }

      setIsFetchingEvents(false);
    }

    fetchEvents();
  }, [userId]);

  return (
    <div className="w-full md:max-w-2xl mx-auto">
      <div className="mx-4">
        <h1
          className="text-center text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4"
          data-aos="zoom-y-out"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-teal-400">
            Manage Events
          </span>
        </h1>
        {!isFetchingEvents ? (
          <div className="gap-8 pb-16 mt-8">
            <List
              itemLayout="vertical"
              size="large"
              dataSource={events}
              renderItem={(event: any) => (
                <List.Item>
                  <Link
                    key={event.id}
                    href={{
                      pathname: '/admin/manage-event',
                      query: { eventId: event.id },
                    }}
                  >
                    <div className="flex">
                      <div>
                        <Image
                          width={75}
                          height={75}
                          className="w-auto"
                          style={{ objectFit: 'cover' }}
                          src={
                            event.imageUrl !== null
                              ? event.imageUrl
                              : 'https://placehold.co/400x400?text=Add+Event+Flyer'
                          }
                          alt={'event flyer image'}
                        />
                      </div>
                      <div className="ml-4 my-auto">
                        <div>{event.name}</div>
                        <div>{event.address}</div>
                        <div>{new Date(event.startDate).toDateString()}</div>
                      </div>
                    </div>
                  </Link>
                </List.Item>
              )}
            />
          </div>
        ) : (
          <div className="mt-8">
            <Spinner text={'Fetching Events'} />
          </div>
        )}
      </div>
    </div>
  );
}
