import { List, Typography, message } from 'antd';
import { format } from 'date-fns';
import { useContext, useState } from 'react';

import { TropTixContext } from '@/components/WebNavigator';
import { Button, ButtonWithIcon } from '@/components/ui/button';
import { InputWithLabel } from '@/components/ui/input';
import { TypographyH3 } from '@/components/ui/typography';
import { initializeCheckoutTicket } from '@/hooks/types/Checkout';
import { TicketType } from '@/hooks/types/Ticket';
import {
  GetPromotionsRequest,
  GetPromotionsType,
  getPromotions,
} from '@/hooks/usePromotions';
import { calculateFees, getDateFormatter } from '@/lib/utils';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
const { Paragraph } = Typography;

export default function TicketsCheckoutForm({
  event,
  ticketTypes,
  checkout,
  setCheckout,
  promotion,
  setPromotion,
}: {
  event: any;
  ticketTypes: TicketType[];
  promotion: any;
  setPromotion: any;
  checkout: any;
  setCheckout: any;
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
      .then((promotion) => {
        if (promotion) {
          let subtotal = 0;
          let fees = 0;
          setPromotion(promotion);
          setPromotionApplied(true);

          const updatedTickets = checkout.tickets;
          Array.from(checkout.tickets.keys()).forEach((key, i) => {
            const item = checkout.tickets.get(key);
            const promotedPrice = getPromotionPriceFromResponse(
              item.subtotal,
              promotion
            );
            const promotedFee = calculateFees(promotedPrice);

            subtotal += normalizePrice(promotedPrice) * item.quantitySelected;
            fees += normalizePrice(promotedFee) * item.quantitySelected;

            updatedTickets.set(key, {
              ...item,
              subtotal: promotedPrice,
              fees: promotedFee,
              total: normalizePrice(promotedFee + promotedPrice),
            });
          });

          if (checkout.subtotal > 0) {
            setCheckout((previousOrder) => ({
              ...previousOrder,
              subtotal: subtotal,
              fees: fees,
              total: normalizePrice(subtotal + fees),
            }));
          }

          setCheckout((previousOrder) => ({
            ...previousOrder,
            promotionApplied: true,
            tickets: updatedTickets,
          }));

          message.success('Promotion code applied');
        } else {
          message.error('There was a problem applying promotion code.');
        }
      })
      .catch((error) => {});
  }

  function getPromotionPriceFromResponse(price, response) {
    switch (response.promotionType) {
      case 'PERCENTAGE':
        return price - price * (response.value / 100);
      case 'DOLLAR_AMOUNT':
        return price - response.value;
    }

    return price;
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setCheckout((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
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

  function getFormattedFeesCurrency(price) {
    let fees = calculateFees(price);
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    if (promotionApplied) {
      const promotedPrice = getPromotionPrice(price);
      return formatter.format(calculateFees(promotedPrice));
    }

    return formatter.format(fees);
  }

  function normalizePrice(price): number {
    return Math.round(price * 100) / 100;
  }

  function updateCost(ticket, reduce = false) {
    const price = normalizePrice(ticket.price);
    var ticketSubtotal = checkout.promotionApplied
      ? getPromotionPrice(price)
      : price;
    var ticketFees =
      ticket.ticketingFees === 'PASS_TICKET_FEES'
        ? calculateFees(ticketSubtotal)
        : 0;
    var ticketTotal = normalizePrice(ticketFees + ticketSubtotal);

    const updatedTickets = checkout.tickets;
    if (checkout.tickets.has(ticket.id)) {
      const checkoutTicket = checkout.tickets.get(ticket.id);
      const quantitySelected = checkoutTicket.quantitySelected;
      checkoutTicket.quantitySelected = reduce
        ? quantitySelected - 1
        : quantitySelected + 1;
      if (checkoutTicket.quantitySelected === 0) {
        updatedTickets.delete(ticket.id);
      } else {
        updatedTickets.set(ticket.id, checkoutTicket);
      }
    } else {
      const checkoutTicket = initializeCheckoutTicket(ticket);
      checkoutTicket.quantitySelected = 1;
      checkoutTicket.subtotal = ticketSubtotal;
      checkoutTicket.fees = ticketFees;
      checkoutTicket.total = ticketTotal;
      updatedTickets.set(ticket.id, checkoutTicket);
    }

    var checkoutSubtotal = normalizePrice(checkout.subtotal);
    var checkoutFees = normalizePrice(checkout.fees);

    checkoutSubtotal = reduce
      ? checkoutSubtotal - ticketSubtotal
      : checkoutSubtotal + ticketSubtotal;
    checkoutFees = reduce
      ? checkoutFees - ticketFees
      : checkoutFees + ticketFees;
    var checkoutTotal = normalizePrice(checkoutSubtotal + checkoutFees);

    setCheckout((previousOrder) => ({
      ...previousOrder,
      tickets: updatedTickets,
      total: checkoutTotal,
      fees: checkoutFees,
      subtotal: checkoutSubtotal,
    }));
  }

  function reduceCost(ticket, index) {
    updateCost(ticket, true);
  }

  function increaseCost(ticket, index) {
    updateCost(ticket, false);
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
      <TypographyH3 text={'Contact Information'} classes="mb-2" />
      <div className="flex justify-between">
        <div className="mb-4 mr-1 md:mr-4 w-full">
          <InputWithLabel
            value={checkout.firstName}
            name={'firstName'}
            id={'firstName'}
            labelValue={'First Name *'}
            type={'text'}
            placeholder={'John'}
            onChange={handleChange}
            required={true}
          />
        </div>
        <div className="mb-4 ml-1 md:ml-4 w-full">
          <InputWithLabel
            value={checkout.lastName}
            name={'lastName'}
            id={'lastName'}
            labelValue={'Last Name *'}
            type={'text'}
            placeholder={'Doe'}
            onChange={handleChange}
            required={true}
          />
        </div>
      </div>

      <div className="md:flex justify-between">
        <div className="mb-4 md:mr-4 w-full">
          <InputWithLabel
            value={checkout.email}
            name={'email'}
            id={'email'}
            labelValue={'Email *'}
            type={'text'}
            placeholder={'johndoe@gmail.com'}
            onChange={handleChange}
            required={true}
            disabled={!!user.id}
          />
        </div>
        <div className="mb-4 md:ml-4 w-full">
          <InputWithLabel
            value={checkout.confirmEmail}
            name={'confirmEmail'}
            id={'confirmEmail'}
            labelValue={'Confirm Email *'}
            type={'text'}
            placeholder={'johndoe@gmail.com'}
            onChange={handleChange}
            required={true}
            disabled={!!user.id}
          />
        </div>
      </div>

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
          const isPromotionPriceSame =
            getFormattedCurrency(ticket.price) ===
            getFormattedCurrency(ticket.price, true);

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
                                onClick={() => reduceCost(ticket, index)}
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
                                onClick={() => increaseCost(ticket, index)}
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
                      {promotionApplied &&
                      !ticket.discountCode &&
                      !isPromotionPriceSame ? (
                        <div className="flex">
                          <div
                            className="text-base"
                            style={{ textDecorationLine: 'line-through' }}
                          >
                            {getFormattedCurrency(ticket.price)}
                          </div>
                          <div className="ml-1 text-base font-bold">
                            {getFormattedCurrency(ticket.price, true)}
                          </div>
                        </div>
                      ) : (
                        <div className="text-base font-bold">
                          {getFormattedCurrency(ticket.price)}
                        </div>
                      )}
                      <div className="my-auto text-gray-500">
                        &nbsp;+{' '}
                        {ticket.ticketingFees === 'PASS_TICKET_FEES'
                          ? getFormattedFeesCurrency(ticket.price)
                          : getFormattedCurrency(0)}{' '}
                        fees
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
