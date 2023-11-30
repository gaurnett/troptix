import EventCard from "@/components/EventCard";

import Footer from "@/components/ui/footer";
import { Spinner } from "@/components/ui/spinner";
import { useFetchAllEvents } from "@/hooks/useFetchEvents";
import { Image } from "antd";
import Link from "next/link";

export default function ManageEventsPage() {
  const { isPending, isError, data, error } = useFetchAllEvents();
  const events = data as any[];

  return (
    <div className="flex min-h-screen flex-col">
      <div className="grow mt-28 md:mt-32 w-full md:max-w-5xl mx-auto">
        <div className="">
          <h1
            className="text-center text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4"
            data-aos="zoom-y-out"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-400 px-4">
              Events
            </span>
          </h1>
          {!isPending ? (
            <div className="mx-auto p-4">
              <div className="flex flex-wrap -mx-2">
                {events.length === 0 ? (
                  <>
                    <div
                      className="text-center"
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        width: "100%",
                      }}
                    >
                      <Image
                        preview={false}
                        width={75}
                        height={75}
                        className="w-full mx-auto justify-center content-center items-center"
                        style={{ objectFit: "contain" }}
                        src={"/icons/empty-events.png"}
                        alt={"mobile wallet image"}
                      />
                      <div className="mt-4 font-bold text-xl">
                        There are no events nearby
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {events.map((event, index: any) => {
                      return (
                        <div
                          key={index}
                          className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4">
                          <Link
                            href={{
                              pathname: "/event",
                              query: { eventId: event?.id },
                            }}>
                            <EventCard event={event} showDivider={index < events.length - 1} />
                          </Link>
                        </div>
                      )
                    })}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="container mx-auto py-16">
              <Spinner text={"Fetching Events"} />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
