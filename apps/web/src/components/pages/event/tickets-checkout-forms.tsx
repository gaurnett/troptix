import { List, Typography, message } from 'antd';
import { format } from 'date-fns';
import { useContext, useState } from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { TropTixContext } from '@/components/AuthProvider';
import { Button, ButtonWithIcon } from '@/components/ui/button';
import { InputWithLabel } from '@/components/ui/input';
import { TypographyH3 } from '@/components/ui/typography';
import {
  Checkout,
  CheckoutTicket,
  initializeCheckoutTicket,
} from '@/hooks/types/Checkout';
import { TicketsType, TicketType } from '@/hooks/types/Ticket';
import {
  GetPromotionsRequest,
  GetPromotionsType,
  getPromotions,
} from '@/hooks/usePromotions';
import { calculateFees, getDateFormatter } from '@/lib/utils';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { UseFormReturn } from 'react-hook-form';
import { UserDetailsFormData } from '@/lib/schemas/checkoutSchema';
import { Input } from '@/components/ui/input';
const { Paragraph } = Typography;

export default function TicketsCheckoutForm({
  event,
  ticketTypes,
  checkout,
  setCheckout,
  promotion,
  setPromotion,
  formMethods,
}: {
  event: any;
  ticketTypes: TicketType[];
  promotion: any;
  setPromotion: any;
  checkout: any;
  setCheckout: any;
  formMethods: UseFormReturn<UserDetailsFormData>;
}) {
  const [promotionCode, setPromotionCode] = useState<string>();
  const [promotionApplied, setPromotionApplied] = useState(false);
  const [canShowMessage, setCanShowMessage] = useState(true);
  const { user } = useContext(TropTixContext);

  async function applyPromotion() {
    let ticketDiscountApplied = false;
    ticketTypes.forEach((ticket) => {
      if (
        String(ticket.discountCode).toUpperCase() ===
        String(promotionCode).toUpperCase()
      ) {
        message.success('Tickets unlocked');
        ticketDiscountApplied = true;
        setPromotionApplied(true);
      }
    });

    if (ticketDiscountApplied) return;

    if (promotionCode === undefined) {
      if (canShowMessage) {
        setCanShowMessage(false);
        message
          .error('Promotion code is empty')
          .then(() => setCanShowMessage(true));
      }
      return;
    }

    if (
      promotionApplied &&
      String(promotion.code).toUpperCase() ===
        String(promotionCode).toUpperCase()
    ) {
      if (canShowMessage) {
        setCanShowMessage(false);
        message
          .error('Promotion already applied')
          .then(() => setCanShowMessage(true));
      }
      return;
    }

    const getPromotionsRequest: GetPromotionsRequest = {
      getPromotionsType: GetPromotionsType.GET_PROMOTIONS_BY_CODE,
      eventId: event.id,
      code: String(promotionCode).toUpperCase(),
    };

    return getPromotions(getPromotionsRequest)
      .then((fetchedPromotion) => {
        if (fetchedPromotion) {
          setPromotion(fetchedPromotion);
          setPromotionApplied(true);

          message.success('Promotion code applied');
        } else {
          message.error('There was a problem applying promotion code.');
        }
      })
      .catch((error) => {});
  }

  function handlePromotionChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPromotionCode(event.target.value);
  }

  function getPromotionPrice(price) {
    if (promotionApplied && promotion) {
      switch (promotion.promotionType) {
        case 'PERCENTAGE':
          return price - price * (promotion.value / 100);
        case 'DOLLAR_AMOUNT':
          return price - promotion.value;
      }
    }

    return price;
  }

  function getFormattedCurrency(price, includePromotion = false) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    if (includePromotion) {
      return formatter.format(getPromotionPrice(price));
    }

    return formatter.format(price);
  }

  function updateCost(ticket, reduce = false) {
    const updatedTickets: Map<string, CheckoutTicket> = new Map(
      checkout.tickets
    );
    console.log('updatedTickets', updatedTickets);
    const currentQuantity =
      updatedTickets.get(ticket.id)?.quantitySelected || 0;
    const newQuantity = reduce ? currentQuantity - 1 : currentQuantity + 1;

    if (newQuantity <= 0) {
      updatedTickets.delete(ticket.id);
    } else {
      const existingTicketData =
        updatedTickets.get(ticket.id) || initializeCheckoutTicket(ticket);
      updatedTickets.set(ticket.id, {
        ...existingTicketData,
        quantitySelected: newQuantity,
      });
    }

    setCheckout((previousCheckout) => ({
      ...previousCheckout,
      tickets: updatedTickets,
    }));
  }

  function getTicketStateMessage(ticket) {
    let quantityRemaining = ticket.quantity;

    if (new Date().getTime() < new Date(ticket.saleStartDate).getTime()) {
      return (
        'Sale starts ' +
        format(new Date(ticket.saleStartDate), 'MMM dd, yyyy, hh:mm a')
      );
    }

    if (new Date().getTime() > new Date(ticket.saleEndDate).getTime()) {
      return 'Sale ended';
    }

    if (ticket.completedOrders !== null && ticket.pendingOrders !== null) {
      quantityRemaining =
        ticket.quantity - (ticket.completedOrders + ticket.pendingOrders);
      if (quantityRemaining <= 0) {
        return 'Sold Out';
      }
    }

    return undefined;
  }

  let filteredTickets = ticketTypes;

  if (filteredTickets !== null && filteredTickets !== undefined) {
    filteredTickets = filteredTickets.filter((ticket) => {
      return (
        (promotionApplied &&
          String(ticket.discountCode).toUpperCase() ===
            String(promotionCode).toUpperCase()) ||
        !ticket.discountCode
      );
    });
  }

  return (
    <div className="md:px-4">
      <Form {...formMethods}>
        <TypographyH3 text={'Contact Information'} classes="mb-2" />
        <div className="flex justify-between">
          <FormField
            control={formMethods.control}
            name="firstName"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className="mb-4 mr-1 md:mr-4 w-full">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={'John'} disabled={!!user.id} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formMethods.control}
            name="lastName"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className="mb-4 mr-1 md:mr-4 w-full">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={'Doe'} disabled={!!user.id} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="md:flex justify-between">
          <FormField
            control={formMethods.control}
            name="email"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className="mb-4 mr-1 md:mr-4 w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={'johndoe@gmail.com'}
                    disabled={!!user.id}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formMethods.control}
            name="confirmEmail"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className="mb-4 mr-1 md:mr-4 w-full">
                <FormLabel>Confirm Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={'johndoe@gmail.com'}
                    disabled={!!user.id}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>

      <TypographyH3 text={'Tickets'} classes="mb-2" />
      <div className="mb-4">
        <div className="w-full">
          <label
            className="block text-gray-800 text-sm font-medium mb-1"
            htmlFor={'promotionCode'}
          >
            Promotion Code
          </label>
        </div>
        <div className="flex w-full">
          <InputWithLabel
            onChange={handlePromotionChange}
            name={'promotionCode'}
            value={promotionCode}
            id={'promotionCode'}
            type={'text'}
            placeholder={'SAVE15'}
            containerClass="w-full"
          />
          <Button onClick={applyPromotion} className="my-auto ml-2">
            Apply
          </Button>
        </div>
      </div>

      <List
        itemLayout="vertical"
        size="large"
        dataSource={filteredTickets}
        split={false}
        renderItem={(ticket: TicketType, index: number) => {
          let checkoutTicket: any;
          if (checkout.tickets && checkout.tickets.has(ticket.id)) {
            checkoutTicket = checkout.tickets.get(ticket.id);
          }
          let ticketState = getTicketStateMessage(ticket);

          const quantity = ticket.quantity as number;
          const pendingOrders = ticket.pendingOrders as number;
          const maxPurchasePerUser = ticket.maxPurchasePerUser as number;
          const completedOrders = ticket.completedOrders as number;

          const basePrice = ticket.price ?? 0;
          const baseFees =
            ticket.ticketingFees === 'PASS_TICKET_FEES' &&
            ticket.ticketType === TicketsType.PAID
              ? calculateFees(basePrice)
              : 0;

          const displayPrice = getFormattedCurrency(basePrice);
          const displayFees = getFormattedCurrency(baseFees);

          return (
            <List.Item className="mb-4" style={{ padding: 0 }}>
              <div
                className="px-4 w-full"
                style={{
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: '#D3D3D3',
                }}
              >
                <div>
                  <div className="my-auto">
                    <div className="flex h-16">
                      <div className="md:w-4/5 grow my-auto">{ticket.name}</div>
                      <div className="md:w-1/5 flex my-auto justify-center items-center">
                        <div>
                          {ticketState !== undefined ? (
                            <div className="text-center text-md font-bold">
                              {ticketState}
                            </div>
                          ) : (
                            <div className="flex">
                              <ButtonWithIcon
                                onClick={() => updateCost(ticket, true)}
                                className="bg-blue-500 rounded h-8 w-8"
                                size={'sm'}
                                disabled={
                                  !checkoutTicket ||
                                  checkoutTicket.quantitySelected === 0
                                }
                                icon={
                                  <MinusOutlined className="text-white items-center justify-center" />
                                }
                              ></ButtonWithIcon>
                              <div className="mx-4" style={{ fontSize: 20 }}>
                                {!checkoutTicket
                                  ? 0
                                  : checkoutTicket.quantitySelected}
                              </div>
                              <ButtonWithIcon
                                onClick={() => updateCost(ticket, false)}
                                className="bg-blue-500 rounded h-8 w-8"
                                disabled={
                                  checkoutTicket &&
                                  checkoutTicket.quantitySelected ===
                                    Math.min(
                                      quantity -
                                        (completedOrders + pendingOrders),
                                      maxPurchasePerUser
                                    )
                                }
                                icon={
                                  <PlusOutlined className="text-white items-center justify-center" />
                                }
                              ></ButtonWithIcon>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  key={index}
                  style={{ width: '100%', borderColor: '#D3D3D3' }}
                >
                  <div
                    style={{ flex: 1, height: 1, backgroundColor: '#D3D3D3' }}
                  />
                  <div className="my-4">
                    <div className="flex">
                      <div className="text-base font-bold">{displayPrice}</div>
                      <div className="my-auto text-gray-500">
                        &nbsp;+ {displayFees} fees
                      </div>
                    </div>
                    <div className="text-sm">
                      Sale ends:{' '}
                      {getDateFormatter(new Date(ticket.saleEndDate as Date))}
                    </div>
                    <div>
                      <Paragraph
                        className="text-justify text-sm"
                        ellipsis={{
                          rows: 2,
                          expandable: true,
                          symbol: 'see more details',
                        }}
                      >
                        {ticket.description}
                      </Paragraph>
                    </div>
                    <div></div>
                  </div>
                </div>
              </div>
            </List.Item>
          );
        }}
      />
    </div>
  );
}
