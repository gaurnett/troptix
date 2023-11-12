import { CustomInput, CustomTextArea } from "@/components/ui/input";
import { Card, Col, List, Progress, Row, Spin, Statistic } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, PureComponent } from "react";
import { TropTixResponse, getOrders, GetOrdersType, GetOrdersRequest } from 'troptix-api';
import { Event, OrderSummary } from "troptix-models";
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import SalesChart from "./sales-chart";
import QuantityChart from "./quantity-chart";

const tickets = [{
  quantity: 100,
  total: 200
}]

export default function OrderSummaryPage() {
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

        if (response !== undefined && response.length !== 0) {
          const summary = new OrderSummary(response)
          setOrderSummary(summary);
        }

        let totalTicketCount = 0;
        for (const order of response) {
          totalTicketCount += order.tickets.length
        }
        setTicketsSold(totalTicketCount);

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

  return (
    <div className="w-full md:max-w-md mr-8">
      {
        isFetchingEvents ?
          <Spin className="mt-16" tip="Fetching Order Summary" size="large">
            <div className="content" />
          </Spin> :
          <div>
            {/* <h2 className="text-xl md:text-1xl font-medium leading-tighter tracking-tighter mb-1" data-aos="zoom-y-out">Gross Sales</h2>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out">{getFormattedCurrency(orderSummary.gross)}</h2> */}

            <div className="md:flex ">
              <div className="mb-4 md:mr-4">
                <Card>
                  <Statistic
                    style={{
                      fontSize: "80px"
                    }}
                    title="Gross Sales"
                    value={getFormattedCurrency(orderSummary.gross)}
                    precision={2}
                    valueStyle={{ color: '#3f8600' }}
                    prefix={<ArrowUpOutlined />}
                  />
                </Card>          </div>
              <div className="mb-4">
                <Card>
                  <Statistic
                    title="Total Tickets Sold"
                    value={ticketsSold}
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Card>
              </div>
            </div>

            <div className="flex flex-wrap mb-4">
              <div className="w-full px-3">
                <label className="text-xl md:text-1xl font-medium text-sm mb-1">Sale Analysis</label>
                <SalesChart orders={orders} />
              </div>
            </div>

            <div className="flex flex-wrap">
              <div className="w-full px-3">
                <QuantityChart orders={orders} />
              </div>
            </div>

            <div className="flex flex-wrap mb-4 mt-8">
              <div className="w-full px-3">
                <label className="text-xl md:text-1xl font-medium text-sm mb-1">Ticket Summary</label>
                <List
                  className="demo-loadmore-list"
                  itemLayout="horizontal"
                  dataSource={orderSummary.ticketsSummary}
                  renderItem={(summary: any) => (
                    <List.Item>
                      {TicketSoldItem(summary[1])}
                    </List.Item>
                  )}
                />
              </div>
            </div>
          </div>
      }
    </div>
  );
}