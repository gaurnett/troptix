import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { format } from 'date-fns';

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
      display: false
    },
    title: {
      display: true,
      text: 'Quantity Sold',
    },
  },
};

export default function QuantityChart({ orders }) {
  const [data, setData] = useState<any>();

  useEffect(() => {
    function mapOrdersToDateCount(orders: []) {
      let orderCounts = new Map<string, number>();
      orders.forEach((order: any) => {
        const date = format(new Date(order.createdAt), 'MMM dd');
        const currentTicketCount = orderCounts.has(date) ? orderCounts.get(date) : 0;
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
      })
    }

    mapOrdersToDateCount(orders);
  }, [orders])

  return (
    <div>
      {
        data !== null ?
          <Bar options={options} data={data} /> : <></>
      }
    </div>
  );
}
