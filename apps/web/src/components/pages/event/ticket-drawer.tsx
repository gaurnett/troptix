import { TropTixContext } from '@/components/WebNavigator';
import { Spinner } from '@/components/ui/spinner';
import { Checkout, initializeCheckout } from '@/hooks/types/Checkout';
import { TicketType } from '@/hooks/types/Ticket';
import { useCreateOrder } from '@/hooks/useOrders';
import { useCreatePaymentIntent } from '@/hooks/usePostStripe';
import { checkOrderValidity, useFetchTicketTypesForCheckout } from '@/hooks/useTicketType';
import { getFormattedCurrency } from '@/lib/utils';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Button, Drawer, List, Steps, message, notification } from 'antd';
import { useContext, useEffect, useState } from 'react';
import CheckoutForm from './checkout';
import TicketsCheckoutForm from './tickets-checkout-forms';

export default function TicketDrawer({
  event,
  isTicketModalOpen,
  handleCancel,
}) {
  const eventId = event.id;
  const { user } = useContext(TropTixContext);
  const [messageApi, contextHolder] = message.useMessage();

  const [checkout, setCheckout] = useState<Checkout>(
    initializeCheckout(user, eventId)
  );
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>();
  const [checkoutPreviousButtonClicked, setCheckoutPreviousButtonClicked] =
    useState(false);
  const [completePurchaseClicked, setCompletePurchaseClicked] = useState(false);

  const [current, setCurrent] = useState(0);
  const [summaryDrawerOpen, setSummaryDrawerOpen] = useState(false);
  const [canShowMessage, setCanShowMessage] = useState(true);
  const [orderId, setOrderId] = useState('');
  const [clientSecret, setClientSecret] = useState<any>();
  const [promotion, setPromotion] = useState<any>();

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
      title: 'Ticket',
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
          orderId={orderId}
          clientSecret={clientSecret}
          completePurchaseClicked={completePurchaseClicked}
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

  useEffect(() => {
    if (isTicketModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isTicketModalOpen]);

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

  function closeSummary() {
    setSummaryDrawerOpen(false);
  }

  function closeModal() {
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
      <Drawer
        title="Ticket Checkout"
        closable={true}
        open={isTicketModalOpen}
        onClose={closeModal}
        width={900}
        styles={{ body: { padding: '0' } }}
      >
        <Drawer
          title="Order Summary"
          closable={true}
          open={summaryDrawerOpen}
          onClose={closeSummary}
          width={900}
        >
          <div className="w-full h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <div>
                {checkout.tickets.size === 0 ? (
                  <div className="mx-auto my-auto w-full text-center justify-center items-center">
                    <ShoppingCartOutlined className="text-4xl my-auto mx-auto mt-2" />
                    <div className="text-xl font-bold">Cart is empty</div>
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
                      dataSource={Array.from(checkout.tickets.keys())}
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
                          <List.Item className="mb-4" style={{ padding: 0 }}>
                            <div className="w-full flex my-4">
                              <div className="grow">
                                <div className="text-base">
                                  {summary?.quantitySelected} x {summary?.name}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="ml-4">
                                  <div className="text-base text-end">
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
                      style={{ flex: 1, height: 1, backgroundColor: '#D3D3D3' }}
                    />

                    <div className="w-full flex my-4">
                      <div className="grow">
                        <div className="text-base">Subtotal:</div>
                        <div className="text-base">Taxes & Fees:</div>
                      </div>
                      <div className="ml-4">
                        <div className="ml-4">
                          <div className="text-base text-end">
                            {getFormattedCurrency(
                              checkout.promotionApplied
                                ? checkout.discountedSubtotal
                                : checkout.subtotal
                            )}
                          </div>
                          <div className="text-base text-end">
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
                      style={{ flex: 1, height: 1, backgroundColor: '#D3D3D3' }}
                    />

                    <div className="w-full flex my-4">
                      <div className="grow">
                        <div className="text-2xl font-bold">Total:</div>
                      </div>
                      <div className="ml-4">
                        <div className="ml-4">
                          <div className="text-2xl font-bold">
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
            <footer className="border-t">
              <div className="flex flex-end content-end items-end self-end mt-4">
                <Button
                  type="primary"
                  onClick={closeSummary}
                  className="w-full px-6 py-6 shadow-md items-center bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex"
                >
                  Close
                </Button>
              </div>
            </footer>
          </div>
        </Drawer>

        <div className="w-full h-full flex flex-col">
          <div className="w-full sticky top-0 bg-white mx-auto mb-8 px-6 pt-6">
            <Steps
              responsive={false}
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
          <div className="flex-1 overflow-y-auto px-4">
            {
              isFetchingTicketTypesForCheckout ?
                <div className="mt-32">
                  <Spinner text={'Initializing Checkout'} />
                </div>
                :
                <div className="grow">{checkoutSteps[current].content}</div>
            }
          </div>
          <footer className="border-t px-6 pb-6">
            <div className="flex mt-4">
              <div className="text-xl mr-2">
                {getFormattedCurrency(
                  checkout.promotionApplied
                    ? checkout.discountedTotal
                    : checkout.total
                )}
              </div>
              <div>
                <Button
                  onClick={() => setSummaryDrawerOpen(true)}
                  type="text"
                  className="text-blue-500"
                >
                  Order Summary
                </Button>
              </div>
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
          </footer>
        </div>
      </Drawer>
    </>
  );
}
