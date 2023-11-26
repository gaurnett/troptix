import { CustomInput, CustomTextArea } from "@/components/ui/input";
import { Button, Card, Col, Drawer, Input, List, Progress, Row, Spin, Statistic } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, PureComponent } from "react";
import { TropTixResponse, getOrders, GetOrdersType, GetOrdersRequest } from 'troptix-api';
import { Event, OrderSummary } from "troptix-models";
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import SalesChart from "./sales-chart";
import QuantityChart from "./quantity-chart";
import { UserOutlined } from '@ant-design/icons';
import TicketCompForm from "./ticket-comp-form";

const tickets = [{
  quantity: 100,
  total: 200
}]

export default function OrderCompListPage({ orders }) {
  const router = useRouter();
  const eventId = router.query.eventId;
  const [isFetchingEvents, setIsFetchingEvents] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [orderList, setOrderList] = useState<any[]>(orders);
  const [isCompDrawerOpen, setIsCompDrawerOpen] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const searchText = event.target.value;
    setSearchValue(searchText);

    filterList(searchText);
  }

  function doesStringInclude(string1: string, string2: string) {
    return string1.toLowerCase().includes(string2.toLowerCase());
  }
  function filterList(value: string) {
    if (value === "" || value === undefined) {
      setOrderList(orders);
    } else {
      setOrderList(orders.filter(order =>
        doesStringInclude(order.id, value) || doesStringInclude(order.user.name, value) || doesStringInclude(order.user.email, value)
      ));
    }
  }

  const onClose = () => {
    setIsCompDrawerOpen(false);
  };

  return (
    <div className="w-full mr-8">
      {
        isFetchingEvents ?
          <Spin className="mt-16" tip="Fetching Complementary Tickets" size="large">
            <div className="content" />
          </Spin> :
          <div>
            <div className="flex flex-wrap -mx-3 mb-4">
              <div className="w-full px-3">
                <Input placeholder={"Search order number, email, or name"} onChange={handleChange} name={"search"} value={searchValue} id={"search"} type={"text"} classNames={{ input: "form-input w-full text-gray-800" }} />
              </div>
            </div>

            <div className="flex mb-18">
              <Button className="px-6 py-5 ml-4 mb-4 shadow-md items-center justify-center font-medium inline-flex">Create Complementary Ticket</Button>
            </div>

            <List
              itemLayout="horizontal"
              size="large"
              dataSource={orderList}
              pagination={{
                pageSize: 8,
              }}
              renderItem={(order: any) => (
                <List.Item
                  actions={[
                    <Link key="receipt" target="_blank" rel="noopener noreferrer" href={{ pathname: "/order-confirmation", query: { orderId: order.id } }}>
                      <Button>Receipt</Button>
                    </Link>

                  ]}>
                  <div key={order.id} >
                    <div className="flex">
                      <div className="my-auto">
                        <div>{String(order.id).toUpperCase()}</div>
                        <div>{order.user.name}</div>
                        <div>{order.user.email}</div>
                      </div>
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