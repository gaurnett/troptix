import { TropTixContext } from '@/components/WebNavigator';
import {
  ShoppingCartOutlined
} from '@ant-design/icons';
import { Button, Image, List, Modal, Steps, message } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { Checkout } from 'troptix-models';
import BillingForm from './billing-form';
import CheckoutForm from './checkout';
import TicketsCheckoutForm from './tickets-checkout-forms';

export default function TicketModal({ event, isTicketModalOpen, setIsTicketModalOpen, handleCancel }) {
  const { user } = useContext(TropTixContext);
  const [checkout, setCheckout] = useState<any>({});
  const [checkoutPreviousButtonClicked, setCheckoutPreviousButtonClicked] = useState(false);
  const [completePurchaseClicked, setCompletePurchaseClicked] = useState(false);

  const [current, setCurrent] = useState(0);
  const [steps, setSteps] = useState<any>([]);
  const [fetchingCheckout, setFetchingCheckout] = useState(true);
  const [isStripeLoaded, setIsStripeLoaded] = useState(false);
  const [canShowMessage, setCanShowMessage] = useState(true);

  useEffect(() => {
    if (isTicketModalOpen) {
      setCheckout(new Checkout(user));
      setCurrent(0);
      setFetchingCheckout(false);
    }

  }, [isTicketModalOpen, user]);

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
          completePurchaseClicked={completePurchaseClicked}
          checkout={checkout}
          event={event}
          setCompletePurchaseClicked={setCompletePurchaseClicked}
          setIsStripeLoaded={setIsStripeLoaded} />
      },
    ])
  }, [checkout, event, completePurchaseClicked]);

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

  function closeModal() {
    setIsStripeLoaded(false);
    handleCancel();
  }

  function getFormattedCurrency(price) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    return formatter.format(price);
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
            width={1080}
          >
            <div className="w-full">
              <div style={{ maxHeight: 600 }} className='flex mt-6'>
                <div className='w-4/6 grow'>
                  <div className='flex flex-col h-full px-12'>
                    <div className='w-3/4 md:mx-auto mb-6'>
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

                    <div className='flex-1 overflow-y-auto'>
                      <div className='grow'>
                        {steps[current].content}
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
                </div>
                <div className='w-2/6 ml-8 overflow-y-auto border-l pl-12 pr-6'>
                  <div className='mx-auto text-center'>
                    <Image
                      height={250}
                      width={250}
                      src={event?.imageUrl}
                      alt={event.name}
                      className="mb-8 max-h-full flex-shrink-0 self-center object-fill overflow-hidden rounded-lg"
                    />
                  </div>

                  <div>
                    <div className='mb-4 md:mt-4 md:mb-8 my-auto w-full'>
                      {
                        checkout.tickets.size === 0 ?
                          <div className='mx-auto my-auto w-full text-center justify-center align-center'>
                            <ShoppingCartOutlined className='text-4xl mx-auto mt-2' />
                            <div className='text-xl'>Cart is empty</div>
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
                                    style={{ padding: 0 }}>
                                    <div className='w-full flex my-4'>
                                      <div className='grow'>
                                        <div className='text-sm'>
                                          {summary?.quantitySelected} x {summary.name}
                                        </div>
                                      </div>
                                      <div className='ml-4'>
                                        <div className='ml-4'>
                                          <div className='text-sm text-end'>{getFormattedCurrency(summary?.subtotal * summary.quantitySelected)}</div>
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
                                    {getFormattedCurrency(checkout.promotionApplied ? checkout.discountedTotal : checkout.total)}
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
      }
    </>
  );
}