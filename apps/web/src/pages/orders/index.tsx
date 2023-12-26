import { TropTixContext } from "@/components/WebNavigator";
import { Spinner } from "@/components/ui/spinner";
import { getDateFormatter } from "@/lib/utils";
import { Divider } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from 'react';
import { GetOrdersType, getOrders } from 'troptix-api';

export default function TicketsPage() {
  const { user } = useContext(TropTixContext);
  const userId = user === null || user === undefined ? null : user.id;
  const [isFetchingOrders, setIsFetchingOrders] = useState(true);
  const [orders, setOrders] = useState<any>([]);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768
  );

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }

    if (typeof window !== 'undefined') {
      handleResize();
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  useEffect(() => {
    async function fetchOrders() {
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

  if (isFetchingOrders) {
    return (<div className="mt-32"><Spinner text={"Fetching Tickets"} /></div>);
  }

  return (
    <div className="mt-32 w-full md:max-w-xl mx-auto">
      <h1 className="text-center text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-8" data-aos="zoom-y-out">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-blue-400 px-4">Tickets</span>
      </h1>
      <div>
        {
          orders.map((order, index: any) => {
            return (
              <div
                key={index}
                className="w-full mb-4"
              >
                <Link key={index} href={{ pathname: "/order-details", query: { orderId: order.id } }}>
                  <div className="w-full" key={order.id} >
                    <div className="flex">
                      <div className="my-auto">
                        <Image
                          width={110}
                          height={110}
                          className="w-auto rounded"
                          style={{ objectFit: 'cover', width: 150, height: 150 }}
                          src={order.event.imageUrl}
                          alt={"event flyer image"} />
                      </div>
                      <div className="ml-4 my-auto grow w-full ">
                        <div className="font-bold text-xl">{order.event.name}</div>
                        <div className="text-base">{order.event.venue}</div>
                        <p className="text-base text-clip overflow-hidden">{order.event.address}</p>
                        <div className="text-base text-blue-500">{getDateFormatter(new Date(order.event.startDate))}</div>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="px-6">
                  <Divider dashed />
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  );
}