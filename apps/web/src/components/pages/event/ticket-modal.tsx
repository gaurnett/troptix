import { TropTixContext } from '@/components/WebNavigator';
import { Spinner } from '@/components/ui/spinner';
import { Checkout, CheckoutTicket, initializeCheckout } from '@/hooks/types/Checkout';
import { TicketType } from '@/hooks/types/Ticket';
import { GetOrdersRequest, GetOrdersType, getOrders, useCreateOrder, useFetchPendingEventOrders } from '@/hooks/useOrders';
import { useCreatePaymentIntent } from '@/hooks/usePostStripe';
import { calculateFees, normalizePrice } from '@/lib/utils';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Button, List, Modal, Steps, message, notification } from 'antd';
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
  const [pendingOrders, setPendingOrders] = useState<Map<string, TicketOrders>>();
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

  const { isPending: isFetchingPendingOrdersPending, data: ordersPending } = useFetchPendingEventOrders(eventId);

  useEffect(() => {
    if (!isFetchingPendingOrdersPending) {
      setPendingOrders(ordersPending);
    }
  }, [isFetchingPendingOrdersPending, ordersPending]);

  const checkoutSteps = [
    {
      title: 'Tickets',
      content: (
        <TicketsCheckoutForm
          event={event}
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

  async function checkOrderValidity(): Promise<boolean> {
    const pendingOrderRequest: GetOrdersRequest = {
      getOrdersType: GetOrdersType.GET_PENDING_ORDERS_FOR_EVENT,
      id: eventId,
      jwtToken: user.jwtToken
    }

    return getOrders(pendingOrderRequest)
      .then((orders: [string, TicketOrders][]) => {
        let validOrder = true;
        for (let [key, value] of orders) {
          const quantitySold = value.quantitySold as number;
          const pendingOrder = value.pendingOrders as number;
          const quantity = value.quantity as number;
          const selectedTicket = checkout.tickets.get(key);

          if (selectedTicket) {
            const quantitySelected = selectedTicket.quantitySelected;
            const currentPendingAndSoldTotal = pendingOrder + quantitySold;
            if (currentPendingAndSoldTotal === quantity) {
              validOrder = false;
              updateTicketQuantities(value.ticket, quantitySelected);
            }

            if (currentPendingAndSoldTotal + quantitySelected > quantity) {
              validOrder = false;
              updateTicketQuantities(value.ticket, (currentPendingAndSoldTotal + quantitySelected) - quantity);
            }
          }
        }

        return validOrder;
      }).catch(error => {
        return false;
      });
  }

  function getPromotionPrice(price) {
    if (checkout.promotionApplied && promotion) {
      switch (promotion.promotionType) {
        case 'PERCENTAGE':
          return price - price * (promotion.value / 100);
        case 'DOLLAR_AMOUNT':
          return price - promotion.value;
      }
    }

    return price;
  }

  function updateTicketQuantities(ticket, quantity) {
    const ticketTypeId = ticket.ticketTypeId;
    const ticketTypes = event.ticketTypes as TicketType[];
    const ticketType = ticketTypes.find(value => value.id = ticketTypeId);

    if (!ticketType) {
      return;
    }

    const price = normalizePrice(ticketType.price);
    var ticketSubtotal = price;
    var ticketFees =
      ticketType.ticketingFees === 'PASS_TICKET_FEES' ? calculateFees(price) : 0;

    const updatedTickets = checkout.tickets;
    if (checkout.tickets.has(ticketTypeId)) {
      const checkoutTicket = checkout.tickets.get(ticketTypeId) as CheckoutTicket;
      const quantitySelected = checkoutTicket.quantitySelected;
      checkoutTicket.quantitySelected = quantitySelected - quantity;

      if (checkoutTicket.quantitySelected === 0) {
        updatedTickets.delete(ticketTypeId);
      } else {
        updatedTickets.set(ticketTypeId, checkoutTicket);
      }
    }

    var checkoutSubtotal = normalizePrice(checkout.subtotal) - (ticketSubtotal * quantity);
    var checkoutFees = normalizePrice(checkout.fees) - (ticketFees * quantity);
    var checkoutTotal = normalizePrice(checkoutSubtotal + checkoutFees);

    setCheckout((previousOrder) => ({
      ...previousOrder,
      tickets: updatedTickets,
      total: checkoutTotal,
      fees: checkoutFees,
      subtotal: checkoutSubtotal,
    }));

    if (checkout.promotionApplied) {
      setCheckout((previousOrder) => ({
        ...previousOrder,
        ['discountedSubtotal']: getPromotionPrice(checkoutSubtotal),
        ['discountedFees']: getPromotionPrice(checkoutFees),
        ['discountedTotal']: getPromotionPrice(checkoutTotal),
      }));
    }
  }

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
              userId: user.id,
              jwtToken: user.jwtToken as string,
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

    if (!user || !user.id) {
      if (canShowMessage) {
        setCanShowMessage(false);
        message
          .warning('There was an error initializing order. Please try again')
          .then(() => setCanShowMessage(true));
      }
      return;
    }

    const isOrderValid = await checkOrderValidity();

    if (isOrderValid) {
      console.log("Success!")
      initializeStripeDetails();
      setCurrent(current + 1);
    } else {
      notification.error({
        message: `Updated Quantity`,
        description: 'Your order has been updated due to ticket availabilities. Please check and verify your updated cart.',
        placement: 'bottom',
        duration: 0,
      });
    }
  }

  const prev = () => {
    setCurrent(current - 1);
  };

  async function completeStripePayment() {
    setCompletePurchaseClicked(true);
  }

  function closeModal() {
    setCheckout(initializeCheckout(user, eventId));
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
    return <></>;
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
          <div style={{ height: 650 }} className="flex mt-6">
            <div className="w-4/6 grow">
              <div className="flex flex-col h-full px-12">
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
                    isFetchingPendingOrdersPending ?
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
                      type="primary"
                      onClick={next}
                      className="w-full px-6 py-6 shadow-md items-center bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex"
                    >
                      Continue
                    </Button>
                  )}
                  {current === 1 && (
                    <div className="flex w-full">
                      <Button
                        type="primary"
                        onClick={completeStripePayment}
                        disabled={!clientSecret}
                        className="ml-2 w-full px-6 py-6 shadow-md items-center bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex"
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
                              {getFormattedCurrency(
                                checkout.promotionApplied
                                  ? checkout.discountedSubtotal
                                  : checkout.subtotal
                              )}
                            </div>
                            <div className="text-sm text-end">
                              {getFormattedCurrency(
                                checkout.promotionApplied
                                  ? checkout.discountedFees
                                  : checkout.fees
                              )}
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
                              {getFormattedCurrency(
                                checkout.promotionApplied
                                  ? checkout.discountedTotal
                                  : checkout.total
                              )}{' '}
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
      </Modal>
    </>
  );
}
