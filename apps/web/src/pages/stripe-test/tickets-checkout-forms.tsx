import _ from 'lodash';
import { message, Button, Spin, Modal, List, Steps, theme } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Event, getEventsFromRequest, Checkout, Order, Charge } from 'troptix-models';
import { TropTixResponse, getEvents, saveEvent, GetEventsRequest, GetEventsType } from 'troptix-api';

import {
  PlusOutlined,
  MinusOutlined
} from '@ant-design/icons';

export default function TicketsCheckoutForm({ checkout, setCheckout }) {
  const { token } = theme.useToken();

  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const [isFetchingEvent, setIsFetchingEvent] = useState(true);
  const [eventName, setEventName] = useState("");
  const [publishButtonClicked, setPublishButtonClicked] = useState(false);

  const [promotionCode, setPromotionCode] = useState();
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
    <div className="w-full md:max-w-2xl mx-auto">
      {contextHolder}
      <div>
        <List
          itemLayout="vertical"
          size="large"
          dataSource={checkout.tickets}
          renderItem={(ticket: any, index: number) => (
            <List.Item>
              <div
                className='px-4'
                style={{ width: '100%', borderWidth: 1, borderRadius: 10, borderColor: '#D3D3D3' }}>
                <div>
                  <div className="my-auto">
                    <div
                      className='flex h-12'>
                      <div className='grow my-auto'>{ticket.name}</div>
                      <div className='flex my-auto justify-end items-end'>
                        <div className='flex'>
                          <Button
                            onClick={() => reduceCost(ticket, index)}
                            className='bg-blue-500 my-auto'
                            style={{ borderRadius: 32 }} >
                            <MinusOutlined twoToneColor="#eb2f96" />
                          </Button>
                          <div
                            style={{ fontSize: 20 }}>{ticket.quantitySelected}</div>
                          <Button
                            onClick={() => increaseCost(ticket, index)}
                            className='bg-blue-500'
                            style={{ borderRadius: 16 }}>
                            <PlusOutlined />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div key={index} style={{ width: '100%', borderColor: '#D3D3D3' }}>
                  <div style={{ flex: 1, height: 1, backgroundColor: '#D3D3D3' }} />
                  <div>
                    {
                      promotionApplied ?
                        <div>
                          <div style={{ textDecorationLine: 'line-through' }}>
                            {getFormattedCurrency(ticket.price)}
                          </div>
                          <div> </div>
                          <div>{getFormattedCurrency(ticket.price, true)}</div>
                        </div> :
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