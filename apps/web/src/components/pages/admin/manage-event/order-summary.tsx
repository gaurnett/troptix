import { Spinner } from "@/components/ui/spinner";
import { Card, List, Progress, Statistic } from "antd";
import { useEffect, useState } from "react";
import { OrderSummary } from "troptix-models";
import QuantityChart from "./quantity-chart";
import SalesChart from "./sales-chart";

export default function OrderSummaryPage({ orders }) {
  const [orderSummary, setOrderSummary] = useState<any>(new OrderSummary([]));
  const [isFetchingEvents, setIsFetchingEvents] = useState(true);
  const [ticketsSold, setTicketsSold] = useState(0);
  const [showCharts, setShowCharts] = useState(false);

  useEffect(() => {
    if (orders !== undefined && orders.length !== 0) {
      const summary = new OrderSummary(orders)
      setOrderSummary(summary);
      setShowCharts(true);
    } else {
      setIsFetchingEvents(false);
      return;
    }

    let totalTicketCount = 0;
    for (const order of orders) {
      totalTicketCount += order.tickets.length
    }
    setTicketsSold(totalTicketCount);

    setIsFetchingEvents(false);
  }, [orders]);

  function getFormattedCurrency(price) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    return formatter.format(price)
  }

  function TicketSoldItem(summary) {
    const isComplementary = summary.name === "Complementary";
    const percent = Math.trunc((summary.quantitySold / summary.quantity) * 100);

    return (
      <div className="flex">
        <div>
          {
            isComplementary ?
              <Progress type="circle" size={80} percent={100} format={() => summary.quantitySold} />
              :
              <Progress type="circle" size={80} percent={percent} />
          }
        </div>
        <div className="ml-4 flex justify-center items-center">
          <div>
            <div className="text-base">{summary.name}</div>
            {
              isComplementary ?
                <div className="text-base">{summary.quantitySold} sent</div>
                :
                <div className="text-base">{summary.quantitySold}/{summary.quantity}</div>
            }
          </div>
        </div>

      </div>
    )
  }

  return (
    <div className="w-full mr-8">
      {
        isFetchingEvents ?
          <div className="container mx-auto p-4">
            <Spinner text={"Fetching Order Summary"} />
          </div>
          :
          <div>
            <div className="md:flex">
              <div className="w-full mb-4 md:mr-4">
                <Card>
                  <Statistic
                    style={{
                      fontSize: "80px"
                    }}
                    title="Gross Sales"
                    value={getFormattedCurrency(orderSummary.gross)}
                    precision={2}
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Card>          </div>
              <div className="w-full mb-4">
                <Card>
                  <Statistic
                    title="Total Tickets Sold"
                    value={ticketsSold}
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Card>
              </div>
            </div>

            {
              !showCharts
                ? <></>
                :
                <div>
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
                </div>
            }

          </div>
      }
    </div>
  );
}