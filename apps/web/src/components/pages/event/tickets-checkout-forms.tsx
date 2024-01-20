import { Button, Input, List, Typography, message } from 'antd';
import { format } from 'date-fns';
import { useState } from 'react';
import { GetPromotionsType, getPromotions } from 'troptix-api';

import { CustomInput } from '@/components/ui/input';
import { initializeCheckoutTicket } from '@/hooks/types/Checkout';
import { getDateFormatter } from '@/lib/utils';
import {
  MinusOutlined,
  PlusOutlined
} from '@ant-design/icons';
const { Paragraph } = Typography;

export default function TicketsCheckoutForm({ checkout, event, setCheckout }) {
  const [promotionCode, setPromotionCode] = useState<any>();
  const [promotion, setPromotion] = useState<any>();
  const [promotionApplied, setPromotionApplied] = useState(false);
  const [canShowMessage, setCanShowMessage] = useState(true);

  async function applyPromotion() {
    if (promotionCode === undefined) {
      if (canShowMessage) {
        setCanShowMessage(false);
        message.error("Promotion code is empty")
          .then(() => setCanShowMessage(true));
      }
      return;
    }

    if (promotionApplied && String(promotion.code).toUpperCase() === String(promotionCode).toUpperCase()) {
      if (canShowMessage) {
        setCanShowMessage(false);
        message.error("Promotion already applied")
          .then(() => setCanShowMessage(true));
      }
      return;
    }

    const getPromotionsRequest = {
      getPromotionsType: GetPromotionsType.GET_PROMOTIONS_BY_EVENT,
      eventId: event.id,
      code: String(promotionCode).toUpperCase()
    }

    try {
      const response = await getPromotions(getPromotionsRequest);

      if (response !== null && response !== undefined) {
        setPromotion(response);
        setPromotionApplied(true);

        const updatedTickets = checkout.tickets;
        Array.from(checkout.tickets.keys()).forEach((key, i) => {
          const item = checkout.tickets.get(key);
          updatedTickets.set(key, {
            ...item,
            subtotal: getPromotionPriceFromResponse(item.subtotal, response),
            fees: getPromotionPriceFromResponse(item.fees, response),
            total: getPromotionPriceFromResponse(item.total, response)
          })
        });

        setCheckout(previousOrder => ({
          ...previousOrder,
          ["promotionApplied"]: true,
          ["tickets"]: updatedTickets,
          ["discountedSubtotal"]: getPromotionPriceFromResponse(checkout.subtotal, response),
          ["discountedFees"]: getPromotionPriceFromResponse(checkout.fees, response),
          ["discountedTotal"]: getPromotionPriceFromResponse(checkout.total, response)
        }))

        message.success("Promotion code applied");
      } else {
        message.error("There was a problem applying promotion code.");
      }
    } catch (error) {
    }
  }

  function getPromotionPriceFromResponse(price, response) {
    switch (response.promotionType) {
      case 'PERCENTAGE':
        return price - (price * (response.value / 100));
      case 'DOLLAR_AMOUNT':
        return price - response.value;
    }

    return price;
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setCheckout((prevState) => ({
      ...prevState, [event.target.name]: event.target.value
    }));
  }

  function handlePromotionChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPromotionCode(event.target.value);
  }

  function getPromotionPrice(price) {
    if (promotionApplied && promotion) {
      switch (promotion.promotionType) {
        case 'PERCENTAGE':
          return price - (price * (promotion.value / 100));
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

  function calculateFees(price) {
    const fee = (price * 0.06) + 0.30;
    const tax = fee * 0.15;
    return normalizePrice(fee + tax);
  }

  function getFormattedFeesCurrency(price) {
    price = calculateFees(price);
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    if (promotionApplied) {
      return formatter.format(getPromotionPrice(price));
    }

    return formatter.format(price);
  }

  function normalizePrice(price): number {
    return Math.round(price * 100) / 100;
  }

  function updateCost(ticket, reduce = false) {
    const price = normalizePrice(ticket.price);
    var ticketSubtotal = price;
    var ticketFees = ticket.ticketingFees === "PASS_TICKET_FEES" ? calculateFees(price) : 0;
    var ticketTotal = normalizePrice(ticketFees + ticketSubtotal);

    const updatedTickets = checkout.tickets;
    if (checkout.tickets.has(ticket.id)) {
      const checkoutTicket = checkout.tickets.get(ticket.id);
      const quantitySelected = checkoutTicket.quantitySelected
      checkoutTicket.quantitySelected = reduce ? quantitySelected - 1 : quantitySelected + 1;
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

    checkoutSubtotal = reduce ? checkoutSubtotal - ticketSubtotal : checkoutSubtotal + ticketSubtotal;
    checkoutFees = reduce ? checkoutFees - ticketFees : checkoutFees + ticketFees
    var checkoutTotal = normalizePrice(checkoutSubtotal + checkoutFees);

    setCheckout(previousOrder => ({
      ...previousOrder,
      ["tickets"]: updatedTickets,
      ["total"]: checkoutTotal,
      ["fees"]: checkoutFees,
      ["subtotal"]: checkoutSubtotal
    }))

    if (checkout.promotionApplied) {
      setCheckout(previousOrder => ({
        ...previousOrder,
        ["discountedSubtotal"]: getPromotionPrice(checkoutSubtotal),
        ["discountedFees"]: getPromotionPrice(checkoutFees),
        ["discountedTotal"]: getPromotionPrice(checkoutTotal)
      }))
    }
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
      return "Sale starts " + format(new Date(ticket.saleStartDate), 'MMM dd, yyyy, hh:mm a')
    }

    if (new Date().getTime() > new Date(ticket.saleEndDate).getTime()) {
      return "Sale ended"
    }

    if (ticket.quantitySold !== null && ticket.quantitySold !== undefined) {
      quantityRemaining = ticket.quantity - ticket.quantitySold;
      if (quantityRemaining <= 0) {
        return "Sold Out";
      }
    }

    return undefined;
  }

  return (
    <div className="w-full">
      <div>

        <h2 className="text-xl font-bold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out">Contact Information</h2>
        <div className="flex justify-between">
          <div className="mb-4 mr-1 md:mr-4 w-full">
            <CustomInput value={checkout.firstName} name={"firstName"} id={"firstName"} label={"First Name *"} type={"text"} placeholder={"John"} handleChange={handleChange} required={true} />
          </div>
          <div className="mb-4 ml-1 md:ml-4 w-full">
            <CustomInput value={checkout.lastName} name={"lastName"} id={"lastName"} label={"Last Name *"} type={"text"} placeholder={"Doe"} handleChange={handleChange} required={true} />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="mb-4 w-full">
            <CustomInput disabled={true} value={checkout.email} name={"email"} id={"email"} label={"Email *"} type={"text"} placeholder={"johndoe@gmail.com"} handleChange={handleChange} required={true} />
          </div>
        </div>

        <h2 className="text-xl font-bold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out">Tickets</h2>

        <div className="mb-4">
          <div className="w-full">
            <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor={"promotionCode"}>Promotion Code</label>
          </div>
          <div className="flex w-full">
            <Input onChange={handlePromotionChange} name={"promotionCode"} value={promotionCode} id={"promotionCode"} type={"text"} classNames={{ input: "form-input w-full text-gray-800" }} placeholder={"SAVE15"} />
            <Button onClick={applyPromotion} className='my-auto ml-2' type='text'>
              Apply
            </Button>
          </div>
        </div>

        <List
          itemLayout="vertical"
          size="large"
          dataSource={event.ticketTypes}
          split={false}
          renderItem={(ticket: any, index: number) => {
            let checkoutTicket: any
            if (checkout.tickets && checkout.tickets.has(ticket.id)) {
              checkoutTicket = checkout.tickets.get(ticket.id);
            }
            let ticketState = getTicketStateMessage(ticket);

            return (
              <List.Item
                className='mb-4'
                style={{ padding: 0 }}>
                <div
                  className='px-4 w-full'
                  style={{ borderWidth: 1, borderRadius: 10, borderColor: '#D3D3D3' }}>
                  <div>
                    <div className="my-auto">
                      <div
                        className='flex h-16'>
                        <div className='md:w-4/5 grow my-auto'>{ticket.name}</div>
                        <div className='md:w-1/5 flex my-auto justify-center items-center'>
                          <div>
                            {
                              ticketState !== undefined ?
                                <div
                                  className='text-center text-md font-bold'>
                                  {ticketState}
                                </div>
                                :
                                <div className='flex'>
                                  <Button
                                    onClick={() => reduceCost(ticket, index)}
                                    className='bg-blue-500 rounded'
                                    disabled={!checkoutTicket || checkoutTicket.quantitySelected === 0}
                                    icon={<MinusOutlined className='text-white items-center justify-center' />}>
                                  </Button>
                                  <div
                                    className='mx-4'
                                    style={{ fontSize: 20 }}>
                                    {!checkoutTicket ? 0 : checkoutTicket.quantitySelected}
                                  </div>
                                  <Button
                                    onClick={() => increaseCost(ticket, index)}
                                    className='bg-blue-500 rounded'
                                    disabled={checkoutTicket && checkoutTicket.quantitySelected === Math.min(ticket.quantity - ticket.quantitySold, ticket.maxPurchasePerUser)}
                                    icon={<PlusOutlined className='text-white items-center justify-center' />}>
                                  </Button>
                                </div>
                            }

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div key={index} style={{ width: '100%', borderColor: '#D3D3D3' }}>
                    <div style={{ flex: 1, height: 1, backgroundColor: '#D3D3D3' }} />
                    <div className='my-4'>
                      <div className='flex'>
                        {
                          promotionApplied ?
                            <div className='flex'>
                              <div className='text-base' style={{ textDecorationLine: 'line-through' }}>
                                {getFormattedCurrency(ticket.price)}
                              </div>
                              <div className='ml-1 text-base font-bold'>
                                {getFormattedCurrency(ticket.price, true)}
                              </div>
                            </div>
                            :
                            <div className='text-base font-bold'>{getFormattedCurrency(ticket.price)}</div>
                        }
                        <div className='my-auto text-gray-500'>&nbsp;+ {ticket.ticketingFees === "PASS_TICKET_FEES" ? getFormattedFeesCurrency(ticket.price) : getFormattedCurrency(0)} fees</div>
                      </div>
                      <div className='text-sm'>Sale ends: {getDateFormatter(new Date(ticket.saleEndDate))}</div>
                      <div>
                        <Paragraph className="text-justify text-sm" ellipsis={{ rows: 2, expandable: true, symbol: 'see more details' }}>
                          {ticket.description}
                        </Paragraph>
                      </div>
                      <div>
                      </div>
                    </div>
                  </div>
                </div>

              </List.Item>
            )
          }}
        />

      </div>
    </div>
  );
}