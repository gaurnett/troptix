import { Spinner } from "@/components/ui/spinner";
import { useFetchUserOrders } from "@/hooks/useOrders";
import { getDateFormatter } from "@/lib/utils";
import { Button, Divider, Empty, Result } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from 'react';

export default function OrdersPage() {
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

  const {
    showSignInError,
    isPending,
    isError,
    data: orders,
    error,
  } = useFetchUserOrders();

  if (showSignInError) {
    return (
      <div className="mt-24">
        <Result
          icon={
            <div className="w-full flex justify-center text-center">
              <Image
                width={75}
                height={75}
                className="w-auto"
                style={{ objectFit: 'contain', width: 100 }}
                src={"/icons/tickets.png"}
                alt={"tickets image"} />
            </div>
          }
          title="Please sign in or sign up with the email used to view orders"
          extra={
            <div>
              <Link
                href={{ pathname: "/auth/signin" }}
                key={"login"}>
                <Button
                  className="mr-2 px-6 py-6 shadow-md items-center justify-center font-medium inline-flex">
                  Log in
                </Button>
              </Link>
              <Link
                href={{ pathname: "/auth/signup" }}
                key={"signup"}>
                <Button
                  type='primary'
                  className="bg-blue-600 hover:bg-blue-700 mr-2 px-6 py-6 shadow-md items-center justify-center font-medium inline-flex">
                  Sign up
                </Button>
              </Link>
            </div>
          }
        />
      </div>
    );
  }

  if (isPending) {
    return (<div className="mt-32"><Spinner text={"Fetching Tickets"} /></div>);
  }

  return (
    <div className="mt-32 w-full md:max-w-xl mx-auto">
      <h1 className="text-center text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-8" data-aos="zoom-y-out">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-blue-400 px-4">Tickets</span>
      </h1>
      <div>
        {
          !orders ?
            <div>
              <Empty
                description={
                  <span>
                    No Tickets Found
                  </span>
                }
              />
            </div>
            :
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
                            width={150}
                            height={150}
                            className="w-auto rounded"
                            style={{ objectFit: 'cover', width: 150, height: 150, maxHeight: 150, maxWidth: 150 }}
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