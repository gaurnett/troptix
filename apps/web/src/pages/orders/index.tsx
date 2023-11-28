import { TropTixContext } from "@/components/WebNavigator";
import { Spinner } from "@/components/ui/spinner";
import { getDateFormatter } from "@/lib/utils";
import { Button, Image, List } from "antd";
import Link from "next/link";
import { useContext, useEffect, useState } from 'react';
import { GetOrdersType, getOrders } from 'troptix-api';

export default function TicketsPage() {
  const { user } = useContext(TropTixContext);
  const userId = user === null || user === undefined ? null : user.id;
  const [isFetchingOrders, setIsFetchingOrders] = useState(true);
  const [orders, setOrders] = useState<any>([]);
  const [width, setWidth] = useState<number>(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;

  useEffect(() => {
    async function fetchOrders() {
      if (!userId) {
        setIsFetchingOrders(false);
        return;
      }

      try {
        const getOrdersRequest: any = {
          getOrdersType: GetOrdersType.GET_ORDERS_FOR_USER,
          userId: userId
        }
        const response = await getOrders(getOrdersRequest);

        if (response !== undefined && response.length !== 0) {
          setOrders(response);
        }
      } catch (error) {
      }

      setIsFetchingOrders(false);
    };

    fetchOrders();
  }, [userId]);

  return (
    <div className="mt-32 w-full md:max-w-2xl mx-auto">
      <h1 className="text-center text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-blue-400">Tickets</span>
      </h1>

      {
        isFetchingOrders ?
          <div className="mt-8"><Spinner text={"Fetching Tickets"} /></div>
          :
          <div>
            <List
              itemLayout="horizontal"
              size="large"
              dataSource={orders}
              renderItem={(order: any) => (
                <List.Item
                  actions={[
                    // <Link key="receipt" target="_blank" rel="noopener noreferrer" href={{ pathname: "/order-confirmation", query: { orderId: order.id } }}>
                    //   <Button>Receipt</Button>
                    // </Link>,
                    // <Link key="tickets" target="_blank" rel="noopener noreferrer" href={{ pathname: "/tickets", query: { orderId: order.id } }}>
                    //   <Button className="bg-blue-600 hover:bg-blue-700" type="primary">Tickets</Button>
                    // </Link>
                  ]}>
                  <div className="w-full" key={order.id} >
                    <div className="flex">
                      <div>
                        <Image
                          preview={false}
                          width={110}
                          height={110}
                          className="w-auto rounded"
                          style={{ objectFit: 'cover' }}
                          src={order.event.imageUrl}
                          alt={"event flyer image"} />
                      </div>
                      <div className="ml-4 my-auto grow w-full ">
                        <div className="font-bold text-xl">{order.event.name}</div>
                        <div className="text-base">{order.event.venue}</div>
                        <p className="text-base text-clip overflow-hidden">{order.event.address}</p>
                        <div className="text-base text-blue-500">{getDateFormatter(new Date(order.event.startDate))}</div>
                      </div>
                      {
                        isMobile ? <></> :
                          <div className="flex my-auto items-end justify-end">
                            <Link className="mr-4" key="receipt" target="_blank" rel="noopener noreferrer" href={{ pathname: "/order-confirmation", query: { orderId: order.id } }}>
                              <Button>Receipt</Button>
                            </Link>
                            <Link key="tickets" target="_blank" rel="noopener noreferrer" href={{ pathname: "/tickets", query: { orderId: order.id } }}>
                              <Button className="bg-blue-600 hover:bg-blue-700" type="primary">Tickets</Button>
                            </Link>
                          </div>
                      }

                    </div>
                    <div className="flex visible md:hidden mt-2">
                      <Link className="mr-4" key="receipt" target="_blank" rel="noopener noreferrer" href={{ pathname: "/order-confirmation", query: { orderId: order.id } }}>
                        <Button>Receipt</Button>
                      </Link>
                      <Link key="tickets" target="_blank" rel="noopener noreferrer" href={{ pathname: "/tickets", query: { orderId: order.id } }}>
                        <Button className="bg-blue-600 hover:bg-blue-700" type="primary">Tickets</Button>
                      </Link>
                    </div>

                  </div>
                </List.Item>

              )}
            />
          </div>
      }

    </div>
  );
}