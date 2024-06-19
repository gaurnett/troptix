import { TropTixContext } from '@/components/WebNavigator';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Spinner } from '@/components/ui/spinner';
import { Checkout, initializeCheckout } from '@/hooks/types/Checkout';
import { TicketType } from '@/hooks/types/Ticket';
import { useCreateOrder } from '@/hooks/useOrders';
import { useCreatePaymentIntent } from '@/hooks/usePostStripe';
import { checkOrderValidity, useFetchTicketTypesForCheckout } from '@/hooks/useTicketType';
import { getFormattedCurrency } from '@/lib/utils';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { List, Steps, message, notification } from 'antd';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import CheckoutForm from './checkout';
import TicketsCheckoutForm from './tickets-checkout-forms';

export type TicketOrders = {
  quantity?: number;
  quantitySold?: number;
  pendingOrders?: number;
  ticket?: any;
}

export default function TicketModal({
  event,
  isTicketModalOpen,
  handleCancel,
}) {
  const eventId = event.id;
  const { user } = useContext(TropTixContext);
  const [checkout, setCheckout] = useState<Checkout>(
    initializeCheckout(user, eventId)
  );
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>();
  const [checkoutPreviousButtonClicked, setCheckoutPreviousButtonClicked] =
    useState(false);
  const [completePurchaseClicked, setCompletePurchaseClicked] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [promotion, setPromotion] = useState<any>();

  const [current, setCurrent] = useState(0);
  const [canShowMessage, setCanShowMessage] = useState(true);
  const [clientSecret, setClientSecret] = useState<any>();
  const [messageApi, contextHolder] = message.useMessage();
  const createPaymentIntent = useCreatePaymentIntent();
  const createOrder = useCreateOrder();

  useEffect(() => {
    setCheckout(initializeCheckout(user, eventId));
  }, [user, eventId]);

  const { isPending: isFetchingTicketTypesForCheckout, data: ticketTypesWithPendingOrders } = useFetchTicketTypesForCheckout(eventId);

  useEffect(() => {
    if (!isFetchingTicketTypesForCheckout) {
      setTicketTypes(ticketTypesWithPendingOrders);
    }
  }, [isFetchingTicketTypesForCheckout, ticketTypesWithPendingOrders]);

  const checkoutSteps = [
    {
      title: 'Tickets',
      content: (
        <TicketsCheckoutForm
          event={event}
          ticketTypes={ticketTypes}
          promotion={promotion}
          setPromotion={setPromotion}
          checkout={checkout}
          setCheckout={setCheckout}
        />
      ),
    },
    {
      title: 'Checkout',
      content: (
        <CheckoutForm
          completePurchaseClicked={completePurchaseClicked}
          orderId={orderId}
          clientSecret={clientSecret}
          setCompletePurchaseClicked={setCompletePurchaseClicked}
        />
      ),
    },
  ];

  useEffect(() => {
    if (checkoutPreviousButtonClicked) {
      setCurrent(current - 1);
    }

    setCheckoutPreviousButtonClicked(false);
  }, [checkoutPreviousButtonClicked, current]);

  async function initializeStripeDetails() {
    createPaymentIntent.mutate(
      { checkout },
      {
        onSuccess: (data) => {
          const { paymentId, customerId, clientSecret } = data;

          createOrder.mutate(
            {
              checkout,
              paymentId,
              customerId,
              userId: user?.id,
              jwtToken: user?.jwtToken as string,
            },
            {
              onSuccess: (data) => {
                setClientSecret(clientSecret);
                setOrderId(data as string);
              },
              onError: (error) => {
                messageApi.error('There was an error initializing your order');
                setCurrent(1);
              },
            }
          );
        },
        onError: (error) => {
          messageApi.error('There was an error initializing your order');
          setCurrent(1);
        },
      }
    );
  }

  async function next() {
    if (checkout.email !== checkout.confirmEmail) {
      if (canShowMessage) {
        setCanShowMessage(false);
        message
          .warning('Email addresses do not match')
          .then(() => setCanShowMessage(true));
      }
      return;
    }

    if (!checkout.firstName || !checkout.lastName || !checkout.email) {
      if (canShowMessage) {
        setCanShowMessage(false);
        message
          .warning('Please fill in contact information')
          .then(() => setCanShowMessage(true));
      }
      return;
    }

    if (checkout.total === 0) {
      if (canShowMessage) {
        setCanShowMessage(false);
        message
          .warning('Please select a ticket quantity')
          .then(() => setCanShowMessage(true));
      }
      return;
    }

    messageApi.open({
      key: 'creating-order-loading',
      type: 'loading',
      content: 'Creating Order..',
      duration: 0,
    });

    const { valid, checkout: orderCheckout, ticketTypes } = await checkOrderValidity(eventId, user?.jwtToken, checkout, promotion);

    messageApi.destroy('creating-order-loading');
    if (valid) {
      initializeStripeDetails();
      setCurrent(current + 1);
    } else {
      setTicketTypes(ticketTypes);
      setCheckout(orderCheckout as Checkout);
      notification.error({
        message: `Updated Quantity`,
        description: 'Your order has been updated due to ticket availabilities. Please check and verify your updated cart.',
        placement: 'bottom',
        duration: 0,
      });
    }
  }

  async function completeStripePayment() {
    setCompletePurchaseClicked(true);
  }

  function closeModal() {
    console.log("Hello World");
    setCheckout(initializeCheckout(user, eventId));
    setCurrent(0);
    handleCancel();
  }

  if (!user) {
    return <></>;
  }

  return (
    <>
      {contextHolder}
      <Dialog
        open={isTicketModalOpen}
        onOpenChange={closeModal}
        modal={true}>
        <DialogContent className="sm:max-w-[1080px]">
          <DialogHeader>
            <DialogTitle>Ticket Checkout</DialogTitle>
          </DialogHeader>
          <div className="w-full">
            <div style={{ height: 650 }} className="flex mt-6">
              <div className="w-4/6 grow">
                <div className="flex flex-col h-full px-4">
                  <div className="w-3/4 md:mx-auto mb-6">
                    <Steps
                      current={current}
                      items={[
                        {
                          title: 'Tickets',
                        },
                        {
                          title: 'Checkout',
                        },
                      ]}
                    />
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    {
                      isFetchingTicketTypesForCheckout ?
                        <div className="mt-32">
                          <Spinner text={'Initializing Checkout'} />
                        </div>
                        :
                        <div className="grow">{checkoutSteps[current].content}</div>
                    }
                  </div>
                  <div className="flex flex-end content-end items-end self-end mt-4">
                    {current === 0 && (
                      <Button
                        onClick={next}
                        className="w-full px-6 py-6 shadow-md items-center justify-center font-medium inline-flex"
                      >
                        Continue
                      </Button>
                    )}
                    {current === 1 && (
                      <div className="flex w-full">
                        <Button
                          onClick={completeStripePayment}
                          disabled={!clientSecret}
                          className="ml-2 w-full px-6 py-6 shadow-md items-center justify-center font-medium inline-flex"
                        >
                          Complete Purchase
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-2/6 ml-8 overflow-y-auto border-l pl-12 pr-6">
                <div className="mx-auto text-center">
                  <div className="text-center justify-center">
                    <Image
                      height={200}
                      width={200}
                      src={event?.imageUrl}
                      alt={event.name}
                      style={{
                        maxHeight: 200,
                        maxWidth: 200,
                        objectFit: 'fill',
                      }}
                      className="mb-8 max-h-full flex-shrink-0 self-center object-fill overflow-hidden rounded-lg mx-auto"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-4 md:mt-4 md:mb-8 my-auto w-full">
                    {checkout.tickets.size === 0 ? (
                      <div className="mx-auto my-auto w-full text-center justify-center align-center">
                        <ShoppingCartOutlined className="text-3xl mx-auto mt-2" />
                        <div className="text-base">Cart is empty</div>
                      </div>
                    ) : (
                      <div>
                        <h2
                          className="text-xl font-bold leading-tighter tracking-tighter mb-4"
                          data-aos="zoom-y-out"
                        >
                          Order Summary
                        </h2>
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
                              quantitySelected = summary.quantitySelected;
                            }
                            return (
                              <List.Item style={{ padding: 0 }}>
                                <div className="w-full flex my-4">
                                  <div className="grow">
                                    <div className="text-sm">
                                      {summary?.quantitySelected} x{' '}
                                      {summary?.name}
                                    </div>
                                  </div>
                                  <div className="ml-4">
                                    <div className="ml-4">
                                      <div className="text-sm text-end">
                                        {getFormattedCurrency(
                                          subtotal * quantitySelected
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </List.Item>
                            );
                          }}
                        />

                        <div
                          style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: '#D3D3D3',
                          }}
                        />

                        <div className="w-full flex my-4">
                          <div className="grow">
                            <div className="text-sm">Subtotal:</div>
                            <div className="text-sm">Taxes & Fees:</div>
                          </div>
                          <div className="ml-4">
                            <div className="ml-4">
                              <div className="text-sm text-end">
                                {getFormattedCurrency(checkout.subtotal)}
                              </div>
                              <div className="text-sm text-end">
                                {getFormattedCurrency(checkout.fees)}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: '#D3D3D3',
                          }}
                        />

                        <div className="w-full flex my-4">
                          <div className="grow">
                            <div className="text-xl font-bold">Total:</div>
                          </div>
                          <div className="ml-4">
                            <div className="ml-4">
                              <div className="text-xl font-bold text-end">
                                {getFormattedCurrency(checkout.total)}{' '}
                                USD
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
