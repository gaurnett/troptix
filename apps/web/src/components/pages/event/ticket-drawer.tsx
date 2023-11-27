import { TropTixContext } from '@/components/WebNavigator';
import {
  ShoppingCartOutlined
} from '@ant-design/icons';
import { Button, Drawer, List, Steps, message } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { Checkout } from 'troptix-models';
import BillingForm from './billing-form';
import CheckoutForm from './checkout';
import TicketsCheckoutForm from './tickets-checkout-forms';

export default function TicketDrawer({ event, isTicketModalOpen, setIsTicketModalOpen, handleCancel }) {
  const { user } = useContext(TropTixContext);

  const [checkout, setCheckout] = useState<any>({});
  const [checkoutPreviousButtonClicked, setCheckoutPreviousButtonClicked] = useState(false);
  const [completePurchaseClicked, setCompletePurchaseClicked] = useState(false);

  const [current, setCurrent] = useState(0);
  const [steps, setSteps] = useState<any>([]);
  const [fetchingCheckout, setFetchingCheckout] = useState(true);
  const [summaryDrawerOpen, setSummaryDrawerOpen] = useState(false);
  const [isStripeLoaded, setIsStripeLoaded] = useState(false);
  const [canShowMessage, setCanShowMessage] = useState(true);

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
        content: <CheckoutForm
          checkout={checkout}
          event={event}
          setIsStripeLoaded={setIsStripeLoaded}
          completePurchaseClicked={completePurchaseClicked}
          setCompletePurchaseClicked={setCompletePurchaseClicked} />
      },
    ])
  }, [checkout, event, completePurchaseClicked]);

  useEffect(() => {
    if (checkoutPreviousButtonClicked) {
      setCurrent(current - 1);
    }

    setCheckoutPreviousButtonClicked(false);
  }, [checkoutPreviousButtonClicked, current])

  useEffect(() => {
    if (isTicketModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isTicketModalOpen]);

  function checkUndefinedOrNull(value) {
    return value === undefined || value == null || value == "";
  }

  async function next() {
    if (current === 0) {
      if (checkout.total === 0) {
        if (canShowMessage) {
          setCanShowMessage(false);
          message.warning("Please select a ticket quantity")
            .then(() => setCanShowMessage(true));
        }
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
        if (canShowMessage) {
          setCanShowMessage(false);
          message.warning("Please fill in required fields")
            .then(() => setCanShowMessage(true));
        }
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

  function getFormattedCurrency(price) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    return formatter.format(price);
  }

  function closeSummary() {
    setSummaryDrawerOpen(false);
  }

  function closeModal() {
    setIsStripeLoaded(false);
    handleCancel()
  }

  return (
    <>
      {
        fetchingCheckout ? <></> :
          <Drawer
            title="Ticket Checkout"
            closable={true}
            open={isTicketModalOpen}
            onClose={closeModal}
            width={900}
          >
            <Drawer
              title="Order Summary"
              closable={true}
              open={summaryDrawerOpen}
              onClose={closeSummary}
              width={900}
            >
              <div className="w-full h-full flex flex-col">
                <div className='flex-1 overflow-y-auto'>
                  <div>
                    {
                      checkout.tickets.size === 0 ?
                        <div className='mx-auto my-auto w-full text-center justify-center items-center'>
                          <ShoppingCartOutlined className='text-4xl my-auto mx-auto mt-2' />
                          <div className='text-xl font-bold'>Cart is empty</div>
                        </div> :
                        <div>
                          <h2 className="text-xl font-bold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out">Order Summary</h2>
                          <List
                            itemLayout="vertical"
                            size="large"
                            dataSource={Array.from(checkout.tickets.keys())}
                            split={false}
                            renderItem={(id: any, index: number) => {
                              const summary = checkout.tickets.get(id)
                              return (
                                <List.Item
                                  className='mb-4'
                                  style={{ padding: 0 }}>
                                  <div className='w-full flex my-4'>
                                    <div className='grow'>
                                      <div className='text-base'>
                                        {summary?.quantitySelected} x {summary.name}
                                      </div>
                                    </div>
                                    <div className='ml-4'>
                                      <div className='ml-4'>
                                        <div className='text-base text-end'>{getFormattedCurrency(summary?.subtotal * summary.quantitySelected)}</div>
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
                              <div className='text-base'>Subtotal:</div>
                              <div className='text-base'>Taxes & Fees:</div>
                            </div>
                            <div className='ml-4'>
                              <div className='ml-4'>
                                <div className='text-base text-end'>{getFormattedCurrency(checkout.promotionApplied ? checkout.discountedSubtotal : checkout.subtotal)}</div>
                                <div className='text-base text-end'>{getFormattedCurrency(checkout.promotionApplied ? checkout.discountedFees : checkout.fees)}</div>
                              </div>
                            </div>
                          </div>

                          <div style={{ flex: 1, height: 1, backgroundColor: '#D3D3D3' }} />

                          <div className='w-full flex my-4'>
                            <div className='grow'>
                              <div className='text-2xl font-bold'>Total:</div>
                            </div>
                            <div className='ml-4'>
                              <div className='ml-4'>
                                <div className='text-2xl font-bold'>
                                  {getFormattedCurrency(checkout.promotionApplied ? checkout.discountedTotal : checkout.total)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                    }
                  </div>
                </div>
                <footer className='border-t'>
                  <div className='flex flex-end content-end items-end self-end mt-4'>
                    <Button
                      type="primary"
                      onClick={closeSummary}
                      className="w-full px-6 py-6 shadow-md items-center bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex">
                      Close
                    </Button>
                  </div>
                </footer>
              </div>
            </Drawer>

            <div className="w-full h-full flex flex-col">
              <div className='w-full sticky top-0 bg-white mx-auto mb-8'>
                <Steps
                  responsive={false}
                  current={current} items={[
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
              <div className='flex-1 overflow-y-auto'>
                <div className=''>{steps[current].content}</div>
              </div>
              <footer className='border-t'>
                <div className='flex mt-4'>
                  <div className='text-xl mr-2'>
                    {getFormattedCurrency(checkout.promotionApplied ? checkout.discountedTotal : checkout.total)}
                  </div>
                  <div>
                    <Button onClick={() => setSummaryDrawerOpen(true)} type='text' className='text-blue-500'>Order Summary</Button>
                  </div>
                </div>
                <div className='flex flex-end content-end items-end self-end mt-4'>
                  {current === 0 && (
                    <Button
                      type="primary"
                      onClick={next}
                      className="w-full px-6 py-6 shadow-md items-center bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex">
                      Continue
                    </Button>
                  )}
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
              </footer>
            </div>
          </Drawer>
      }
    </>
  );
}