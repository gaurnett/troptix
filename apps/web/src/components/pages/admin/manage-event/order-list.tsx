import { Button, Input, List } from "antd";
import Link from "next/link";
import { useState } from "react";

export default function OrderListPage({ orders }) {
  const [searchValue, setSearchValue] = useState("");
  const [orderList, setOrderList] = useState<any[]>(orders);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const searchText = event.target.value;
    setSearchValue(searchText);
    filterList(searchText);
  }

  function doesStringInclude(string1: string, string2: string) {
    if (!string1 || !string2) return false;

    return string1.toLowerCase().includes(string2.toLowerCase());
  }

  function filterList(value: string) {
    if (!value) {
      setOrderList(orders);
    } else {
      setOrderList(orders.filter(order => {
        if (!order || !order.user) return false;

        return doesStringInclude(order.id, value) || doesStringInclude(order.user.name, value) || doesStringInclude(order.user.email, value)
      }
      ));
    }
  }

  return (
    <div className="w-full mr-8">
      <div>
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full px-3">
            <Input defaultValue={""} autoComplete="off" placeholder={"Search order number, email, or name"} onChange={handleChange} name={"search"} value={searchValue} id={"search"} type={"text"} classNames={{ input: "form-input w-full text-gray-800" }} />
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