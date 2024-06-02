import BasicInfoPage from '@/components/pages/admin/manage-event/basic-info';
import DetailsPage from '@/components/pages/admin/manage-event/details';
import OrdersPage from '@/components/pages/admin/manage-event/orders';
import PromotionCodesPage from '@/components/pages/admin/manage-event/promotions-codes';
import TicketsPage from '@/components/pages/admin/manage-event/tickets';
import UserDelegationPage from '@/components/pages/admin/manage-event/user-delegation';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RequestType, useFetchEventsById } from '@/hooks/useFetchEvents';
import { useEditEvent } from '@/hooks/usePostEvent';
import { useQueryClient } from '@tanstack/react-query';
import type { TabsProps } from 'antd';
import { Button, message } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';

export default function ManageEventPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const eventId = router.query.eventId as string;
  const [eventForm, setEventForm] = useState<any>();
  const [activeKey, setActiveKey] = useState('basic-info');

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
    messageApi.open({
      key: 'update-event-loading',
      type: 'loading',
      content: 'Updating Event..',
      duration: 0,
    });

    mutation.mutate(e, {
      onSuccess: () => {
        messageApi.destroy('update-event-loading');
        messageApi.open({
          type: 'success',
          content: 'Successfully updated event.',
        });
        queryClient.invalidateQueries({
          queryKey: [RequestType.GET_EVENTS_BY_ID, eventId],
        });
      },
      onError: () => {
        messageApi.destroy('update-event-loading');
        messageApi.open({
          type: 'error',
          content: 'Failed to update event, please try again.',
        });
      },
    });
  }

  function publishEvent() {
    if (!event.imageUrl) {
      messageApi.open({
        type: 'error',
        content: 'Add an event flyer before publishing.',
      });
      setActiveKey('details');
      return;
    }

    const e = {
      ...event,
      ['isDraft']: !event.isDraft,
    };

    mutation.mutate(e, {
      onSuccess: () => {
        messageApi.open({
          type: 'success',
          content: e.isDraft
            ? 'Successfully unpublished event.'
            : 'Successfully published event.',
        });
        queryClient.invalidateQueries({
          queryKey: [RequestType.GET_EVENTS_BY_ID, eventId],
        });
      },
      onError: () => {
        messageApi.open({
          type: 'error',
          content: 'Failed to update event, please try again.',
        });
      },
    });
  }

  function onChange(key: string) {
    setActiveKey(key);
  }

  function goBack() {
    router.back();
  }

  const items: TabsProps['items'] = [
    {
      key: 'basic-info',
      label: 'Basic Info',
      children: (
        <BasicInfoPage
          event={eventForm}
          setEvent={setEventForm}
          updateEvent={updateEvent}
        />
      ),
    },
    {
      key: 'details',
      label: 'Details',
      children: (
        <DetailsPage
          event={eventForm}
          setEvent={setEventForm}
          updateEvent={updateEvent}
        />
      ),
    },
    {
      key: 'orders',
      label: 'Orders',
      children: <OrdersPage />,
    },
    {
      key: 'tickets',
      label: 'Tickets',
      children: <TicketsPage event={eventForm} />,
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
    // <div className="w-full xs:max-w-screen md:max-w-2xl">
    <div className="w-screen md:max-w-2xl">
      {contextHolder}
      {!isPending ? (
        <div className="mx-4">
          <h1
            className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4"
            data-aos="zoom-y-out"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-teal-400">
              {event.name}
            </span>
          </h1>

          <div className="">
            <div className="flow-root">
              <div className="flex">
                <div className="flex">
                  <a
                    className="justify-center align-middle my-auto mr-4"
                    style={{ cursor: 'pointer' }}
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
                    {event.isDraft ? 'Publish Event' : 'Unpublish'}
                  </Button>
                </div>
              </div>

              <div className="w-full mb-8 mt-4">
                <Tabs defaultValue="basic-info">
                  <div className='overflow-auto'>
                    <TabsList>
                      <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="orders">Orders</TabsTrigger>
                      <TabsTrigger value="tickets">Tickets</TabsTrigger>
                      <TabsTrigger value="promotion-codes">Promotion Codes</TabsTrigger>
                      <TabsTrigger value="user-delegation">User Delegation</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="basic-info">
                    <BasicInfoPage
                      event={eventForm}
                      setEvent={setEventForm}
                      updateEvent={updateEvent} />
                  </TabsContent>
                  <TabsContent value="details">
                    <DetailsPage
                      event={eventForm}
                      setEvent={setEventForm}
                      updateEvent={updateEvent} />
                  </TabsContent>
                  <TabsContent value="orders">
                    <OrdersPage />
                  </TabsContent>
                  <TabsContent value="tickets">
                    <TicketsPage event={eventForm} />
                  </TabsContent>
                  <TabsContent value="promotion-codes">
                    <PromotionCodesPage />
                  </TabsContent>
                  <TabsContent value="user-delegation">
                    <UserDelegationPage />
                  </TabsContent>
                </Tabs>
                {/* <Tabs
                  defaultActiveKey="0"
                  activeKey={activeKey}
                  items={items}
                  onChange={onChange}
                /> */}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <Spinner text={'Fetching Event'} />
        </div>
      )}
    </div>
  );
}
