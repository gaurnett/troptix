import { TropTixContext } from '@/components/WebNavigator';
import { Checkout, initializeCheckout } from '@/hooks/types/Checkout';
import { useCreateOrder } from '@/hooks/useOrders';
import { useCreatePaymentIntent } from '@/hooks/usePostStripe';
import {
  ShoppingCartOutlined
} from '@ant-design/icons';
import { Button, List, Modal, Steps, message } from 'antd';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import CheckoutForm from './checkout';
import TicketsCheckoutForm from './tickets-checkout-forms';

export default function TicketModal({ event, isTicketModalOpen, handleCancel }) {
  const { user } = useContext(TropTixContext);
  const [checkout, setCheckout] = useState<Checkout>(initializeCheckout(user, event.id));
  const [checkoutPreviousButtonClicked, setCheckoutPreviousButtonClicked] = useState(false);
  const [completePurchaseClicked, setCompletePurchaseClicked] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [current, setCurrent] = useState(0);
  const [canShowMessage, setCanShowMessage] = useState(true);
  const [clientSecret, setClientSecret] = useState<any>();
  const [messageApi, contextHolder] = message.useMessage();
  const createPaymentIntent = useCreatePaymentIntent();
  const createOrder = useCreateOrder();

  useEffect(() => {
    setCheckout(initializeCheckout(user, event.id));
  }, [user, event.id]);

  const checkoutSteps = [
    {
      title: 'Tickets',
      content: <TicketsCheckoutForm event={event} checkout={checkout} setCheckout={setCheckout} />,
    },
    {
      title: 'Checkout',
      content:
        <CheckoutForm
          completePurchaseClicked={completePurchaseClicked}
          orderId={orderId}
          clientSecret={clientSecret}
          setCompletePurchaseClicked={setCompletePurchaseClicked} />

    },
  ]

  useEffect(() => {
    if (checkoutPreviousButtonClicked) {
      setCurrent(current - 1);
    }

    setCheckoutPreviousButtonClicked(false);
  }, [checkoutPreviousButtonClicked, current])

  async function initializeStripeDetails() {
    createPaymentIntent.mutate({ checkout }, {
      onSuccess: (data) => {
        const { paymentId, customerId, clientSecret } = data;

        createOrder.mutate({ checkout, paymentId, customerId, userId: user.id }, {
          onSuccess: (data) => {
            setClientSecret(clientSecret);
            setOrderId(data as string);
          },
          onError: (error) => {
            messageApi.error("There was an error initializing your order");
            setCurrent(1);
          }
        });
      },
      onError: (error) => {
        messageApi.error("There was an error initializing your order");
        setCurrent(1);
      }
    });

  }

  async function next() {
    console.log(checkout)
    if (!checkout.firstName
      || !checkout.lastName
      || !checkout.email) {
      if (canShowMessage) {
        setCanShowMessage(false);
        message.warning("Please fill in contact information")
          .then(() => setCanShowMessage(true));
      }
      return;
    }

    if (checkout.total === 0) {
      if (canShowMessage) {
        setCanShowMessage(false);
        message.warning("Please select a ticket quantity")
          .then(() => setCanShowMessage(true));
      }
      return;
    }

    initializeStripeDetails();

    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  async function completeStripePayment() {
    setCompletePurchaseClicked(true);
  }

  function closeModal() {
    setCheckout(initializeCheckout(user, event.id));
    setCurrent(0);
    handleCancel();
  }

  function getFormattedCurrency(price) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    return formatter.format(price);
  }

  if (!user) {
    return (<></>)
  }

  return (
    <>
      {contextHolder}
      <Modal
        title="Ticket Checkout"
        centered
        closable={true}
        open={isTicketModalOpen}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        onCancel={closeModal}
        width={1080}
      >
        <div className="w-full">
          <div style={{ height: 650 }} className='flex mt-6'>
            <div className='w-4/6 grow'>
              <div className='flex flex-col h-full px-12'>
                <div className='w-3/4 md:mx-auto mb-6'>
                  <Steps current={current} items={[
                    {
                      title: "Tickets"
                    },
                    {
                      title: "Checkout"
                    }
                  ]} />
                </div>

                <div className='flex-1 overflow-y-auto'>
                  <div className='grow'>
                    {checkoutSteps[current].content}
                  </div>
                </div>
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
                        type="primary"
                        onClick={completeStripePayment}
                        disabled={!clientSecret}
                        className="ml-2 w-full px-6 py-6 shadow-md items-center bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex">
                        Complete Purchase
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className='w-2/6 ml-8 overflow-y-auto border-l pl-12 pr-6'>
              <div className='mx-auto text-center'>
                <div className="text-center justify-center">
                  <Image
                    height={200}
                    width={200}
                    src={event?.imageUrl}
                    alt={event.name}
                    className="mb-8 max-h-full flex-shrink-0 self-center object-fill overflow-hidden rounded-lg mx-auto"
                  />
                </div>

              </div>

              <div>
                <div className='mb-4 md:mt-4 md:mb-8 my-auto w-full'>
                  {
                    checkout.tickets.size === 0 ?
                      <div className='mx-auto my-auto w-full text-center justify-center align-center'>
                        <ShoppingCartOutlined className='text-3xl mx-auto mt-2' />
                        <div className='text-base'>Cart is empty</div>
                      </div> :
                      <div>
                        <h2 className="text-xl font-bold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out">Order Summary</h2>
                        <List
                          itemLayout="vertical"
                          size="large"
                          dataSource={Array.from(checkout.tickets?.keys())}
                          split={false}
                          renderItem={(id: any, index: number) => {
                            const summary = checkout.tickets.get(id);
                            let subtotal = 0;
                            let quantitySelected = 0;
                            if (summary?.subtotal) {
                              subtotal = summary.subtotal;
                            }

                            if (summary?.quantitySelected) {
                              quantitySelected = summary.quantitySelected
                            }
                            return (
                              <List.Item
                                style={{ padding: 0 }}>
                                <div className='w-full flex my-4'>
                                  <div className='grow'>
                                    <div className='text-sm'>
                                      {summary?.quantitySelected} x {summary?.name}
                                    </div>
                                  </div>
                                  <div className='ml-4'>
                                    <div className='ml-4'>
                                      <div className='text-sm text-end'>{getFormattedCurrency(subtotal * quantitySelected)}</div>
                                    </div>
                                  </div>
                                </div>
                              </List.Item>
                            )
                          }}
                        />

                        <div style={{ flex: 1, height: 1, backgroundColor: '#D3D3D3' }} />

                        <div className='w-full flex my-4'>
                          <div className='grow'>
                            <div className='text-sm'>Subtotal:</div>
                            <div className='text-sm'>Taxes & Fees:</div>
                          </div>
                          <div className='ml-4'>
                            <div className='ml-4'>
                              <div className='text-sm text-end'>{getFormattedCurrency(checkout.promotionApplied ? checkout.discountedSubtotal : checkout.subtotal)}</div>
                              <div className='text-sm text-end'>{getFormattedCurrency(checkout.promotionApplied ? checkout.discountedFees : checkout.fees)}</div>
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
                              <div className='text-xl font-bold text-end'>
                                {getFormattedCurrency(checkout.promotionApplied ? checkout.discountedTotal : checkout.total)} USD
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}