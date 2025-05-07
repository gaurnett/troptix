'use client';

import { Button } from '@/components/ui/button';
import { getFormattedCurrency } from '@/lib/utils';
import { useState } from 'react';
import { CheckoutContainer } from './CheckoutContainer';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart } from 'lucide-react';
import CheckoutSteps from './checkout-steps';

interface TicketDrawerProps {
  event: any;
  isTicketModalOpen: boolean;
  onClose: () => void;
}

export default function TicketDrawer({
  event,
  isTicketModalOpen,
  onClose,
}: TicketDrawerProps) {
  const [summaryDrawerOpen, setSummaryDrawerOpen] = useState(false);

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
          <Sheet open={isTicketModalOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-[900px] p-0 flex flex-col h-full gap-0">
              <SheetHeader className="px-6 pt-6 pb-4  border-b">
                <SheetTitle>Ticket Checkout</SheetTitle>

                <div className="w-full my-4 flex justify-center">
                  <CheckoutSteps
                    current={current}
                    steps={['Tickets', 'Checkout']}
                  />
                </div>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {renderCheckoutStep()}
              </div>
              <SheetFooter className="border-t border-gray-200 px-6 py-4 mt-auto sticky bottom-0 bg-white">
                <div className="w-full flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <Button
                        onClick={() => setSummaryDrawerOpen(true)}
                        variant={'link'}
                        className="text-blue-600 p-0 h-auto"
                      >
                        View Order Summary
                      </Button>
                    </div>
                    <div className="text-xl font-semibold">
                      Total: {getFormattedCurrency(cartSubtotal + cartFees)}
                    </div>
                  </div>
                  <div className="flex w-full space-x-2">
                    {current === 0 && (
                      <Button
                        onClick={formMethods.handleSubmit(handleNext)}
                        className="w-full py-3 shadow-md font-medium" // Adjusted padding/size
                        size="lg"
                      >
                        {cartSubtotal === 0 ? 'RSVP' : 'Continue to Checkout'}
                      </Button>
                    )}
                    {current === 1 && (
                      <Button
                        onClick={handleCompleteStripePayment}
                        disabled={!clientSecret || cartSubtotal === 0}
                        className="w-full py-3 shadow-md font-medium"
                        size="lg"
                      >
                        {cartSubtotal === 0
                          ? 'Confirm RSVP'
                          : 'Complete Purchase'}
                      </Button>
                    )}
                  </div>
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <Sheet open={summaryDrawerOpen} onOpenChange={setSummaryDrawerOpen}>
            <SheetContent className="sm:max-w-[450px] flex flex-col h-full">
              <SheetHeader className="px-6 pt-6 pb-4 border-b">
                <SheetTitle>Order Summary</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {Object.keys(checkout?.tickets ?? {}).length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    <ShoppingCart className="h-12 w-12 mb-4" />
                    <p className="text-lg font-medium">Your cart is empty</p>
                  </div>
                ) : (
                  <div>
                    {Object.entries(checkout?.tickets ?? {}).map(
                      ([id, quantity]) => {
                        const numQuantity =
                          typeof quantity === 'number' ? quantity : 0;
                        const ticket = checkoutConfig?.tickets.find(
                          (t) => t.id === id
                        );
                        if (!ticket || numQuantity <= 0) return null;

                        return (
                          <div
                            key={id}
                            className="flex justify-between items-center py-3"
                          >
                            <div className="text-sm">
                              {numQuantity} x {ticket.name}
                            </div>
                            <div className="text-sm font-medium">
                              {getFormattedCurrency(ticket.price * numQuantity)}
                            </div>
                          </div>
                        );
                      }
                    )}

                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>{getFormattedCurrency(cartSubtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Taxes & Fees:</span>
                        <span>{getFormattedCurrency(cartFees)}</span>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-lg font-semibold">
                        {getFormattedCurrency(cartSubtotal + cartFees)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <SheetFooter className="border-t border-gray-200 px-6 py-4 mt-auto">
                <SheetClose asChild>
                  <Button variant="outline" className="w-full py-3" size="lg">
                    Close
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </>
      )}
    </CheckoutContainer>
  );
}
