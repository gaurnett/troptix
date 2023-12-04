import { TropTixContext } from "@/components/WebNavigator";
import { Spinner } from "@/components/ui/spinner";
import { RequestType, useFetchEventsById } from "@/hooks/useFetchEvents";
import { List } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";

export default function ManageEventsPage() {
  const { user } = useContext(TropTixContext);
  const userId = user === null || user === undefined ? null : user.id;

  const { isPending, isError, data, error } = useFetchEventsById({
    requestType: RequestType.GET_EVENTS_BY_ORGANIZER,
    id: userId,
  });

  return (
    <div className="w-full md:max-w-2xl mx-auto">
      <div className="mx-4">
        <h1
          className="text-center text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4"
          data-aos="zoom-y-out"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-teal-400">
            Manage Events
          </span>
        </h1>
        {!isPending ? (
          <div className="gap-8 pb-16 mt-8">
            <List
              itemLayout="vertical"
              size="large"
              dataSource={data}
              renderItem={(event: any) => (
                <List.Item>
                  <Link
                    key={event.id}
                    href={{
                      pathname: "/admin/manage-event",
                      query: { eventId: event.id },
                    }}
                  >
                    <div className="flex">
                      <div>
                        <Image
                          width={110}
                          height={110}
                          className="w-auto"
                          style={{ objectFit: "cover" }}
                          src={
                            event.imageUrl !== null
                              ? event.imageUrl
                              : "https://placehold.co/400x400?text=Add+Event+Flyer"
                          }
                          alt={"event flyer image"}
                        />
                      </div>
                      <div className="ml-4 my-auto">
                        <div className="font-bold text-xl">{event.name}</div>
                        <div className="text-base">{event.address}</div>
                        <div className="text-blue-500 text-base">{new Date(event.startDate).toDateString()}</div>
                        <div className={`${event.isDraft ? "text-amber-900" : "text-green-600"} text-amber-900 text-base`}>
                          Status: {event.isDraft ? "Draft" : "Published"}
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
            <Spinner text={"Fetching Events"} />
          </div>
        )}
      </div>
    </div>
  );
}
