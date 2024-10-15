import { TropTixContext } from '@/components/WebNavigator';
import TicketDrawer from '@/components/pages/event/ticket-drawer';
import TicketModal from '@/components/pages/event/ticket-modal';
import { ButtonWithIcon } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  DividerWithText,
  TypographyH1,
  TypographyH4,
  TypographyP,
} from '@/components/ui/typography';
import { MetaHead } from '@/components/utils/MetaHead';
import { useEvent } from '@/hooks/useEvents';
import { RequestType, eventFetcher } from '@/hooks/useFetchEvents';
import { useScreenSize } from '@/hooks/useScreenSize';

import { Typography } from 'antd';
import {
  getDateRangeFormatter,
  getFormattedCurrency,
  getTimeRangeFormatter,
} from '@/lib/utils';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

import { Calendar, DollarSign, MapPin, Ticket } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { IoTicket } from 'react-icons/io5';
import { useContext, useState } from 'react';

const { Paragraph } = Typography;

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const events = await eventFetcher({
    requestType: RequestType.GET_EVENTS_ALL,
  });

  // Get the paths we want to pre-render based on posts
  const paths = events.map((event) => ({
    params: { id: event.id },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: 'blocking' };
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  const { id } = params;
  const event = await eventFetcher({
    requestType: RequestType.GET_EVENTS_BY_ID,
    id: id,
  });

  return {
    props: {
      event,
    },
    revalidate: 60,
  };
}

export default function EventDetailPage(props) {
  const googleMapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const router = useRouter();
  const { user } = useContext(TropTixContext);
  const eventId = router.query.id as string;
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const { isMobile } = useScreenSize();
  const { isPending, data: event } = useEvent(eventId, props.event);

  function handleCancel() {
    console.log('Hello World 2');
    setIsTicketModalOpen(false);
  }

  function openModal() {
    setIsTicketModalOpen(true);
  }

  if (isPending || !event) {
    return (
      <div className="mt-32">
        <Spinner text={'Fetching Event'} />
      </div>
    );
  }

  let lowest = Number.MAX_VALUE;
  let priceString = '';
  if (!event.ticketTypes || event.ticketTypes.length === 0) {
    priceString = 'No tickets available';
  } else {
    event.ticketTypes.forEach((ticket) => {
      const price = ticket.price;
      if (price < lowest) {
        lowest = price;
      }
    });

    priceString = 'From ' + getFormattedCurrency(lowest) + ' USD';
  }

  return (
    <>
      <MetaHead
        title={event.name}
        description={event.organizer}
        image={event.imageUrl}
        url={undefined}
      />
      <div
        style={{
          // backgroundColor: '#455A64',
          backgroundImage: `url("${
            event?.imageUrl ??
            'https://placehold.co/400x400?text=Add+Event+Flyer'
          }")`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          WebkitBackgroundSize: 'cover',
        }}
      >
        {isMobile ? (
          <TicketDrawer
            event={event}
            isTicketModalOpen={isTicketModalOpen}
            handleCancel={handleCancel}
          />
        ) : (
          <TicketModal
            event={event}
            isTicketModalOpen={isTicketModalOpen}
            handleCancel={handleCancel}
          />
        )}
        <div className="w-full md:min-h-screen flex backdrop-blur-3xl">
          <div className={`max-w-5xl mx-auto p-4 sm:p-8`}>
            <div className="md:flex mt-32">
              <aside className="md:sticky md:top-0 mb-8 ">
                <Image
                  height={500}
                  width={500}
                  style={{
                    maxHeight: 350,
                    maxWidth: 350,
                    objectFit: 'fill',
                  }}
                  src={
                    event.imageUrl ??
                    'https://placehold.co/600x600.png?text=Add+Event+Flyer'
                  }
                  alt={event.name}
                  className="mb-8 max-h-full flex-shrink-0 self-center object-fill overflow-hidden rounded-lg mx-auto"
                />
                <ButtonWithIcon
                  text={'Buy Tickets'}
                  icon={<Ticket className="mr-2 h-4 w-4" />}
                  onClick={openModal}
                  className={'w-full px-6 py-6 text-base'}
                />
              </aside>
              <div className="w-full md:mx-8 md:p-6 p-4 bg-gray-800 bg-opacity-80 rounded-lg ">
                <div className="mb-4">
                  <TypographyH1 text={event.name} classes="mb-4 text-white" />
                  <div className="flex items-center mb-2">
                    <div className="mr-4">
                      <div className="border border-white rounded border-spacing-1 w-min my-auto">
                        <Calendar className="m-2 w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <TypographyH4
                        text={getDateRangeFormatter(
                          new Date(event.startDate),
                          new Date(event.endDate)
                        )}
                        classes="text-white"
                      />
                      <TypographyP
                        text={getTimeRangeFormatter(
                          new Date(event.startDate),
                          new Date(event.endDate)
                        )}
                        classes="text-white"
                      />
                    </div>
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="mr-4">
                      <div className="border border-white rounded border-spacing-1 w-min my-auto">
                        <MapPin className="m-2 w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <TypographyH4 text={event.venue} classes="text-white" />
                      <TypographyP text={event.address} classes="text-white" />
                    </div>
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="mr-4">
                      <div className="border border-white rounded border-spacing-1 w-min my-auto">
                        <DollarSign className="m-2 w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <TypographyH4 text={'Tickets'} classes="text-white" />
                      <TypographyP text={priceString} classes="text-white" />
                    </div>
                  </div>

                  <div className="text-xl font-extrabold text-white">
                    by {event.organizer}
                  </div>
                </div>

                <div>
                  <DividerWithText text={'About'} classes="text-white" />
                  <Paragraph
                    style={{ whiteSpace: 'pre-line' }}
                    className="mt-2 text-justify text-base text-white"
                    ellipsis={{
                      rows: 4,
                      expandable: true,
                      symbol: 'see more details',
                    }}
                  >
                    {event.description}
                  </Paragraph>
                </div>

                <div>
                  <DividerWithText text={'Venue'} classes="text-white" />
                  <TypographyH4 text={event.venue} classes="text-white" />
                  <TypographyP text={event.address} classes="text-white" />
                  <APIProvider apiKey={googleMapsKey!}>
                    <Map
                      className="mt-4 w-full h-60"
                      defaultCenter={{
                        lat: event.latitude,
                        lng: event.longitude,
                      }}
                      defaultZoom={15}
                      gestureHandling={'none'}
                      disableDefaultUI={true}
                    >
                      <Marker
                        position={{
                          lat: event.latitude,
                          lng: event.longitude,
                        }}
                      />
                    </Map>
                  </APIProvider>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
