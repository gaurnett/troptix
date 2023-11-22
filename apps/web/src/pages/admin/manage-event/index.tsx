
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
import OrdersPage from './orders';

export default function ManageEventPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const eventId = router.query.eventId;
  const [isFetchingEvent, setIsFetchingEvent] = useState(true);
  const [event, setEvent] = useState<any>();

  useEffect(() => {
    async function fetchEvents() {
      try {
        const getEventsRequest: any = {
          getEventsType: GetEventsType.GET_EVENTS_BY_ID,
          eventId: eventId
        }
        const response = await getEvents(getEventsRequest);

        if (response !== undefined && response.length !== 0) {
          setEvent(response);
        }
      } catch (error) {
      }

      setIsFetchingEvent(false);
    };

    fetchEvents();
  }, [eventId]);

  function onChange(key: string) {
  };

  function goBack() {
    router.back();
  }

  const items: TabsProps['items'] = [
    {
      key: 'orders',
      label: 'Orders',
      children: <OrdersPage />,
    },
    {
      key: 'basic-info',
      label: 'Basic Info',
      children: <BasicInfoPage event={event} setEvent={setEvent} />,
    },
    {
      key: 'details',
      label: 'Details',
      children: <DetailsPage event={event} setEvent={setEvent} />,
    },
    {
      key: 'tickets',
      label: 'Tickets',
      children: <TicketsPage />,
    },
    {
      key: 'promotion-codes',
      label: 'Promotion Codes',
      children: <PromotionCodesPage />,
    },
    {
      key: 'user-delegation',
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
                  <a className='justify-center align-middle my-auto mr-4' style={{ cursor: 'pointer' }} onClick={goBack}>
                    <IoMdArrowRoundBack className="text-4xl" />
                  </a>
                </div>

                <div className="mb-2">
                  <Button className="my-auto px-4 py-4 shadow-md items-center justify-center font-medium inline-flex">Publish Event</Button>
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