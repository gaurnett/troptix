import EventCard from "@/components/EventCard";
import { CustomInput } from "@/components/ui/input";
import { message, Button, Tabs, Spin } from "antd";
import type { TabsProps } from "antd";
import { useRouter } from "next/router";
import { IoMdArrowRoundBack } from "react-icons/io";
import TicketsPage from "@/components/admin/manage-event/tickets";
import { useCallback, useEffect, useState } from "react";
import { Event, getEventsFromRequest } from "troptix-models";
import {
  TropTixResponse,
  getEvents,
  saveEvent,
  GetEventsRequest,
  GetEventsType,
} from "troptix-api";
import BasicInfoPage from "@/components/admin/manage-event/basic-info";
import DetailsPage from "@/components/admin/manage-event/details";
import OrderSummaryPage from "@/components/admin/manage-event/order-summary";
import PromotionCodesPage from "@/components/admin/manage-event/promotions-codes";
import UserDelegationPage from "@/components/admin/manage-event/user-delegation";
import OrdersPage from "@/components/admin/manage-event/orders";

export default function ManageEventPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const eventId = router.query.eventId;
  const [isFetchingEvent, setIsFetchingEvent] = useState(true);
  const [event, setEvent] = useState<any>();
  const [eventName, setEventName] = useState("");
  const [publishButtonClicked, setPublishButtonClicked] = useState(false);

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
          setEventName(response.name);
        }
      } catch (error) {}

      setIsFetchingEvent(false);
    }

    fetchEvents();
  }, [eventId]);

  useEffect(() => {
    async function updateEventPublishedState() {
      if (event !== undefined && publishButtonClicked) {
        const successMessage = event.isDraft
          ? "Successfully unpublished event."
          : "Successfully published event.";
        const response = await saveEvent(event, true);

        if (
          response === null ||
          response === undefined ||
          response.error !== null
        ) {
          messageApi.open({
            type: "error",
            content: "Failed to update event, please try again.",
          });
          setPublishButtonClicked(false);
          return;
        }

        messageApi.open({
          type: "success",
          content: successMessage,
        });
        console.log(event.isDraft);
      }
      setPublishButtonClicked(false);
    }

    updateEventPublishedState();
  }, [event, messageApi, publishButtonClicked]);

  function onChange(key: string) {}

  function goBack() {
    router.back();
  }

  async function publishEvent() {
    setEvent((previousEvent: any) => ({
      ...previousEvent,
      ["isDraft"]: !previousEvent.isDraft,
    }));
    setPublishButtonClicked(true);
  }

  async function updateEvent(successMessage = "Successfully updated event.") {
    const response = await saveEvent(event, true);

    if (
      response === null ||
      response === undefined ||
      response.error !== null
    ) {
      messageApi.open({
        type: "error",
        content: "Failed to update event, please try again.",
      });
      return;
    }

    messageApi.open({
      type: "success",
      content: successMessage,
    });
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
          event={event}
          setEvent={setEvent}
          updateEvent={updateEvent}
        />
      ),
    },
    {
      key: "details",
      label: "Details",
      children: (
        <DetailsPage
          event={event}
          setEvent={setEvent}
          updateEvent={updateEvent}
        />
      ),
    },
    {
      key: "tickets",
      label: "Tickets",
      children: <TicketsPage />,
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
      {!isFetchingEvent ? (
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
        <Spin className="mt-16" tip="Fetching Event" size="large">
          <div className="content" />
        </Spin>
      )}
    </div>
  );
}
