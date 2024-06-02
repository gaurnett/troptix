import { TropTixContext } from '@/components/WebNavigator';
import { Spinner } from '@/components/ui/spinner';
import { RequestType, useFetchEventsById } from '@/hooks/useFetchEvents';
import { List } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';

export default function ManageEventsPage() {
  const { user } = useContext(TropTixContext);

  const { isPending, isError, data, error } = useFetchEventsById({
    requestType: RequestType.GET_EVENTS_BY_ORGANIZER,
    jwtToken: user.jwtToken,
    id: user.id,
  });

  return (
    <div className='w-full md:max-w-2xl'>
      {!isPending ? (
        <div className="gap-8 pb-16">
          <List
            itemLayout="vertical"
            size="large"
            dataSource={data}
            renderItem={(event: any) => (
              <List.Item className='xs:w-full md:w-80'>
                <Link
                  key={event.id}
                  href={{
                    pathname: '/admin/manage-event',
                    query: { eventId: event.id },
                  }}
                >
                  <div className="border rounded-xl">
                    <Image
                      width={110}
                      height={110}
                      className="w-auto rounded-t-xl"
                      style={{
                        objectFit: 'cover',
                        width: 350,
                        height: 250,
                      }}
                      src={
                        event.imageUrl !== null
                          ? event.imageUrl
                          : 'https://placehold.co/400x400?text=Add+Event+Flyer'
                      }
                      alt={'event flyer image'}
                    />
                    <div className="m-2">
                      <div className="font-bold text-xl">{event.name}</div>
                      <div className="text-base">{event.address}</div>
                      <div className="text-blue-500 text-base">
                        {new Date(event.startDate).toDateString()}
                      </div>
                      <div
                        className={`${event.isDraft ? 'text-amber-900' : 'text-green-600'} text-amber-900 text-base`}
                      >
                        Status: {event.isDraft ? 'Draft' : 'Published'}
                      </div>
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
  );
}
