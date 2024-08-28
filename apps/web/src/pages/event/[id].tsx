import { TropTixContext } from '@/components/WebNavigator';
import TicketDrawer from '@/components/pages/event/ticket-drawer';
import TicketModal from '@/components/pages/event/ticket-modal';
import { Spinner } from '@/components/ui/spinner';
import { MetaHead } from '@/components/utils/MetaHead';
import { useEvent } from '@/hooks/useEvents';
import {
  RequestType,
  eventFetcher,
  useFetchEventsById,
} from '@/hooks/useFetchEvents';
import { useScreenSize } from '@/hooks/useScreenSize';
import { getDateFormatter, getFormattedCurrency } from '@/lib/utils';
import { Button, Modal, Result, Typography } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { IoTicket } from 'react-icons/io5';
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
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const { isMobile } = useScreenSize();
  const {
    isPending,
    isError,
    data: event,
    error,
  } = useEvent(eventId, props.event);

  function closeSignInModal() {
    setIsSignInModalOpen(false);
  }

  const handleCancel = () => {
    setIsTicketModalOpen(false);
  };

  function openModal() {
    if (!user) {
      setIsSignInModalOpen(true);
      return;
    }

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
        <Modal
          open={isSignInModalOpen}
          title=""
          centered
          onCancel={closeSignInModal}
          okButtonProps={{ hidden: true }}
          cancelButtonProps={{ hidden: true }}
        >
          <Result
            title="Please log in/sign up to buy tickets"
            extra={[
              <Link href={{ pathname: '/auth/signin' }} key={'tickets'}>
                <Button className="mr-2 px-6 py-6 shadow-md items-center justify-center font-medium inline-flex">
                  Log in
                </Button>
              </Link>,
              <Link href={{ pathname: '/auth/signup' }} key={'tickets'}>
                <Button
                  type="primary"
                  className="bg-blue-600 hover:bg-blue-700 mr-2 px-6 py-6 shadow-md items-center justify-center font-medium inline-flex"
                >
                  Sign up
                </Button>
              </Link>,
            ]}
          />
        </Modal>
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
                <Button
                  type="primary"
                  onClick={openModal}
                  className="w-full px-6 py-6 shadow-md items-center text-base bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex"
                  icon={<IoTicket className="text-base" />}
                >
                  Buy Tickets
                </Button>
              </aside>
              <div className="w-full md:ml-8 bg-white bg-opacity-80 p-6 rounded-lg">
                <div className="mb-8">
                  <h1
                    className="text-5xl md:text-5xl font-bold leading-tighter tracking-tighter mb-8"
                    data-aos="zoom-y-out"
                  >
                    {event.name}
                  </h1>
                  <div className="text-xl font-extrabold">
                    {event.organizer}
                  </div>
                  <div className="text-xl">{event.venue}</div>
                  <div className="text-xl text-blue-500">
                    {getDateFormatter(new Date(event.startDate))}
                  </div>
                  <div className="text-xl text-green-600">{priceString}</div>
                </div>

                <div>
                  <h2
                    className="text-xl font-bold leading-tighter tracking-tighter mt-4"
                    data-aos="zoom-y-out"
                  >
                    About
                  </h2>
                  <div className="text-base">
                    Starts: {getDateFormatter(new Date(event.startDate))}
                  </div>
                  <div className="text-base">
                    Ends: {getDateFormatter(new Date(event.endDate))}
                  </div>
                </div>

                <div>
                  <h2
                    className="text-xl font-bold leading-tighter tracking-tighter mt-4"
                    data-aos="zoom-y-out"
                  >
                    Description
                  </h2>
                  <Paragraph
                    style={{ whiteSpace: 'pre-line' }}
                    className="mt-2 text-justify text-base"
                    ellipsis={{
                      rows: 2,
                      expandable: true,
                      symbol: 'see more details',
                    }}
                  >
                    {event.description}
                  </Paragraph>
                </div>

                <div>
                  <h2
                    className="text-xl font-bold leading-tighter tracking-tighter mt-4"
                    data-aos="zoom-y-out"
                  >
                    Venue
                  </h2>
                  <div className="text-base">{event.venue}</div>
                  <div className="text-base">{event.address}</div>
                  {/* <div style={{ height: 300 }} className="w-full h-150 mt-2">
                        <GoogleMapReact
                          bootstrapURLKeys={{ key: googleMapsKey }}
                          defaultCenter={{
                            lat: event.latitude,
                            lng: event.longitude
                          }}
                          defaultZoom={14}
                          yesIWantToUseGoogleMapApiInternals
                          onGoogleApiLoaded={({ map, maps }) => {
                            setShowLocationPin(true)
                          }
                          }
                        >
                          {
                            showLocationPin && (<div>hello</div>)
                          }
                          <MdLocationOn className="text-4xl" />
                        </GoogleMapReact>
                      </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
