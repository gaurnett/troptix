import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
      display: false,
    },
    title: {
      display: true,
      text: 'Quantity Sold',
    },
  },
};

export default function QuantityChart({ orders }) {
  const [data, setData] = useState<any>();
  const [isSettingData, setIsSettingData] = useState(true);

  useEffect(() => {
    function mapOrdersToDateCount(orders: []) {
      let orderCounts = new Map<string, number>();
      orders
        .sort((a: any, b: any) => {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        })
        .forEach((order: any) => {
          const date = format(new Date(order.createdAt), 'MMM dd');
          const currentTicketCount = orderCounts.has(date)
            ? orderCounts.get(date)
            : 0;
          orderCounts.set(date, currentTicketCount + order.tickets.length);
        });

      setData({
        labels: Array.from(orderCounts.keys()),
        datasets: [
          {
            label: 'Total Ticket Count',
            data: Array.from(orderCounts.values()),
            backgroundColor: '#607D8B',
          },
        ],
      });
      setIsSettingData(false);
    }

    mapOrdersToDateCount(orders);
  }, [orders]);

  return (
    <div>
      {data !== null && !isSettingData ? (
        <Bar options={options} data={data} />
      ) : (
        <></>
      )}
    </div>
  );
}
