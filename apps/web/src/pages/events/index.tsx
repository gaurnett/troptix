import EventCard from "@/components/EventCard";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import { Event, getEventsFromRequest } from "troptix-models";
import {
  TropTixResponse,
  getEvents,
  GetEventsRequest,
  GetEventsType,
} from "troptix-api";
import { TropTixContext } from "@/components/WebNavigator";
import Link from "next/link";
import { List, Spin, Image } from "antd";
import { useFetchAllEvents } from "@/hooks/useFetchEvents";

export default function ManageEventsPage() {
  const router = useRouter();
  const { user } = useContext(TropTixContext);
  const userId = user === null || user === undefined ? null : user.id;
  const [isFetchingEvents, setIsFetchingEvents] = useState(true);

  console.log(process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL);

  const { isPending, isError, data: events, error } = useFetchAllEvents();

  return (
    <div className="w-full mt-32 mx-auto">
      <div className="mx-4">
        <h1
          className="text-center text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4"
          data-aos="zoom-y-out"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-teal-400">
            Current Events
          </span>
        </h1>
        {!isPending ? (
          <div className="container mx-auto p-4">
            <div className="flex flex-wrap -mx-2">
              {
                events.length === 0 ?
                  <>
                    <div className="text-center" style={{ alignItems: 'center', justifyContent: 'center', height: "100%", width: "100%" }}>
                      <Image
                        preview={false}
                        width={75}
                        height={75}
                        className="w-full mx-auto justify-center content-center items-center"
                        style={{ objectFit: 'contain' }}
                        src={"/icons/empty-events.png"}
                        alt={"mobile wallet image"} />
                      <div className="mt-4 font-bold text-xl">There are no events nearby</div>
                    </div>
                  </>
                  :
                  <>
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4">
                        <Link href={{ pathname: "/event", query: { eventId: event.id } }}>
                          <EventCard
                            eventName={event.name}
                            image={
                              event.imageUrl ??
                              "https://placehold.co/400x400?text=Add+Event+Flyer"
                            }
                            date={new Date(event.startDate).toDateString()}
                            location={event.address}
                            price={"$0"}
                          />
                        </Link>
                      </div>
                    ))}
                  </>
              }

            </div>
          </div>
        ) : (
          <Spin className="mt-16" tip="Fetching Events" size="large">
            <div className="content" />
          </Spin>
        )}
      </div>
    </div>
  );
}