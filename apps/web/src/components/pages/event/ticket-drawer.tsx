import { Button } from '@/components/ui/button';
import { getFormattedCurrency } from '@/lib/utils';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { CheckoutContainer } from './CheckoutContainer';
import { CheckoutSteps } from '@/components/pages/event/checkout-steps';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

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
        current,
        checkout,
        clientSecret,
        handleNext,
        handleCompleteStripePayment,
        renderCheckoutStep,
      }) => (
        <>
          <Sheet open={isTicketModalOpen} onOpenChange={handleCancel}>
            <SheetContent
              side="right"
              className="w-full sm:w-[540px] md:w-[680px] lg:w-[900px] p-0"
            >
              <div className="w-full h-full flex flex-col">
                <SheetHeader className="px-4 sm:px-6 pt-6">
                  <SheetTitle>Ticket Checkout</SheetTitle>
                </SheetHeader>
                <div className="w-full sticky top-0 bg-background mx-auto mb-6 sm:mb-8 px-4 sm:px-6 pt-6">
                  <CheckoutSteps
                    current={current}
                    steps={[{ title: 'Tickets' }, { title: 'Checkout' }]}
                  />
                </div>
                <div className="flex-1 overflow-y-auto px-4 sm:px-6">
                  {renderCheckoutStep()}
                </div>
                <footer className="border-t border-border px-4 sm:px-6 pb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center mt-4 gap-2">
                    <div className="text-xl">
                      {getFormattedCurrency(checkout.total)}
                    </div>
                    <div className="sm:ml-2">
                      <Button
                        onClick={() => setSummaryDrawerOpen(true)}
                        variant="ghost"
                        className="text-primary w-full sm:w-auto"
                      >
                        Order Summary
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-end content-end items-end self-end mt-4">
                    {current === 0 && (
                      <Button
                        onClick={handleNext}
                        className="w-full px-4 sm:px-6 py-4 sm:py-6 shadow-md items-center justify-center font-medium inline-flex"
                      >
                        Continue
                      </Button>
                    )}
                    {current === 1 && (
                      <div className="flex w-full">
                        <Button
                          onClick={handleCompleteStripePayment}
                          disabled={!clientSecret}
                          className="w-full px-4 sm:px-6 py-4 sm:py-6 shadow-md items-center justify-center font-medium inline-flex"
                        >
                          Complete Purchase
                        </Button>
                      </div>
                    )}
                  </div>
                </footer>
              </div>
            </SheetContent>
          </Sheet>

          <Sheet open={summaryDrawerOpen} onOpenChange={closeSummary}>
            <SheetContent side="right" className="w-full p-0">
              <div className="w-full h-full flex flex-col">
                <SheetHeader className="px-4 sm:px-6 pt-6">
                  <SheetTitle>Order Summary</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto px-4 sm:px-6">
                  <div className="py-4">
                    {checkout.tickets.size === 0 ? (
                      <div className="mx-auto my-auto w-full text-center justify-center items-center">
                        <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mt-2" />
                        <div className="text-lg sm:text-xl font-bold">
                          Cart is empty
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h2
                          className="text-lg sm:text-xl font-bold leading-tighter tracking-tighter mb-4"
                          data-aos="zoom-y-out"
                        >
                          Order Summary
                        </h2>
                        <div className="space-y-3 sm:space-y-4">
                          {Array.from(checkout.tickets.keys()).map((id) => {
                            const summary = checkout.tickets.get(id);
                            const subtotal = summary?.subtotal ?? 0;
                            const quantitySelected =
                              summary?.quantitySelected ?? 0;

                            return (
                              <div
                                key={id}
                                className="w-full flex items-center"
                              >
                                <div className="grow">
                                  <div className="text-sm sm:text-base">
                                    {summary?.quantitySelected} x{' '}
                                    {summary?.name}
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm sm:text-base text-end">
                                    {getFormattedCurrency(
                                      subtotal * quantitySelected
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="h-px bg-border my-4 sm:my-6" />

                        <div className="w-full flex items-center my-3 sm:my-4">
                          <div className="grow space-y-2">
                            <div className="text-sm sm:text-base">
                              Subtotal:
                            </div>
                            <div className="text-sm sm:text-base">
                              Taxes & Fees:
                            </div>
                          </div>
                          <div className="ml-4 space-y-2">
                            <div className="text-sm sm:text-base text-end">
                              {getFormattedCurrency(checkout.subtotal)}
                            </div>
                            <div className="text-sm sm:text-base text-end">
                              {getFormattedCurrency(checkout.fees)}
                            </div>
                          </div>
                        </div>

                        <div className="h-px bg-border my-4 sm:my-6" />

                        <div className="w-full flex items-center">
                          <div className="grow">
                            <div className="text-xl sm:text-2xl font-bold">
                              Total:
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-xl sm:text-2xl font-bold text-end">
                              {getFormattedCurrency(checkout.total)} USD
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <footer className="border-t border-border mt-auto">
                  <div className="p-4 sm:p-6">
                    <Button
                      onClick={closeSummary}
                      className="w-full px-4 sm:px-6 py-4 sm:py-6 shadow-md items-center justify-center font-medium inline-flex"
                    >
                      Close
                    </Button>
                  </div>
                </footer>
              </div>
            </SheetContent>
          </Sheet>
        </>
      )}
    </CheckoutContainer>
  );
}
