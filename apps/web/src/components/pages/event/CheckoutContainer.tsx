import { TropTixContext } from '@/components/AuthProvider';
import { Spinner } from '@/components/ui/spinner';
import { Checkout, initializeCheckout } from '@/hooks/types/Checkout';
import { TicketType } from '@/hooks/types/Ticket';
import { useFetchTicketTypesForCheckout } from '@/hooks/useTicketType';
import { message, notification } from 'antd';
import { ReactNode, useContext, useEffect, useState } from 'react';
import CheckoutForm from './checkout';
import TicketsCheckoutForm from './tickets-checkout-forms';
import { useRouter } from 'next/router';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  userDetailsSchema,
  UserDetailsFormData,
} from '@/lib/schemas/checkoutSchema';
import {
  InitiateCheckoutVariables,
  useInitiateCheckout,
} from '@/hooks/useCheckout';

import { ValidationResponseMessage } from '@/types/IntiateCheckout';

interface CheckoutContainerProps {
  event: any;
  isOpen: boolean;
  onClose: () => void;
  children: (props: {
    isFree: boolean;
    current: number;
    checkout: Checkout;
    ticketTypes: TicketType[] | undefined;
    isFetchingTicketTypes: boolean;
    clientSecret: string | undefined;
    orderId: string;
    completePurchaseClicked: boolean;
    promotion: any;
    setPromotion: (promotion: any) => void;
    handleNext: (userDetails: UserDetailsFormData) => Promise<void>;
    handleCompleteStripePayment: () => void;
    renderCheckoutStep: () => ReactNode;
    formMethods: UseFormReturn<UserDetailsFormData>;
  }) => ReactNode;
}

export function CheckoutContainer({
  event,
  isOpen,
  onClose,
  children,
}: CheckoutContainerProps) {
  const { user } = useContext(TropTixContext);
  const eventId = event.id;

  const [checkout, setCheckout] = useState<Checkout>(
    initializeCheckout(user, eventId)
  );
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
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const initiateCheckoutMutation = useInitiateCheckout();

  const [ticketTypes, setTicketTypes] = useState<TicketType[]>();
  const [completePurchaseClicked, setCompletePurchaseClicked] = useState(false);
  const [current, setCurrent] = useState(0);
  const [canShowMessage, setCanShowMessage] = useState(true);
  const [orderId, setOrderId] = useState('');
  const [clientSecret, setClientSecret] = useState<string>();
  const [promotion, setPromotion] = useState<any>();

  // This is a temporary solution to check if the checkout is free
  // We need to refactor the checkout state to be a map of ticket type id to quantity selected
  // For now, this is a temporary solution to get the selected tickets with only the needed data
  const isFree = !!(
    ticketTypes &&
    ticketTypes
      .filter((ticket) =>
        Array.from(checkout.tickets.values()).some(
          (t) => t.ticketTypeId === ticket.id
        )
      )
      .every((ticket) => ticket.price === 0) &&
    checkout.tickets.size > 0
  );

  useEffect(() => {
    setCheckout(initializeCheckout(user, eventId));
  }, [user, eventId]);

  const {
    isPending: isFetchingTicketTypesForCheckout,
    data: ticketTypesWithPendingOrders,
  } = useFetchTicketTypesForCheckout(eventId);

  useEffect(() => {
    if (!isFetchingTicketTypesForCheckout) {
      setTicketTypes(ticketTypesWithPendingOrders);
    }
  }, [isFetchingTicketTypesForCheckout, ticketTypesWithPendingOrders]);

  async function handleNext(userDetails: UserDetailsFormData) {
    if (checkout.tickets.size === 0) {
      if (canShowMessage) {
        setCanShowMessage(false);
        message
          .warning('Please select a ticket quantity')
          .then(() => setCanShowMessage(true));
      }
      return;
    }
    // TODO: Refactor the checkout.tickets state to be a map of ticket type id to quantity selected
    // For now, this is a temporary solution to get the selected tickets with only the needed data
    const selectedTickets = Object.fromEntries(
      Array.from(checkout.tickets.entries()).map(([key, value]) => [
        key,
        value.quantitySelected,
      ])
    );
    const variables: InitiateCheckoutVariables = {
      eventId: eventId,
      selectedTickets: selectedTickets,
      userDetails: userDetails,
      promotionCode: promotion?.code,
    };

    messageApi.open({
      key: 'creating-order-loading',
      type: 'loading',
      content: 'Creating Order..',
      duration: 0,
    });

    const response = await initiateCheckoutMutation.mutateAsync(variables, {
      onSuccess: (validationResponse) => {
        if (validationResponse.isValid) {
          // Update the checkout state with the validated items
          const validatedItems = validationResponse.validatedItems;
          const checkoutTickets = checkout.tickets;
          validatedItems.forEach((item) => {
            checkoutTickets[item.ticketTypeId] = {
              ...checkoutTickets[item.ticketTypeId],
              quantitySelected: item.validatedQuantity,
            };
          });
          setCheckout((previousCheckout) => ({
            ...previousCheckout,
            fees: validationResponse.fees,
            subtotal: validationResponse.subtotal,
            total: validationResponse.total,
            tickets: checkoutTickets,
          }));
        }
        if (
          validationResponse.isValid &&
          validationResponse.message ===
            ValidationResponseMessage.SomeTicketsUnavailable
        ) {
          messageApi.open({
            key: 'creating-order-loading',
            type: 'error',
            content:
              'Some tickets are unavailabe and were removed from the cart',
          });
        } else if (
          validationResponse.message === 'All tickets are valid' &&
          validationResponse.isFree
        ) {
          router.push(
            `/orders/order-confirmation?orderId=${validationResponse.orderId}&isFree`
          );
        } else if (
          validationResponse.message === 'All tickets are valid' &&
          !validationResponse.isFree
        ) {
          setClientSecret(validationResponse.clientSecret as string);
          setOrderId(validationResponse.orderId as string);
          setCurrent(current + 1);
        } else if (!validationResponse.isValid) {
          messageApi.open({
            key: 'creating-order-loading',
            type: 'error',
            content: 'Unfortunately all tickets are sold out',
          });
        }
      },
    });

    messageApi.destroy('creating-order-loading');
  }

  function handleCompleteStripePayment() {
    setCompletePurchaseClicked(true);
  }

  function handleClose() {
    setCheckout(initializeCheckout(user, eventId));
    setCurrent(0);
    onClose();
  }

  const renderCheckoutStep = () => {
    if (isFetchingTicketTypesForCheckout) {
      return (
        <div className="mt-32">
          <Spinner text={'Initializing Checkout'} />
        </div>
      );
    }

    return current === 0 ? (
      <TicketsCheckoutForm
        event={event}
        ticketTypes={ticketTypes as TicketType[]}
        promotion={promotion}
        setPromotion={setPromotion}
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
        isFree,
        current,
        checkout,
        ticketTypes,
        isFetchingTicketTypes: isFetchingTicketTypesForCheckout,
        clientSecret,
        orderId,
        completePurchaseClicked,
        promotion,
        setPromotion,
        handleNext,
        handleCompleteStripePayment,
        renderCheckoutStep,
        formMethods,
      })}
    </>
  );
}
