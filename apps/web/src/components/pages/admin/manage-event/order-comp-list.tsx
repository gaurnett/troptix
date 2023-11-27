import { Button, Input, List } from "antd";
import Link from "next/link";
import { useState } from "react";

export default function OrderCompListPage({ orders }) {
  const [searchValue, setSearchValue] = useState("");
  const filteredOrders = orders.filter(order => {
    const tickets = order.tickets;
    let complementaryFound = false;
    tickets.forEach(ticket => {
      if (String(ticket.ticketsType) === "COMPLEMENTARY") {
        complementaryFound = true;
        return;
      }
    });

    return complementaryFound;
  })
  const [orderList, setOrderList] = useState<any[]>(filteredOrders);

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

  return (
    <div className="w-full mr-8">
      <div>
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full px-3 font-bold">
            Create and send out complementary tickets by visiting the Tickets Tab.
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full px-3">
            <Input placeholder={"Search order number, email, or name"} onChange={handleChange} name={"search"} value={searchValue} id={"search"} type={"text"} classNames={{ input: "form-input w-full text-gray-800" }} />
          </div>
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
                    <div>{order.user ? order.user?.name : order.name}</div>
                    <div>{order.user ? order.user.email : order.email}</div>
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