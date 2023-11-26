import { Button, Spin, Typography } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getEvents, GetEventsType } from "troptix-api";
import { MdLocationOn } from "react-icons/md";
import { format } from "date-fns";
import { IoTicket } from "react-icons/io5";
import { Elements } from "@stripe/react-stripe-js";
import TicketDrawer from "@/components/pages/event/ticket-drawer";
import TicketModal from "@/components/pages/event/ticket-modal";
import { RequestType, useFetchEventsById } from "@/hooks/useFetchEvents";
const { Paragraph } = Typography;

export default function EventDetailPage() {
  const googleMapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const router = useRouter();
  const eventId = router.query.eventId as string;
  const [isFetchingEvent, setIsFetchingEvent] = useState(true);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [showLocationPin, setShowLocationPin] = useState(false);
  const [width, setWidth] = useState<number>(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;

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

  const handleCancel = () => {
    setIsTicketModalOpen(false);
  };

  function openModal() {
    setIsTicketModalOpen(true);
  }

  return (
    <>
      {isPending ? (
        <div className="">
          <div className={`max-w-4xl mx-auto p-4 sm:p-8`}>
            <Spin className="mt-32" tip="Fetching Event" size="large">
              <div className="content" />
            </Spin>
          </div>
        </div>
      ) : (
        <div
          style={{
            backgroundImage: `url("${event.imageUrl ??
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
              setIsTicketModalOpen={setIsTicketModalOpen}
              handleCancel={handleCancel}
            />
          ) : (
            <TicketModal
              event={event}
              isTicketModalOpen={isTicketModalOpen}
              setIsTicketModalOpen={setIsTicketModalOpen}
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
                    src={
                      event.imageUrl ??
                      "https://placehold.co/600x600.png?text=Add+Event+Flyer"
                    }
                    alt={event.name}
                    className="mb-8 max-h-full flex-shrink-0 self-center object-fill overflow-hidden rounded-lg"
                  />
                  <Button
                    type="primary"
                    onClick={openModal}
                    className="w-full px-6 py-6 shadow-md items-center bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex"
                    icon={<IoTicket />}
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
                    <div className="text-xl font-extrabold">{event.venue}</div>
                    <div className="text-xl text-blue-500">
                      {getDateFormatter(
                        new Date(event.startDate)
                      )}
                    </div>
                    <div className="text-xl">{event.organizer}</div>
                  </div>

                  <div>
                    <h2
                      className="text-xl font-bold leading-tighter tracking-tighter mt-4"
                      data-aos="zoom-y-out"
                    >
                      About
                    </h2>
                    <div className="">
                      Starts:{" "}
                      {getDateFormatter(
                        new Date(event.startDate)
                      )}
                    </div>
                    <div className="">
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
                      className="mt-2 text-justify"
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
                    <div className="text-3xl font-extrabold">{event.venue}</div>
                    <div className="text-xl ">{event.address}</div>
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
                            console.log("Loaded");
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
      )}
    </>
  );
}
