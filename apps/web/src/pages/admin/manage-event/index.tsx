import { message, Button, Tabs, Spin } from "antd";
import type { TabsProps } from "antd";
import { useRouter } from "next/router";
import { IoMdArrowRoundBack } from "react-icons/io";
import TicketsPage from "@/components/admin/manage-event/tickets";
import { useEffect, useState } from "react";
import { saveEvent } from "troptix-api";
import BasicInfoPage from "@/components/admin/manage-event/basic-info";
import DetailsPage from "@/components/admin/manage-event/details";
import PromotionCodesPage from "@/components/admin/manage-event/promotions-codes";
import UserDelegationPage from "@/components/admin/manage-event/user-delegation";
import OrdersPage from "@/components/admin/manage-event/orders";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useFetchEventsById, RequestType } from "@/hooks/useFetchEvents";
import { useCreateEvent, useEditEvent } from "@/hooks/usePostEvent";
import { useQueryClient } from "@tanstack/react-query";

export default function ManageEventPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const eventId = router.query.eventId as string;
  const [isFetchingEvent, setIsFetchingEvent] = useState(true);
  const [eventForm, setEventForm] = useState<any>();
  const [eventName, setEventName] = useState("");
  const [publishButtonClicked, setPublishButtonClicked] = useState(false);

  const queryClient = useQueryClient();
  const mutation = useEditEvent();

  const {
    isPending,
    isError,
    data: event,
    error,
  } = useFetchEventsById({
    requestType: RequestType.GET_EVENTS_BY_ID,
    id: eventId,
  });

  // Update local state with fetched data
  useEffect(() => {
    if (event) {
      setEventForm(event);
    }
  }, [event]);

  function updateEvent(e) {
    messageApi
      .open({
        key: 'update-event-loading',
        type: 'loading',
        content: 'Updating Event..',
        duration: 0,
      });

    mutation.mutate(e, {
      onSuccess: () => {
        messageApi.destroy('update-event-loading');
        messageApi.open({
          type: "success",
          content: "Successfully updated event.",
        });
        queryClient.invalidateQueries({
          queryKey: [RequestType.GET_EVENTS_BY_ID, eventId],
        });
      },
      onError: () => {
        messageApi.destroy('update-event-loading');
        messageApi.open({
          type: "error",
          content: "Failed to update event, please try again.",
        });
      },
    });
  }

  function publishEvent() {
    const e = {
      ...event,
      ["isDraft"]: !event.isDraft,
    };

    mutation.mutate(e, {
      onSuccess: () => {
        messageApi.open({
          type: "success",
          content: e.isDraft
            ? "Successfully unpublished event."
            : "Successfully published event.",
        });
        queryClient.invalidateQueries({
          queryKey: [RequestType.GET_EVENTS_BY_ID, eventId],
        });
      },
      onError: () => {
        messageApi.open({
          type: "error",
          content: "Failed to update event, please try again.",
        });
      },
    });
  }

  function onChange(key: string) { }

  function goBack() {
    router.back();
  }

  const items: TabsProps["items"] = [
    {
      key: "orders",
      label: "Orders",
      children: <OrdersPage />,
    },
    {
      key: "basic-info",
      label: "Basic Info",
      children: (
        <BasicInfoPage
          event={eventForm}
          setEvent={setEventForm}
          updateEvent={updateEvent}
        />
      ),
    },
    {
      key: "details",
      label: "Details",
      children: (
        <DetailsPage
          event={eventForm}
          setEvent={setEventForm}
          updateEvent={updateEvent}
        />
      ),
    },
    {
      key: "tickets",
      label: "Tickets",
      children: <TicketsPage
        event={eventForm} />,
    },
    {
      key: "promotion-codes",
      label: "Promotion Codes",
      children: <PromotionCodesPage />,
    },
    {
      key: "user-delegation",
      label: "User Delegation",
      children: <UserDelegationPage />,
    },
  ];

  return (
    <div className="w-full md:max-w-2xl mx-auto">
      {contextHolder}
      {!isPending ? (
        <div className="mx-4">
          <h1
            className="text-center text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4"
            data-aos="zoom-y-out"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-teal-400">
              {eventName}
            </span>
          </h1>

          <div className="">
            <div className="flow-root">
              <div className="flex my-2">
                <div className="flex">
                  <a
                    className="justify-center align-middle my-auto mr-4"
                    style={{ cursor: "pointer" }}
                    onClick={goBack}
                  >
                    <IoMdArrowRoundBack className="text-3xl" />
                  </a>
                </div>

                <div className="my-auto">
                  <Button
                    onClick={publishEvent}
                    className="px-4 py-4 shadow-md items-center font-medium inline-flex"
                  >
                    {event.isDraft ? "Publish Event" : "Set to draft"}
                  </Button>
                </div>
              </div>

              <div className="float-right w-full">
                <Tabs defaultActiveKey="0" items={items} onChange={onChange} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        // <Spin className="mt-16" tip="Fetching Event" size="large">
        //   <div className="content" />
        // </Spin>
        <LoadingSpinner>Fetching Event</LoadingSpinner>
      )}
    </div>
  );
}
