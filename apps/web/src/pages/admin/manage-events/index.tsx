import { useContext } from "react";
import { TropTixContext } from "@/components/WebNavigator";
import Link from "next/link";
import { List, Spin, Image } from "antd";
import { RequestType, useFetchEventsById } from "@/hooks/useFetchEvents";

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
                          preview={false}
                          width={75}
                          height={75}
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
                        <div>{event.name}</div>
                        <div>{event.address}</div>
                        <div>{new Date(event.startDate).toDateString()}</div>
                        <div className="text-blue-500">
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
          <Spin className="mt-16" tip="Fetching Events" size="large">
            <div className="content" />
          </Spin>
        )}
      </div>
    </div>
  );
}
