import { TropTixContext } from '@/components/AuthProvider';
import { Spinner } from '@/components/ui/spinner';
import { message } from 'antd';
import { ReactNode, useContext, useEffect, useState } from 'react';
import CheckoutForm from './checkout';
import TicketsCheckoutForm from './tickets-checkout-forms';
import { useRouter } from 'next/router';
import { UseFormReturn, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  userDetailsSchema,
  UserDetailsFormData,
} from '@/lib/schemas/checkoutSchema';
import {
  InitiateCheckoutVariables,
  useFetchCheckoutConfig,
  useInitiateCheckout,
} from '@/hooks/useCheckout';

import { CheckoutConfigResponse, ValidationResponse } from '@/types/checkout';
import { AdjustmentConfirmationModal } from './confirmation-modal';

interface CheckoutContainerProps {
  event: any;
  isOpen: boolean;
  onClose: () => void;
  children: (props: {
    current: number;
    checkout: CheckoutState;
    checkoutConfig: CheckoutConfigResponse | undefined;
    isFetchingCheckoutConfig: boolean;
    clientSecret: string | null;
    orderId: string | null;
    completePurchaseClicked: boolean;
    promotion: any;
    setPromotion: (promotion: any) => void;
    handleNext: (userDetails: UserDetailsFormData) => Promise<void>;
    handleCompleteStripePayment: () => void;
    renderCheckoutStep: () => ReactNode;
    formMethods: UseFormReturn<UserDetailsFormData>;
    cartSubtotal: number;
    cartFees: number;
  }) => ReactNode;
}

export interface CheckoutState {
  eventId: string;
  tickets: Record<string, number>;
}
/**
 * Calculate the cart total, subtotal, and fees on the client only to give a better user experience
 * @param checkout - The checkout state
 * @param checkoutConfig - The checkout config
 * @returns The cart total, subtotal, and fees
 */

