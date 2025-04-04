import { Button } from '@/components/ui/button';
import { getFormattedCurrency } from '@/lib/utils';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Drawer, List, Steps } from 'antd';
import { useState } from 'react';
import { CheckoutContainer } from './CheckoutContainer';

export default function TicketDrawer({
  event,
  isTicketModalOpen,
  handleCancel,
}) {
  const [summaryDrawerOpen, setSummaryDrawerOpen] = useState(false);

  const closeSummary = () => {
    setSummaryDrawerOpen(false);
  };

  return (
    <CheckoutContainer
      event={event}
      isOpen={isTicketModalOpen}
      onClose={handleCancel}
    >
      {({
        isFree,
        current,
        checkout,
        clientSecret,
        handleNext,
        handleCompleteStripePayment,
        renderCheckoutStep,
      }) => (
        <>
          <Drawer
            title="Ticket Checkout"
            closable={true}
            open={isTicketModalOpen}
            onClose={handleCancel}
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
                  <div className="text-xl mr-2">
                    {getFormattedCurrency(checkout.total)}
                  </div>
                  <div>
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
                      onClick={handleNext}
                      className="w-full px-6 py-6 shadow-md items-center justify-center font-medium inline-flex"
                    >
                      {isFree ? 'RSVP' : 'Continue'}
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
                                    {summary?.quantitySelected} x{' '}
                                    {summary?.name}
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
                              {getFormattedCurrency(checkout.subtotal)}
                            </div>
                            <div className="text-base text-end">
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
                          <div className="text-2xl font-bold">Total:</div>
                        </div>
                        <div className="ml-4">
                          <div className="ml-4">
                            <div className="text-2xl font-bold">
                              {getFormattedCurrency(checkout.total)} USD
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
