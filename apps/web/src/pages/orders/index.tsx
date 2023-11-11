import { TropTixContext } from "@/components/WebNavigator";
import { Avatar, List, Spin } from "antd";
import Link from "next/link";
import { useContext, useEffect, useState } from 'react';
import { TicketSummary, TicketsSummary, getOrders, Ticket, getTicketsForUser, GetOrdersType, GetOrdersRequest } from 'troptix-api';

const data = Array.from({ length: 5 }).map((_, i) => ({
  href: 'https://ant.design',
  title: `ant design part ${i}`,
  avatar: `https://xsgames.co/randomusers/avatar.php?g=pixel&key=${i}`,
  description:
    'Ant Design, a design language for background applications, is refined by Ant UED Team.',
  content:
    'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
}));

export default function TicketsPage() {
  const { user } = useContext(TropTixContext);
  const userId = user === null || user === undefined ? null : user.id;
  const [isFetchingOrders, setIsFetchingOrders] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      if (!userId) {
        setIsFetchingOrders(false);
        return;
      }

      try {
        const getOrdersRequest: GetOrdersRequest = {
          getOrdersType: GetOrdersType.GET_ORDERS_FOR_USER,
          userId: userId
        }
        const response = await getOrders(getOrdersRequest);

        if (response !== undefined && response.length !== 0) {
          setOrders(response);
        }
      } catch (error) {
        console.log("TicketsScreen [fetchOrders] error: " + error)
      }

      setIsFetchingOrders(false);
    };

    fetchOrders();
  }, [userId]);

  return (
    <div className="mt-32 w-full md:max-w-xl mx-auto">
      <h1 className="text-center text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out"><span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-teal-400">Tickets</span></h1>

      {
        isFetchingOrders ?
          <Spin className="mt-16" tip="Fetching Tickets" size="large">
            <div className="content" />
          </Spin> :
          <div>
            <List
              // locale={{ emptyText: "No Orders Available" }}
              itemLayout="vertical"
              size="large"
              dataSource={orders}
              renderItem={(order) => (
                <List.Item>
                  <Link key={order.id} href={{ pathname: "/tickets", query: { orderId: order.id } }} >
                    <List.Item.Meta
                      avatar={<Avatar size={"large"} src={order.event.imageUrl} />}
                      title={<a href={"/"}>{order.event.name}</a>}
                      description={new Date(order.event.startDate).toDateString()}
                    />
                  </Link>
                </List.Item>

              )}
            />
          </div>
      }

    </div>
  );
}