export function CheckoutContainer({
  event,
  isOpen,
  onClose,
  children,
}: CheckoutContainerProps) {
  const { user } = useContext(TropTixContext);
  const eventId = event.id;

  // This is the state of the checkout form
  const [checkout, setCheckout] = useState<CheckoutState>({
    eventId: eventId,
    tickets: {},
  });

  // This is the form methods for the checkout form for the user details
  const formMethods = useForm<UserDetailsFormData>({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      confirmEmail: user?.email || '',
    },
    mode: 'onBlur',
  });
  const router = useRouter();
  const initiateCheckoutMutation = useInitiateCheckout();

  const [messageApi, contextHolder] = message.useMessage();
  const [completePurchaseClicked, setCompletePurchaseClicked] =
    useState<boolean>(false);
  const [current, setCurrent] = useState<number>(0);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [promotion, setPromotion] = useState<any>();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);
  const [confirmationData, setConfirmationData] =
    useState<ValidationResponse | null>(null);

  // When the modal is opened, make sure the state is reset
  // TODO: We should move the rendering of the modal and drawer in the container so
  // This ensures that the CheckoutContainer is responsible for all checkout logic
  useEffect(() => {
    if (isOpen) {
      setCurrent(0);
      setCheckout((prev) => ({ ...prev, tickets: {} }));
      setIsConfirmationOpen(false);
      setConfirmationData(null);
      setClientSecret(null);
      setOrderId(null);
    }
  }, [isOpen]);

  const { isPending: isFetchingCheckoutConfig, data: checkoutConfig } =
    useFetchCheckoutConfig(eventId);

  const { cartSubtotal, cartFees } = calculateCart(checkout, checkoutConfig);

  async function handleNext(userDetails: UserDetailsFormData) {
    if (Object.keys(checkout.tickets).length === 0) {
      messageApi.warning('Please select a ticket quantity');
      return;
    }

    const variables: InitiateCheckoutVariables = {
      eventId: eventId,
      selectedTickets: checkout.tickets,
      userDetails: userDetails,
      promotionCode: promotion?.code,
    };

    messageApi.open({
      key: 'initiating-checkout',
      type: 'loading',
      content: 'Confirming Availability...',
      duration: 0,
    });

    initiateCheckoutMutation.mutate(variables, {
      onSuccess: (validationResponse) => {
        messageApi.destroy('initiating-checkout');

        if (!validationResponse.isValid) {
          messageApi.error(
            validationResponse.message || 'Could not confirm availability.'
          );
          // Clear the tickets from the checkout state
          setCheckout((prev) => ({ ...prev, tickets: {} }));
          return;
        }

        if (!validationResponse.orderId) {
          messageApi.error('An error occurred. Please try again later.');
          return;
        }

        // Store the IDs of the created pending order and secret
        setOrderId(validationResponse.orderId);
        setClientSecret(validationResponse.clientSecret);

        // Update the cart state to match the server's validated/adjusted items
        const updatedTickets: Record<string, number> = {};
        validationResponse.validatedItems.forEach((item) => {
          updatedTickets[item.ticketTypeId] = item.validatedQuantity;
        });
        setCheckout((prev) => ({ ...prev, tickets: updatedTickets }));

        // Check if adjustments require user confirmation via modal
        if (validationResponse.wasAdjusted) {
          setConfirmationData(validationResponse);
          setIsConfirmationOpen(true);
        } else {
          // Everything if valid so can just proceed
          proceedToNextStep(validationResponse);
        }
      },
      onError: (error) => {
        messageApi.destroy('initiating-checkout');
        console.error('Checkout Initiation Mutation Failed:', error);
      },
    });
  }

  /**
   * Handles moving to the next step after successful validation/initiation.
   * Called directly if no adjustments, or after user confirms adjustments.
   * @param response - The successful ValidationResponse from the API
   */
  function proceedToNextStep(response: ValidationResponse) {
    if (response.isFree) {
      messageApi.success('RSVP Confirmed!');
      router.push(`/orders/order-confirmation?orderId=${response.orderId}`); // Adjust query param name if needed
    } else if (!response.isFree && response.clientSecret) {
      setCurrent((prev) => prev + 1);
    } else {
      // Should not happen but just in case
      messageApi.error(
        'Could not prepare payment. Please check details or try again later.'
      );
    }
  }
  // TODO: Review this
  function handleCompleteStripePayment() {
    setCompletePurchaseClicked(true);
  }

  const renderCheckoutStep = () => {
    if (isFetchingCheckoutConfig || !checkoutConfig) {
      return (
        <div className="mt-32">
          <Spinner text={'Initializing Checkout'} />
        </div>
      );
    }

    return current === 0 ? (
      <TicketsCheckoutForm
        checkoutConfig={checkoutConfig}
        checkout={checkout}
        setCheckout={setCheckout}
        formMethods={formMethods}
      />
    ) : (
      <CheckoutForm
        completePurchaseClicked={completePurchaseClicked}
        orderId={orderId}
        clientSecret={clientSecret}
        setCompletePurchaseClicked={setCompletePurchaseClicked}
      />
    );
  };

  return (
    <>
      {contextHolder}
      {children({
        current,
        checkout,
        checkoutConfig,
        isFetchingCheckoutConfig,
        clientSecret,
        orderId,
        completePurchaseClicked,
        promotion,
        setPromotion,
        handleNext,
        handleCompleteStripePayment,
        renderCheckoutStep,
        formMethods,
        cartSubtotal,
        cartFees,
      })}
      <AdjustmentConfirmationModal
        isOpen={isConfirmationOpen}
        response={confirmationData}
        onClose={() => {
          setIsConfirmationOpen(false);
          // TODO: Cancel the order via the API but for now just clear the state and let the cron handle it
          console.log(
            'User cancelled adjusted order:',
            confirmationData?.orderId
          );

          setConfirmationData(null);
          onClose();
        }}
        onConfirm={() => {
          setIsConfirmationOpen(false);
          // This could be done in the component but want to keep the logic in CheckoutContainer
          if (confirmationData) {
            proceedToNextStep(confirmationData);
          }
          setConfirmationData(null);
        }}
      />
    </>
  );
}

function calculateCart(
  checkout: CheckoutState,
  checkoutConfig: CheckoutConfigResponse | undefined
) {
  let subtotal = 0;
  let fees = 0;
  if (!checkoutConfig) {
    return { cartSubtotal: subtotal, cartFees: fees };
  }
  Object.keys(checkout.tickets).forEach((ticketId) => {
    const ticket = checkoutConfig?.tickets.find(
      (ticket) => ticket.id === ticketId
    );
    subtotal += (ticket?.price || 0) * checkout.tickets[ticketId];
    fees += (ticket?.fees || 0) * checkout.tickets[ticketId];
  });
  return { cartSubtotal: subtotal, cartFees: fees };
}
