
import EventCard from '@/components/EventCard';
import { CustomInput } from '@/components/ui/input';
import { message, Button, Tabs, Spin } from 'antd';
import type { TabsProps } from 'antd';
import { useRouter } from 'next/router';
import { IoMdArrowRoundBack } from "react-icons/io";
import TicketsPage from './tickets';
import { useEffect, useState } from 'react';
import { Event, getEventsFromRequest } from 'troptix-models';
import { TropTixResponse, getEvents, saveEvent, GetEventsRequest, GetEventsType } from 'troptix-api';
import BasicInfoPage from './basic-info';
import DetailsPage from './details';
import OrderSummaryPage from './order-summary';
import PromotionCodesPage from './promotions-codes';
import UserDelegationPage from './user-delegation';

export default function ManageEventPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const eventId = router.query.eventId;
  const [isFetchingEvent, setIsFetchingEvent] = useState(true);
  const [event, setEvent] = useState<any>();

  useEffect(() => {
    async function fetchEvents() {
      console.log("fetching 1");
      try {
        const getEventsRequest: any = {
          getEventsType: GetEventsType.GET_EVENTS_BY_ID,
          eventId: eventId
        }
        const response = await getEvents(getEventsRequest);

        if (response !== undefined && response.length !== 0) {
          setEvent(response);
        }

        console.log("ManageEventScreen [events]: " + JSON.stringify(response));
      } catch (error) {
        console.log("ManageEventScreen [fetchEvents] error: " + error)
      }

      setIsFetchingEvent(false);
    };

    fetchEvents();
  }, [eventId]);

  function onChange(key: string) {
    console.log(key);
  };

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.name);
    console.log(event.target.value);
  }

  function goBack() {
    router.back();
  }

  async function updateEvent() {
    console.log(event);
    const response = await saveEvent(event, true);

    if (response === null || response === undefined || response.error !== null) {
      messageApi.open({
        type: 'error',
        content: 'Failed to create event, please try again.',
      });
      return;
    }

    messageApi.open({
      type: 'success',
      content: 'Successfully updated event.',
    });
  }

  const items: TabsProps['items'] = [
    {
      key: '0',
      label: 'Dashboard',
      children: <OrderSummaryPage />,
    },
    {
      key: '1',
      label: 'Basic Info',
      children: <BasicInfoPage event={event} setEvent={setEvent} />,
    },
    {
      key: '2',
      label: 'Details',
      children: <DetailsPage event={event} setEvent={setEvent} />,
    },
    {
      key: '3',
      label: 'Tickets',
      children: <TicketsPage />,
    },
    {
      key: '4',
      label: 'Promotion Codes',
      children: <PromotionCodesPage />,
    },
    {
      key: '5',
      label: 'User Delegation',
      children: <UserDelegationPage />,
    },
  ];

  return (
    <div className="w-full md:max-w-2xl mx-auto">
      {contextHolder}
      {!isFetchingEvent
        ?
        <div className='mx-4'>
          <h1 className="text-center text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out"><span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-teal-400">{event.name}</span></h1>

          <div className=''>
            <div className='flow-root'>
              <div className="flex mt-2">
                <div className='flex'>
                  <a className='justify-center align-middle my-auto' style={{ cursor: 'pointer' }} onClick={goBack}>
                    <IoMdArrowRoundBack className="text-4xl mr-8" />
                  </a>
                  <Button onClick={updateEvent} className="px-4 py-4 shadow-md items-center justify-center font-medium inline-flex">Save Event</Button>
                </div>

                <div className="">
                  <div className="mb-2 ml-4">
                    <Button type="primary" className="px-4 py-4 shadow-md items-center justify-center font-medium inline-flex bg-blue-600 hover:bg-blue-700">Publish Event</Button>
                  </div>
                </div>
              </div>

              <div className="float-right w-full">
                <Tabs defaultActiveKey="0" items={items} onChange={onChange} />
              </div>

            </div>
          </div>
        </div>
        :
        <Spin className="mt-16" tip="Fetching Event" size="large">
          <div className="content" />
        </Spin>
      }
    </div>
  );
}