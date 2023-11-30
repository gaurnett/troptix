import { TropTixContext } from "@/components/WebNavigator";
import TicketDrawer from "@/components/pages/event/ticket-drawer";
import TicketModal from "@/components/pages/event/ticket-modal";
import { Spinner } from "@/components/ui/spinner";
import { RequestType, useFetchEventsById } from "@/hooks/useFetchEvents";
import { getFormattedCurrency } from "@/lib/utils";
import { Button, Modal, Result, Typography } from "antd";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { IoTicket } from "react-icons/io5";
const { Paragraph } = Typography;

export default function EventDetailPage() {
  const googleMapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const { user } = useContext(TropTixContext);
  const router = useRouter();
  const eventId = router.query.eventId as string;
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768
  );

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }

    if (typeof window !== 'undefined') {
      handleResize();
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  const {
    isPending,
    isError,
    data: event,
    error,
  } = useFetchEventsById({
    requestType: RequestType.GET_EVENTS_BY_ID,
    id: eventId,
  });

  function getDateFormatter(date) {
    return `${format(date, "MMM dd, yyyy")} @ ${format(date, "hh:mm a")}`;
  }

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

  if (isPending) {
    return (
      <div className="mt-32">
        <Spinner text={"Fetching Event"} />
      </div>
    )
  }

  let lowest = Number.MAX_VALUE;
  let priceString = "";
  if (!event.ticketTypes || event.ticketTypes.length === 0) {
    priceString = "No tickets available";
  } else {
    event.ticketTypes.forEach((ticket) => {
      const price = ticket.price;
      if (price < lowest) {
        lowest = price;
      }
    });

    priceString = "From " + getFormattedCurrency(lowest);
  }

  return (
    <div
      style={{
        backgroundImage: `url("${event?.imageUrl ??
          "https://placehold.co/400x400?text=Add+Event+Flyer"
          }")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        WebkitBackgroundSize: "cover",
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
            <Link
              href={{ pathname: "/auth/signin" }}
              key={"tickets"}>
              <Button
                className="mr-2 px-6 py-6 shadow-md items-center justify-center font-medium inline-flex">
                Log in
              </Button>
            </Link>,
            <Link
              href={{ pathname: "/auth/signup" }}
              key={"tickets"}>
              <Button
                type='primary'
                className="bg-blue-600 hover:bg-blue-700 mr-2 px-6 py-6 shadow-md items-center justify-center font-medium inline-flex">
                Sign up
              </Button>
            </Link>
          ]
          }
        />
      </Modal>
      <div className="w-full md:min-h-screen flex backdrop-blur-3xl">
        <div className={`max-w-5xl mx-auto p-4 sm:p-8`}>
          <div className="md:flex mt-32">
            <aside className="md:sticky md:top-0 mb-8 ">
              <Image
                height={500}
                width={500}
                src={
                  event.imageUrl ??
                  "https://placehold.co/600x600.png?text=Add+Event+Flyer"
                }
                alt={event.name}
                className="mb-8 max-h-full flex-shrink-0 self-center object-fill overflow-hidden rounded-lg"
              />
              {
                user ?
                  <Button
                    type="primary"
                    onClick={openModal}
                    className="w-full px-6 py-6 shadow-md items-center text-base bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex"
                    icon={<IoTicket className='text-base' />}>
                    Buy Tickets
                  </Button>
                  :
                  <div className="w-5/6 md:w-full mx-auto bg-white bg-opacity-80 py-4 rounded-lg">
                    <div className="text-center text-base font-extrabold">You must have a TropTix account to purchase tickets.</div>
                    <div className="flex mx-auto text-center mt-4">
                      <div className="w-full ml-4 mr-2">
                        <Link
                          className=""
                          href={{ pathname: "/auth/signin" }}
                          key={"tickets"}>
                          <Button
                            className="w-full p-5 shadow-md items-center justify-center font-medium inline-flex">
                            Log in
                          </Button>
                        </Link>
                      </div>
                      <div className="w-full mr-4 ml-2">
                        <Link
                          href={{ pathname: "/auth/signup" }}
                          key={"tickets"}>
                          <Button
                            type='primary'
                            className="w-full bg-blue-600 hover:bg-blue-700 p-5 shadow-md items-center justify-center font-medium inline-flex">
                            Sign up
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
              }


            </aside>
            <div className="w-full md:ml-8 bg-white bg-opacity-80 p-6 rounded-lg">
              <div className="mb-8">
                <h1
                  className="text-5xl md:text-5xl font-bold leading-tighter tracking-tighter mb-8"
                  data-aos="zoom-y-out"
                >
                  {event.name}
                </h1>
                <div className="text-xl font-extrabold">{event.organizer}</div>
                <div className="text-xl">{event.venue}</div>
                <div className="text-xl text-blue-500">
                  {getDateFormatter(
                    new Date(event.startDate)
                  )}
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
                  Starts:{" "}
                  {getDateFormatter(
                    new Date(event.startDate)
                  )}
                </div>
                <div className="text-base">
                  Ends:{" "}
                  {getDateFormatter(
                    new Date(event.endDate)
                  )}
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
                  className="mt-2 text-justify text-base"
                  ellipsis={{
                    rows: 2,
                    expandable: true,
                    symbol: "see more details",
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
  );
}
