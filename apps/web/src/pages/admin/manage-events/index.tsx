import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import * as React from 'react';
import ManageEventCard from '../../../components/ManageEventCard';
import { useEvents } from '@/hooks/useEvents';

export default function ManageEventsPage() {
  const { isPending, isError, data } = useEvents({
    byOrganizerId: true,
  });

  return (
    <div className="w-full md:max-w-2xl">
      {!isPending && !isError ? (
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
