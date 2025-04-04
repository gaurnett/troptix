import { TropTixContext } from '@/components/AuthProvider';
import { Spinner } from '@/components/ui/spinner';
import { Checkout, initializeCheckout } from '@/hooks/types/Checkout';
import { TicketType } from '@/hooks/types/Ticket';
import { useCreateOrder } from '@/hooks/useOrders';
import { useCreatePaymentIntent } from '@/hooks/usePostStripe';
import {
  checkOrderValidity,
  useFetchTicketTypesForCheckout,
} from '@/hooks/useTicketType';
import { message, notification } from 'antd';
import { ReactNode, useContext, useEffect, useState } from 'react';
import CheckoutForm from './checkout';
import TicketsCheckoutForm from './tickets-checkout-forms';
import { generateId } from '@/lib/utils';
import { useRouter } from 'next/router';

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
    handleNext: () => Promise<void>;
    handleCompleteStripePayment: () => void;
    renderCheckoutStep: () => ReactNode;
  }) => ReactNode;
}

export function CheckoutContainer({
  event,
  isOpen,
  onClose,
  children,
}: CheckoutContainerProps) {
  const { user } = useContext(TropTixContext);
  const [messageApi, contextHolder] = message.useMessage();
  const eventId = event.id;
  const router = useRouter();
  const [checkout, setCheckout] = useState<Checkout>(
    initializeCheckout(user, eventId)
  );
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>();
  const [completePurchaseClicked, setCompletePurchaseClicked] = useState(false);
  const [current, setCurrent] = useState(0);
  const [canShowMessage, setCanShowMessage] = useState(true);
  const [orderId, setOrderId] = useState('');
  const [clientSecret, setClientSecret] = useState<string>();
  const [promotion, setPromotion] = useState<any>();
  const isFree = checkout.total === 0 && checkout.tickets.size > 0;

  const createPaymentIntent = useCreatePaymentIntent();
  const createOrder = useCreateOrder();

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
              userId: user?.id,
              jwtToken: user?.jwtToken as string,
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

  async function initializeFreeOrder() {
    createOrder.mutate(
      {
        checkout,
        paymentId: generateId(),
        customerId: '',
        userId: user?.id,
        jwtToken: user?.jwtToken as string,
        isFreeOrder: true,
      },
      {
        onSuccess: (data) => {
          setClientSecret(clientSecret);
          setOrderId(data as string);
          router.push(`/orders/order-confirmation?orderId=${data}&isFree`);
        },
        onError: (error) => {
          messageApi.error('There was an error initializing your order');
          setCurrent(1);
        },
      }
    );
  }

  async function handleNext() {
    if (checkout.email !== checkout.confirmEmail) {
      if (canShowMessage) {
        setCanShowMessage(false);
        message
          .warning('Email addresses do not match')
          .then(() => setCanShowMessage(true));
      }
      return;
    }

    if (!checkout.firstName || !checkout.lastName || !checkout.email) {
      if (canShowMessage) {
        setCanShowMessage(false);
        message
          .warning('Please fill in contact information')
          .then(() => setCanShowMessage(true));
      }
      return;
    }

    if (checkout.tickets.size === 0) {
      if (canShowMessage) {
        setCanShowMessage(false);
        message
          .warning('Please select a ticket quantity')
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

    const {
      valid,
      checkout: orderCheckout,
      ticketTypes,
    } = await checkOrderValidity(eventId, user?.jwtToken, checkout, promotion);
    const isOrderFree = Boolean(
      checkout.total === 0 && valid && checkout.tickets.size > 0
    );

    messageApi.destroy('creating-order-loading');
    if (isOrderFree) {
      initializeFreeOrder();
    } else if (valid) {
      initializeStripeDetails();
      setCurrent(current + 1);
    } else {
      setTicketTypes(ticketTypes);
      setCheckout(orderCheckout as Checkout);
      notification.error({
        message: `Updated Quantity`,
        description:
          'Your order has been updated due to ticket availabilities. Please check and verify your updated cart.',
        placement: 'bottom',
        duration: 0,
      });
    }
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
      })}
    </>
  );
}
