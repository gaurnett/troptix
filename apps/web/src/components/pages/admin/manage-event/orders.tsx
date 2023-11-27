import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsProps } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GetOrdersType, getOrders } from 'troptix-api';
import OrderCompListPage from "./order-comp-list";
import OrderListPage from "./order-list";
import OrderSummaryPage from "./order-summary";

export default function OrdersPage() {
  const router = useRouter();
  const eventId = router.query.eventId;
  const [isFetchingEvents, setIsFetchingEvents] = useState(true);
  const [orders, setOrders] = useState([]);

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

  function getFormattedCurrency(price) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    return formatter.format(price)
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
    {
      key: 'order-comp-list',
      label: 'Complementary Tickets',
      children: <OrderCompListPage orders={orders} />,
    },
  ];

  return (
    <div className="w-full md:max-w-2xl mr-8">
      {
        isFetchingEvents ?
          <div className="mt-4">
            <Spinner text={"Fetching Order Summary"} />
          </div>
          :
          <div>
            <div className="float-right w-full">
              <Tabs defaultActiveKey="0" items={items} />
            </div>
          </div>
      }
    </div>
  );
}