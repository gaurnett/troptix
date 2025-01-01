import { TropTixContext } from '@/components/WebNavigator';
import { Spinner } from '@/components/ui/spinner';
import { RequestType, useFetchEventsById } from '@/hooks/useFetchEvents';
import Link from 'next/link';
import * as React from 'react';
import { useContext } from 'react';
import ManageEventCard from '../../../components/ManageEventCard';

export default function ManageEventsPage() {
  const { user } = useContext(TropTixContext);

  const { isPending, isError, data, error } = useFetchEventsById({
    requestType: RequestType.GET_EVENTS_BY_ORGANIZER,
    jwtToken: user.jwtToken,
    id: user.id,
  });

  return (
    <div className="w-full md:max-w-2xl">
      {!isPending ? (
        <div className="flex flex-wrap">
          {data.map((event, index: any) => {
            return (
              <div
                key={index}
                className="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 px-2 mb-4"
              >
                <Link
                  href={{
                    pathname: '/admin/manage-event',
                    query: { eventId: event.id },
                  }}
                >
                  <ManageEventCard
                    event={event}
                    showDivider={index < data.length - 1}
                  />
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-8">
          <Spinner text={'Fetching Events'} />
        </div>
      )}
    </div>
  );
}
