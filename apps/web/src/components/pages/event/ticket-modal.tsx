import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getFormattedCurrency } from '@/lib/utils';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { List, Steps } from 'antd';
import Image from 'next/image';
import { CheckoutContainer } from './CheckoutContainer';

export default function TicketModal({
  event,
  isTicketModalOpen,
  handleCancel,
}) {
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
        formMethods,
        ticketTypes,
      }) => (
        <Dialog
          open={isTicketModalOpen}
          onOpenChange={handleCancel}
          modal={true}
        >
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
                      {renderCheckoutStep()}
                    </div>
                    <div className="flex flex-end content-end items-end self-end mt-4">
                      {current === 0 && (
                        <Button
                          onClick={formMethods.handleSubmit(handleNext)}
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
                              let price = 0;
                              const summary = checkout.tickets.get(id);
                              if (ticketTypes) {
                                const ticketType = ticketTypes.find(
                                  (ticket) => ticket.id === id
                                );
                                price = ticketType?.price ?? 0;
                              }
                              // Removed unnecessary console.log statement.
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
                                            price * quantitySelected
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

                          <div
                            style={{
                              flex: 1,
                              height: 1,
                              backgroundColor: '#D3D3D3',
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </CheckoutContainer>
  );
}
