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
import { FaCartShopping } from "react-icons/fa6";
import {
  ShoppingCartOutlined
} from '@ant-design/icons';

export default function TicketModal({ event, isTicketModalOpen, setIsTicketModalOpen, handleCancel }) {
  const { user } = useContext(TropTixContext);
  const [checkout, setCheckout] = useState<any>({});
  const [checkoutPreviousButtonClicked, setCheckoutPreviousButtonClicked] = useState(false);
  const [completePurchaseClicked, setCompletePurchaseClicked] = useState(false);

  const [current, setCurrent] = useState(0);
  const [steps, setSteps] = useState<any>([]);
  const [items, setItems] = useState<any>();
  const [fetchingCheckout, setFetchingCheckout] = useState(true);
  const [orderSummary, setOrderSummary] = useState(new Map());
  const [isStripeLoaded, setIsStripeLoaded] = useState(false);

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
        content: <TicketsCheckoutForm event={event} checkout={checkout} setCheckout={setCheckout} orderSummary={orderSummary} setOrderSummary={setOrderSummary} />,
      },
      {
        title: 'Billing',
        content: <BillingForm checkout={checkout} setCheckout={setCheckout} />
      },
      {
        title: 'Checkout',
        content: <CheckoutForm
          completePurchaseClicked={completePurchaseClicked}
          checkout={checkout}
          event={event}
          setCompletePurchaseClicked={setCompletePurchaseClicked}
          setIsStripeLoaded={setIsStripeLoaded}
          setCheckoutPreviousButtonClicked={setCheckoutPreviousButtonClicked} />
      },
    ])
  }, [checkout, event, completePurchaseClicked, orderSummary]);

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

  async function completeStripePayment() {
    setCompletePurchaseClicked(true);
  }

  function closeModal() {
    setOrderSummary(new Map());
    setIsStripeLoaded(false);
    handleCancel();
  }

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
            onCancel={closeModal}
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

                <div className='grow'>
                  <div style={{ maxHeight: 450 }} className='grow overflow-auto w-full h-full'>{steps[current].content}</div>
                  <div className='flex flex-end content-end items-end self-end mt-4'>
                    {current === 0 && (
                      <Button
                        type="primary"
                        onClick={next}
                        className="w-full px-6 py-6 shadow-md items-center bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex">
                        Continue
                      </Button>)}
                    {current === 1 && (
                      <div className='flex w-full'>
                        <Button
                          onClick={prev}
                          className="mr-2 w-full px-6 py-6 shadow-md items-center justify-center font-medium inline-flex">
                          Previous
                        </Button>
                        <Button
                          type="primary"
                          onClick={next}
                          className="ml-2 w-full px-6 py-6 shadow-md items-center bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex">
                          Continue
                        </Button>
                      </div>
                    )}
                    {current === 2 && (
                      <div className='flex w-full'>
                        <Button
                          onClick={prev}
                          className="mr-2 w-full px-6 py-6 shadow-md items-center justify-center font-medium inline-flex">
                          Previous
                        </Button>
                        <Button
                          type="primary"
                          onClick={completeStripePayment}
                          disabled={!isStripeLoaded}
                          className="ml-2 w-full px-6 py-6 shadow-md items-center bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex">
                          Complete Purchase
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className='ml-8'>
                  <div className='hidden md:block'>
                    <Image
                      height={275}
                      width={275}
                      src={event?.imageUrl}
                      alt={event.name}
                      className="mb-8 max-h-full flex-shrink-0 self-center object-fill overflow-hidden rounded-lg"
                    />
                  </div>

                  <div>
                    {/* {current < steps.length - 1 && ( */}
                    <div className='mb-4 md:mt-4 md:mb-8 my-auto w-full'>
                      {
                        orderSummary.size === 0 ?
                          <div className='mx-auto my-auto w-full text-center justify-center align-center'>
                            <ShoppingCartOutlined className='text-4xl mx-auto mt-2' />
                          </div> :
                          <div>
                            <h2 className="text-md font-bold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out">Order Summary</h2>
                            <List
                              itemLayout="vertical"
                              size="large"
                              dataSource={Array.from(orderSummary.keys())}
                              split={false}
                              renderItem={(name: any, index: number) => {
                                const quantity = orderSummary.get(name)
                                return (
                                  <List.Item
                                    className='mb-4'
                                    style={{ padding: 0 }}>
                                    <div>
                                      {quantity} x {name}
                                    </div>
                                  </List.Item>
                                )
                              }}
                            />

                            <div style={{ flex: 1, height: 1, backgroundColor: '#D3D3D3' }} />

                            <div className='w-full flex my-4'>
                              <div className='grow'>
                                <div className=''>Subtotal:</div>
                                <div className=''>Taxes & Fees:</div>
                              </div>
                              <div className='ml-4'>
                                <div className='ml-4'>
                                  <div>${checkout.subtotal}</div>
                                  <div>${checkout.fees}</div>
                                </div>
                              </div>
                            </div>

                            <div style={{ flex: 1, height: 1, backgroundColor: '#D3D3D3' }} />

                            <div className='w-full flex my-4'>
                              <div className='grow'>
                                <div className='text-xl font-bold'>Total:</div>
                              </div>
                              <div className='ml-4'>
                                <div className='ml-4'>
                                  <div className='text-xl font-bold'>${checkout.total}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                      }
                    </div>
                    {/* )} */}
                  </div>
                </div>
              </div>
            </div>
          </Modal>
      }
    </>
  );
}