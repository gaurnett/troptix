import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
      text: 'Ticket Sales',
    },
  },
};

export default function SalesChart({ orders }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    function mapOrdersToDateSales(orders: []) {
      let orderCounts = new Map<string, number>();
      orders.forEach((order: any) => {
        const date = format(new Date(order.createdAt), 'MMM dd');
        const currentSalesTotal = orderCounts.has(date) ? orderCounts.get(date) : 0;
        orderCounts.set(date, currentSalesTotal + order.total);
      });

      setData({
        labels: Array.from(orderCounts.keys()),
        datasets: [
          {
            label: 'Total Ticket Count',
            data: Array.from(orderCounts.values()),
            borderColor: '#388E3C',
            backgroundColor: '#388E3C',
          },
        ],
      })
    }

    mapOrdersToDateSales(orders);
  }, [orders])

  return (
    <div>
      {
        data !== null ?
          <Line options={options} data={data} /> : <></>
      }
    </div>
  );
}
