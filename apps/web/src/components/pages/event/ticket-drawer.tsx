import { Button } from '@/components/ui/button';
import { getFormattedCurrency } from '@/lib/utils';
import { ShoppingCart } from 'lucide-react';
import { Drawer, List, Steps } from 'antd';
import { useState } from 'react';
import { CheckoutContainer } from './CheckoutContainer';

export default function TicketDrawer({ event, isTicketModalOpen, onClose }) {
  const [summaryDrawerOpen, setSummaryDrawerOpen] = useState(false);

  const closeSummary = () => {
    setSummaryDrawerOpen(false);
  };

  return (
    <CheckoutContainer
      event={event}
      isOpen={isTicketModalOpen}
      onClose={onClose}
    >
      {({
        current,
        checkout,
        clientSecret,
        handleNext,
        handleCompleteStripePayment,
        renderCheckoutStep,
        formMethods,
        checkoutConfig,
        cartSubtotal,
        cartFees,
      }) => (
        <>
          <Drawer
            title="Ticket Checkout"
            closable={true}
            open={isTicketModalOpen}
            onClose={onClose}
            width={900}
            styles={{ body: { padding: '0' } }}
          >
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
                {renderCheckoutStep()}
              </div>
              <footer className="border-t border-gray-200 px-6 pb-6">
                <div className="flex mt-4">
                  <div>
                    <div className="text-xl mr-2">
                      {getFormattedCurrency(cartSubtotal + cartFees)}
                    </div>
                    <Button
                      onClick={() => setSummaryDrawerOpen(true)}
                      variant={'ghost'}
                      className="text-blue-500"
                    >
                      Order Summary
                    </Button>
                  </div>
                </div>
                <div className="flex flex-end content-end items-end self-end mt-4">
                  {current === 0 && (
                    <Button
                      onClick={formMethods.handleSubmit(handleNext)}
                      className="w-full px-6 py-6 shadow-md items-center justify-center font-medium inline-flex"
                    >
                      {cartSubtotal === 0 ? 'RSVP' : 'Continue'}
                    </Button>
                  )}
                  {current === 1 && (
                    <div className="flex w-full">
                      <Button
                        onClick={handleCompleteStripePayment}
                        disabled={!clientSecret}
                        className="ml-2 w-full px-6 py-6 shadow-md items-center justify-center font-medium inline-flex"
                      >
                        Complete Purchase
                      </Button>
                    </div>
                  )}
                </div>
              </footer>
            </div>
          </Drawer>

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
                      <ShoppingCart className="text-4xl my-auto mx-auto mt-2" />
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
                        dataSource={Object.keys(checkout?.tickets)}
                        split={false}
                        renderItem={(id: any, index: number) => {
                          const quantity = checkout?.tickets[id];
                          const ticket = checkoutConfig?.tickets.find(
                            (ticket) => ticket.id === id
                          );
                          return (
                            <List.Item className="mb-4" style={{ padding: 0 }}>
                              <div className="w-full flex my-4">
                                <div className="grow">
                                  <div className="text-base">
                                    {quantity} x {ticket?.name}
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="ml-4">
                                    <div className="text-base text-end">
                                      {getFormattedCurrency(
                                        (ticket?.price || 0) * quantity
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
                          <div className="text-base">Subtotal:</div>
                          <div className="text-base">Taxes & Fees:</div>
                        </div>
                        <div className="ml-4">
                          <div className="ml-4">
                            <div className="text-base text-end">
                              {getFormattedCurrency(cartSubtotal)}
                            </div>
                            <div className="text-base text-end">
                              {getFormattedCurrency(cartFees)}
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
                          <div className="text-2xl font-bold">Total:</div>
                        </div>
                        <div className="ml-4">
                          <div className="ml-4">
                            <div className="text-2xl font-bold">
                              {getFormattedCurrency(cartSubtotal + cartFees)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <footer className="border-t border-gray-200">
                <div className="flex flex-end content-end items-end self-end mt-4">
                  <Button
                    onClick={closeSummary}
                    className="w-full px-6 py-6 shadow-md items-center justify-center font-medium inline-flex"
                  >
                    Close
                  </Button>
                </div>
              </footer>
            </div>
          </Drawer>
        </>
      )}
    </CheckoutContainer>
  );
}
