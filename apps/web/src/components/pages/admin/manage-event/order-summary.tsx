import { Spinner } from '@/components/ui/spinner';
import { Card, List, Progress, Statistic } from 'antd';
import QuantityChart from './quantity-chart';
import SalesChart from './sales-chart';

interface TicketType {
  id: string;
  name: string;
  quantity: number;
}

interface Ticket {
  id: string;
  ticketsType: 'PAID' | 'FREE' | 'COMPLEMENTARY' | string;
  ticketType: TicketType | null;
}

interface Order {
  id: string;
  subtotal: number;
  fees: number;
  tickets: Ticket[];
  // Include other fields if needed by charts (e.g., createdAt for SalesChart)
  createdAt?: string | Date;
}

interface CalculatedTicketSummaryItem {
  name: string;
  quantity: number;
  quantitySold: number;
}
interface CalculatedOrderSummary {
  gross: number;
  fees: number;
  ticketsSummary: Map<string, CalculatedTicketSummaryItem>;
}

/**
 * Calculates order summary statistics from a list of orders.
 */
function calculateOrderSummaryInternal(
  orders: Order[]
): CalculatedOrderSummary {
  const summary: CalculatedOrderSummary = {
    gross: 0,
    fees: 0,
    ticketsSummary: new Map<string, CalculatedTicketSummaryItem>(),
  };

  if (!orders || orders.length === 0) {
    return summary;
  }

  let lastOrderFees = 0;

  for (const order of orders) {
    summary.gross += order.subtotal || 0;
    lastOrderFees = order.fees || 0;

    if (!order.tickets) continue;

    for (const ticket of order.tickets) {
      const isComplementary = ticket.ticketsType === 'COMPLEMENTARY';
      const ticketTypeId = isComplementary
        ? 'COMPLEMENTARY'
        : ticket.ticketType?.id;
      const ticketName = isComplementary
        ? 'Complementary'
        : ticket.ticketType?.name;
      const quantityAvailable = isComplementary
        ? 0
        : ticket.ticketType?.quantity ?? 0;

      if (!ticketTypeId || !ticketName) {
        console.warn(
          'Skipping ticket summary calculation for ticket without ID or Name:',
          ticket
        );
        continue;
      }

      const existingSummaryItem = summary.ticketsSummary.get(ticketTypeId);

      if (existingSummaryItem) {
        existingSummaryItem.quantitySold += 1;
      } else {
        summary.ticketsSummary.set(ticketTypeId, {
          name: ticketName,
          quantity: quantityAvailable,
          quantitySold: 1,
        });
      }
    }
  }

  summary.fees = lastOrderFees;

  return summary;
}

/**
 * Calculates the total number of tickets sold across all orders.
 */
function calculateTotalTicketsSoldInternal(orders: Order[]): number {
  // No need to check for null/undefined here if called correctly
  if (!orders) return 0;
  return orders.reduce(
    (total, order) => total + (order.tickets?.length || 0),
    0
  );
}

export default function OrderSummaryPage({
  orders,
  isLoading,
}: {
  orders: Order[] | undefined;
  isLoading: boolean;
}) {
  const calculatedSummary: CalculatedOrderSummary | null = orders
    ? calculateOrderSummaryInternal(orders)
    : null;

  const totalTicketsSold: number = orders
    ? calculateTotalTicketsSoldInternal(orders)
    : 0;

  function getFormattedCurrency(price: number): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formatter.format(price);
  }

  function TicketSoldItem(summaryItem: CalculatedTicketSummaryItem) {
    const isComplementary = summaryItem.name === 'Complementary';
    const percent =
      summaryItem.quantity > 0
        ? Math.trunc((summaryItem.quantitySold / summaryItem.quantity) * 100)
        : 0;

    return (
      <div className="flex items-center py-2">
        <div>
          {isComplementary ? (
            <Progress
              type="circle"
              size={60}
              percent={100}
              format={() => `${summaryItem.quantitySold}`}
            />
          ) : (
            <Progress type="circle" size={60} percent={percent} />
          )}
        </div>
        <div className="ml-4">
          <div className="text-base font-medium">{summaryItem.name}</div>
          {isComplementary ? (
            <div className="text-sm text-gray-600">
              {summaryItem.quantitySold} sent
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              {summaryItem.quantitySold} / {summaryItem.quantity}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-40">
        <Spinner text={'Loading Order Summary...'} />
      </div>
    );
  }

  return (
    <div className="w-full mr-8">
      <div className="md:flex md:space-x-4 mb-6">
        <div className="w-full mb-4 md:mb-0">
          <Card bordered={false}>
            <Statistic
              title="Gross Sales"
              value={getFormattedCurrency(calculatedSummary?.gross ?? 0)}
              precision={2}
              valueStyle={{ color: '#3f8600', fontSize: '24px' }}
            />
          </Card>
        </div>
        <div className="w-full">
          <Card bordered={false}>
            <Statistic
              title="Total Tickets Sold"
              value={totalTicketsSold}
              valueStyle={{ color: '#3f8600', fontSize: '24px' }}
            />
          </Card>
        </div>
      </div>

      {calculatedSummary && calculatedSummary.ticketsSummary.size > 0 ? (
        <div className="space-y-8">
          <div>
            <Card bordered={false}>
              <h3 className="text-lg font-medium mb-4">Ticket Summary</h3>
              <List
                itemLayout="horizontal"
                dataSource={Array.from(
                  calculatedSummary.ticketsSummary.entries()
                )}
                renderItem={([key, summaryItem]: [
                  string,
                  CalculatedTicketSummaryItem,
                ]) => (
                  <List.Item
                    key={key}
                    style={{
                      padding: '8px 0',
                      borderBottom: '1px solid #f0f0f0',
                    }}
                  >
                    {TicketSoldItem(summaryItem)}
                  </List.Item>
                )}
              />
            </Card>
          </div>

          {orders && orders.length > 0 && (
            <>
              <div>
                <Card bordered={false}>
                  <h3 className="text-lg font-medium mb-4">Sale Analysis</h3>
                  <SalesChart orders={orders} />
                </Card>
              </div>
              <div>
                <Card bordered={false}>
                  <h3 className="text-lg font-medium mb-4">
                    Quantity Analysis
                  </h3>
                  <QuantityChart orders={orders} />
                </Card>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="mt-8 text-center text-gray-500 bg-gray-50 p-6 rounded-md">
          {orders && orders.length === 0
            ? 'No orders found for this event yet.'
            : 'No ticket summary data to display.'}
        </div>
      )}
    </div>
  );
}
