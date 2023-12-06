import { Spinner } from "@/components/ui/spinner";
import { useFetchEventOrders } from "@/hooks/useOrders";
import { Tabs, TabsProps } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";
import OrderCompListPage from "./order-comp-list";
import OrderGuestListPage from "./order-guest-list";
import OrderListPage from "./order-list";
import OrderSummaryPage from "./order-summary";

export default function OrdersPage() {
  const router = useRouter();
  const eventId = router.query.eventId;
  const [isFetchingEvents, setIsFetchingEvents] = useState(true);

  const {
    isPending,
    isError,
    data: orders,
    error,
  } = useFetchEventOrders(eventId as string);

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
      key: 'order-guest-list',
      label: 'Guest List',
      children: <OrderGuestListPage orders={orders} />,
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
        isPending ?
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