import { TicketDetail } from "@/components/TicketDetail";
import { useFetchEvent } from "@/hooks/useFetchEvent";
import { List, Button, Popconfirm } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  TropTixResponse,
  getEvents,
  saveEvent,
  GetEventsRequest,
  GetEventsType,
} from "troptix-api";
import {
  GetTicketTypesType,
  GetTicketTypesRequest,
  getTicketTypes,
  saveTicketType,
} from "troptix-api";

export default function EventDetailPage() {
  const router = useRouter();
  const eventId = router.query.slug;
  const [event, setEvent] = useState<any>();
  const [isFetchingEvent, setIsFetchingEvent] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const getEventsRequest: any = {
          getEventsType: GetEventsType.GET_EVENTS_BY_ID,
          eventId: eventId,
        };
        const response = await getEvents(getEventsRequest);

        if (response !== undefined && response.length !== 0) {
          setEvent(response);
        }
      } catch (error) {}

      setIsFetchingEvent(false);
    }

    fetchEvents();
  }, [eventId]);

  return (
    <div className="max-w-4xl mt-32 mx-auto p-4 sm:p-8">
      <h1
        className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4"
        data-aos="zoom-y-out"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-teal-400">
          {event.name}
        </span>
      </h1>

      <div className="flex relative mb-4   gap-10 w-full h-full max-w-[1000px]">
        <div className="flex relative">
          <Image
            height={300}
            width={300}
            src={event?.imageUrl}
            alt={event.name}
            className="max-h-full flex-shrink-0 self-center object-fill overflow-hidden rounded-lg"
          />
        </div>

        <div className="flex h-full flex-col text-2xl ">
          <p className="text-gray-600 mb-4">Organized by {event.organizer}</p>
          <p className="mb-2">
            <span className="font-semibold">Date:</span> {event.startDate}
          </p>
          <p>
            <span className="font-semibold">Location:</span> {event.country}
          </p>
        </div>
      </div>

      <h2
        className="text-2xl md:text-3xl font-extrabold leading-tighter tracking-tighter mb-4"
        data-aos="zoom-y-out"
      >
        Description
      </h2>
      <p className="mb-4">{event.description}</p>
    </div>
  );
}
