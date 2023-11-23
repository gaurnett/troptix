import _ from 'lodash';
import { message, Button, Spin, Modal, List, Steps, theme, Table, Image } from 'antd';
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

export default function TicketModal({ event, isTicketModalOpen, setIsTicketModalOpen, handleCancel }) {
  const { user } = useContext(TropTixContext);
  const [checkout, setCheckout] = useState<any>({});
  const [checkoutPreviousButtonClicked, setCheckoutPreviousButtonClicked] = useState(false);

  const [current, setCurrent] = useState(0);
  const [steps, setSteps] = useState<any>([]);
  const [items, setItems] = useState<any>();
  const [fetchingCheckout, setFetchingCheckout] = useState(true);

  useEffect(() => {
    if (isTicketModalOpen) {
      setCheckout(new Checkout(event));
      setCheckout(previousCheckout => ({
        ...previousCheckout,
        ["name"]: user?.name,
        ["email"]: user?.email,
      }))

      setCurrent(0);
      setFetchingCheckout(false);
    }

  }, [event, isTicketModalOpen, user?.email, user?.name]);

  useEffect(() => {
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
  }, [checkout, event]);

  useEffect(() => {
    setItems(steps.map((item) => ({ key: item.title, title: item.title })));
  }, [steps]);

  useEffect(() => {
    if (checkoutPreviousButtonClicked) {
      setCurrent(current - 1);
    }

    setCheckoutPreviousButtonClicked(false);
  }, [checkoutPreviousButtonClicked, current])

  function checkUndefinedOrNull(value) {
    return value === undefined || value == null || value == "";
  }

  async function next() {
    if (current === 0) {
      if (checkout.total === 0) {
        message.warning("Please select a ticket quantity");
        return;
      }
    }

    if (current === 1) {
      if (checkUndefinedOrNull(checkout.name)
        || checkUndefinedOrNull(checkout.email)
        || checkUndefinedOrNull(checkout.billingAddress1)
        || checkUndefinedOrNull(checkout.billingCity)
        || checkUndefinedOrNull(checkout.billingCountry)
        || checkUndefinedOrNull(checkout.billingState)) {
        message.warning("Please fill in required fields");
        return;
      }
    }

    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <>
      {
        fetchingCheckout ? <></> :
          <Modal
            title="Ticket Checkout"
            centered
            closable={true}
            open={isTicketModalOpen}
            okButtonProps={{ hidden: true }}
            cancelButtonProps={{ hidden: true }}
            onCancel={handleCancel}
            width={900}
          >
            <div className="w-full">
              <div className='md:w-3/4 md:mx-auto md:mt-4'>
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
              </div>
              <div className='md:flex md:mt-6'>
                <div className='md:mr-8 md:mb-8'>
                  <div className='hidden md:block'>
                    <Image
                      height={250}
                      width={250}
                      src={event?.imageUrl}
                      alt={event.name}
                      className="mb-8 max-h-full flex-shrink-0 self-center object-fill overflow-hidden rounded-lg"
                    />
                  </div>

                  <div>
                    {/* {current < steps.length - 1 && ( */}
                    <div className='mb-4 md:mt-4 md:mb-8 my-auto w-full flex'>
                      <div className='border w-full rounded border-1 flex p-2'>
                        <div className='grow'>
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
                    {/* )} */}
                  </div>
                </div>
                <div className='grow'>
                  <div style={{ maxHeight: 450 }} className='grow overflow-auto w-full h-full'>{steps[current].content}</div>
                  <div className='flex flex-end content-end items-end self-end mt-4'>
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
            </div>
          </Modal>
      }
    </>
  );
}