import _ from 'lodash';
import { message, Button, Spin, Modal, List, Steps, theme, Input } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Event, getEventsFromRequest, Checkout, Order, Charge } from 'troptix-models';
import { GetPromotionsType, getPromotions } from 'troptix-api';

import {
  PlusOutlined,
  MinusOutlined
} from '@ant-design/icons';
import { CustomInput } from '@/components/ui/input';

export default function TicketsCheckoutForm({ checkout, event, setCheckout, orderSummary, setOrderSummary }) {
  const { token } = theme.useToken();

  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const [isFetchingEvent, setIsFetchingEvent] = useState(true);
  const [eventName, setEventName] = useState("");
  const [publishButtonClicked, setPublishButtonClicked] = useState(false);

  const [promotionCode, setPromotionCode] = useState("");
  const [promotion, setPromotion] = useState<any>();
  const [promotionApplied, setPromotionApplied] = useState(false);
  const [open, setOpen] = useState(false);

  const [current, setCurrent] = useState(0);
  const steps = [
    {
      title: 'Ticket Details',
      content: 'First-content',
    },
    {
      title: 'Checkout',
      content: 'Second-content',
    },
  ];

  const contentStyle: React.CSSProperties = {
    lineHeight: '260px',
    textAlign: 'center',
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  async function applyPromotion() {
    // setPromotion({
    //   promotionType: 'PERCENTAGE',
    //   value: 15
    // });
    // setPromotionApplied(true);
    // message.success("Promotion code applied");
    // return;

    if (promotionCode === undefined) {
      message.error("Promotion code is empty");
      return;
    }

    if (promotionApplied && String(promotion.code).toUpperCase() === String(promotionCode).toUpperCase()) {
      message.error("Promotion already applied");
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

        const updatedTickets = checkout.tickets.map((item, i) => {
          if (item.quantitySelected > 0) {
            return {
              ...item,
              subtotal: getPromotionPriceFromResponse(item.subtotal, response),
              fees: getPromotionPriceFromResponse(item.fees, response),
              total: getPromotionPriceFromResponse(item.total, response)
            };
          } else {
            return item;
          }
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
      console.log("[TicketCheckoutScreen applyPromotion] response: " + response);
    } catch (error) {
      console.log("[TicketCheckoutScreen applyPromotion] error: " + error);
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

  function getFormattedFeesCurrency(price) {
    price = price * .1;
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    if (promotionApplied) {
      return formatter.format(getPromotionPrice(price));
    }

    return formatter.format(price);
  }

  function reduceCost(ticket, index) {
    var checkoutTotal = checkout.total;
    var checkoutSubtotal = checkout.subtotal;
    var checkoutFees = checkout.fees;

    const name = ticket.name;
    if (orderSummary.has(name)) {
      const quantity = orderSummary.get(name) - 1;
      if (quantity === 0) {
        orderSummary.delete(name);
      } else {
        orderSummary.set(name, quantity);
      }
    } else {
      orderSummary.set(name, 1);
    }
    setOrderSummary(orderSummary);

    const updatedTickets = checkout.tickets.map((item, i) => {
      if (index === i && item.quantitySelected > 0) {
        checkoutSubtotal -= ticket.price;
        checkoutFees -= ticket.price * .1
        checkoutTotal = checkoutSubtotal + checkoutFees;

        var ticketSubtotal = item.subtotal - ticket.price;
        var ticketFees = item.fees - ticket.price * .1;
        var ticketTotal = ticketSubtotal + ticketFees;

        console.log(ticketTotal);

        return {
          ...item,
          quantitySelected: item.quantitySelected - 1,
          subtotal: ticketSubtotal,
          fees: ticketFees,
          total: ticketTotal
        };
      } else {
        return item;
      }
    });

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

  function increaseCost(ticket, index) {
    var currentTotal = checkout.total;
    var subtotal = checkout.subtotal;
    var fees = checkout.fees;

    const name = ticket.name;
    if (orderSummary.has(name)) {
      const ticketSummary = orderSummary.get(name) + 1;
      orderSummary.set(name, ticketSummary);
    } else {
      orderSummary.set(name, 1);
    }
    setOrderSummary(orderSummary)

    const updatedTickets = checkout.tickets.map((item, i) => {
      if (index === i && item.quantitySelected < item.maxPurchasePerUser) {
        subtotal += ticket.price;
        fees += ticket.price * .1
        currentTotal = subtotal + fees;

        var ticketSubtotal = item.subtotal + ticket.price;
        var ticketFees = item.fees + ticket.price * .1;
        var ticketTotal = ticketSubtotal + ticketFees;

        console.log(ticketTotal);

        return {
          ...item,
          quantitySelected: item.quantitySelected + 1,
          subtotal: ticketSubtotal,
          fees: ticketFees,
          total: ticketTotal
        };
      } else {
        return item;
      }
    });

    setCheckout(previousOrder => ({
      ...previousOrder,
      ["tickets"]: updatedTickets,
      ["total"]: currentTotal,
      ["fees"]: fees,
      ["subtotal"]: subtotal
    }))

    if (checkout.promotionApplied) {
      setCheckout(previousOrder => ({
        ...previousOrder,
        ["discountedSubtotal"]: getPromotionPrice(subtotal),
        ["discountedFees"]: getPromotionPrice(fees),
        ["discountedTotal"]: getPromotionPrice(currentTotal)
      }))
    }
  }

  return (
    <div className="w-full">
      {contextHolder}
      <div>
        <div className="mb-4">
          <div className="w-full">
            <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor={"promotionCode"}>Promotion Code</label>
          </div>
          <div className="flex w-full">
            <Input onChange={handleChange} name={"promotionCode"} value={promotionCode} id={"promotionCode"} type={"text"} classNames={{ input: "form-input w-full text-gray-800" }} placeholder={"SAVE15"} />
            <Button onClick={applyPromotion} className='my-auto ml-4' type='text'>
              Apply
            </Button>
          </div>
        </div>

        <List
          itemLayout="vertical"
          size="large"
          dataSource={checkout.tickets}
          split={false}
          renderItem={(ticket: any, index: number) => (
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
                      <div className='grow my-auto'>{ticket.name}</div>
                      <div className='flex my-auto justify-end items-end'>
                        <div className='flex'>
                          <Button
                            onClick={() => reduceCost(ticket, index)}
                            className='bg-blue-500 rounded-full'
                            icon={<MinusOutlined className='text-white items-center justify-center' />}>
                          </Button>
                          <div
                            className='mx-2'
                            style={{ fontSize: 20 }}>{ticket.quantitySelected}</div>
                          <Button
                            onClick={() => increaseCost(ticket, index)}
                            className='bg-blue-500 rounded-full'
                            icon={<PlusOutlined className='text-white items-center justify-center' />}>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div key={index} style={{ width: '100%', borderColor: '#D3D3D3' }}>
                  <div style={{ flex: 1, height: 1, backgroundColor: '#D3D3D3' }} />
                  <div className='my-4'>
                    {
                      promotionApplied ?
                        <div className='flex'>
                          <div style={{ textDecorationLine: 'line-through' }}>
                            {getFormattedCurrency(ticket.price)}
                          </div>
                          <div className='ml-1'>
                            {getFormattedCurrency(ticket.price, true)}
                          </div>
                        </div>
                        :
                        <div>{getFormattedCurrency(ticket.price)}</div>
                    }
                    <div>+ {getFormattedFeesCurrency(ticket.price)} fees</div>
                    <div>
                      {ticket.description}
                    </div>
                  </div>
                </div>
              </div>

            </List.Item>
          )}
        />
      </div>
    </div>
  );
}