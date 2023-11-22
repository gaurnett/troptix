import { CustomInput, CustomTextArea } from "@/components/ui/input";
import { Card, Col, List, Progress, Row, Spin, Statistic, Tabs, TabsProps } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, PureComponent } from "react";
import { TropTixResponse, getOrders, GetOrdersType, GetOrdersRequest } from 'troptix-api';
import { Event, OrderSummary } from "troptix-models";
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import SalesChart from "./sales-chart";
import QuantityChart from "./quantity-chart";
import OrderSummaryPage from "./order-summary";
import OrderListPage from "./order-list";

export default function OrdersPage() {
  const router = useRouter();
  const eventId = router.query.eventId;
  const [orderSummary, setOrderSummary] = useState<any>(new OrderSummary([]));
  const [isFetchingEvents, setIsFetchingEvents] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ticketsSold, setTicketsSold] = useState(0);

  useEffect(() => {
    async function fetchOrderSummary() {
      try {
        const getOrdersRequest: any = {
          getOrdersType: GetOrdersType.GET_ORDERS_FOR_EVENT,
          eventId: eventId
        }
        const response = await getOrders(getOrdersRequest);
        setOrders(response);

        setIsFetchingEvents(false);
      } catch (error) {
        setIsFetchingEvents(false);
      }
    };

    fetchOrderSummary();
  }, [eventId]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.name);
    console.log(event.target.value);
  }

  function getFormattedCurrency(price) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    return formatter.format(price)
  }

  async function signIn() {
    console.log("signing in");
  }

  function TicketSoldItem(summary) {
    console.log("Summary: " + JSON.stringify(summary));
    const percent = Math.trunc((summary.quantitySold / summary.quantity) * 100);

    return (
      <div className="flex">
        <div>
          <Progress type="circle" size={80} percent={percent} />
        </div>
        <div className="ml-4 flex justify-center items-center">
          <div>
            <div>{summary.name}</div>
            <div>{summary.quantitySold}/{summary.quantity}</div>
          </div>
        </div>

      </div>
    )
  }

  const items: TabsProps['items'] = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      children: <OrderSummaryPage orders={orders} />,
    },
    {
      key: 'order-list',
      label: 'Order List',
      children: <OrderListPage orders={orders} />,
    },
  ];

  return (
    <div className="w-full md:max-w-2xl mr-8">
      {
        isFetchingEvents ?
          <Spin className="mt-16" tip="Fetching Order Summary" size="large">
            <div className="content" />
          </Spin> :
          <div>
            <div className="float-right w-full">
              <Tabs defaultActiveKey="0" items={items} />
            </div>
          </div>
      }
    </div>
  );
}