import _ from 'lodash';
import { message, Button, Spin, Modal, List, Steps, theme, Table } from 'antd';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Event, getEventsFromRequest, Checkout, Order, Charge } from 'troptix-models';
import { postOrders, PostOrdersType, PostOrdersRequest, getEvents, saveEvent, GetEventsRequest, GetEventsType } from 'troptix-api';
import CheckoutForms from './tickets-checkout-forms';
import { TropTixContext } from '@/components/WebNavigator';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import BillingForm from './billing-form';
import TicketsCheckoutForm from './tickets-checkout-forms';
import CheckoutForm from './checkout';

export default function StripePage() {
  const { token } = theme.useToken();

  const [messageApi, contextHolder] = message.useMessage();
  const { user } = useContext(TropTixContext);
  const userId = user === null || user === undefined ? null : user.id;
  const router = useRouter();
  const eventId = "4f57fc0e-378f-420c-84cd-0f39824ef7e1";
  const [isFetchingEvent, setIsFetchingEvent] = useState(true);
  const [checkout, setCheckout] = useState<any>({});
  const [event, setEvent] = useState<any>();
  const [eventName, setEventName] = useState("");
  const [checkoutPreviousButtonClicked, setCheckoutPreviousButtonClicked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [promotionCode, setPromotionCode] = useState();
  const [promotion, setPromotion] = useState<any>();
  const [promotionApplied, setPromotionApplied] = useState(false);
  const [open, setOpen] = useState(false);

  const [current, setCurrent] = useState(0);
  const [steps, setSteps] = useState<any>([]);
  const [items, setItems] = useState<any>();
  const [stripeOptions, setStripeOptions] = useState<any>();

  const contentStyle: React.CSSProperties = {
    lineHeight: '260px',
    textAlign: 'center',
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };

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
          setCheckout(new Checkout(response));
          setCheckout(previousCheckout => ({
            ...previousCheckout,
            ["username"]: user.name,
            ["userEmail"]: user.email,
          }))
          setEventName(response.name)
        }
      } catch (error) {
      }

      setIsFetchingEvent(false);
    };

    fetchEvents();
  }, [eventId, user.email, user.name]);

  useEffect(() => {
    console.log(stripeOptions);

    setSteps([
      {
        title: 'Ticket',
        content: <TicketsCheckoutForm event={event} checkout={checkout} setCheckout={setCheckout} />,
      },
      {
        title: 'Billing',
        content: <BillingForm checkout={checkout} setCheckout={setCheckout} />
      },
      {
        title: 'Checkout',
        content: <CheckoutForm checkout={checkout} event={event} setCheckoutPreviousButtonClicked={setCheckoutPreviousButtonClicked} />
      },
    ])
  }, [checkout, event, stripeOptions]);

  useEffect(() => {
    setItems(steps.map((item) => ({ key: item.title, title: item.title })));
  }, [steps]);

  useEffect(() => {
    if (checkoutPreviousButtonClicked) {
      setCurrent(current - 1);
    }

    setCheckoutPreviousButtonClicked(false);
  }, [checkoutPreviousButtonClicked, current])

  async function next() {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-full md:max-w-2xl mx-auto mt-32">
      {contextHolder}
      {!isFetchingEvent
        ?
        <div className='mx-4'>
          <h1 className="text-center text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out"><span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-teal-400">{eventName}</span></h1>
          <Button onClick={() => setIsModalOpen(true)}>Buy Tickets</Button>
          <Modal
            title="Ticket Checkout"
            centered
            closable={true}
            open={isModalOpen}
            okButtonProps={{ hidden: true }}
            cancelButtonProps={{ hidden: true }}
            onCancel={handleCancel}
            width={600}
          >
            <div className="w-full">
              <Steps current={current} items={[
                {
                  title: "Tickets"
                },
                {
                  title: "Billing"
                },
                {
                  title: "Checkout"
                }
              ]} />
              <div>{steps[current].content}</div>
              <div className='mt-2'>
                {current < steps.length - 1 && (
                  <div className='my-auto flex'>
                    <div className='border rounded border-1 flex p-2'>
                      <div className=''>
                        <div className=''>Subtotal:</div>
                        <div className=''>Taxes & Fees:</div>
                        <div className=''>Total:</div>
                      </div>
                      <div className='ml-4 border-l border-dashed'>
                        <div className='ml-4'>
                          <div>${checkout.subtotal}</div>
                          <div>${checkout.fees}</div>
                          <div>${checkout.total}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className='grow my-auto mt-4'>
                  {current < steps.length - 1 && (
                    <Button type='primary' onClick={next} className="px-4 py-4 shadow-md items-center bg-blue-600 hover:bg-blue-700 font-medium inline-flex">Continue</Button>
                  )}
                  {current > 0 && current < steps.length - 1 && (
                    <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                      Previous
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Modal>
        </div>
        :
        <Spin className="mt-16" tip="Fetching Event" size="large">
          <div className="content" />
        </Spin>
      }
    </div>
  );
}