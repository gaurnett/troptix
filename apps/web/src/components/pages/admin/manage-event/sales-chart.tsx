import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
      display: false,
    },
    title: {
      display: true,
      text: 'Ticket Sales',
    },
  },
};

export default function SalesChart({ orders }) {
  const [data, setData] = useState<any>();
  const [isSettingData, setIsSettingData] = useState(true);

  useEffect(() => {
    function mapOrdersToDateSales(orders: []) {
      let orderCounts = new Map<string, number>();
      orders
        .sort((a: any, b: any) => {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        })
        .forEach((order: any) => {
          const date = format(new Date(order.createdAt), 'MMM dd');
          const currentSalesTotal = orderCounts.has(date)
            ? orderCounts.get(date)
            : 0;
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
      });
      setIsSettingData(false);
    }

    mapOrdersToDateSales(orders);
  }, [orders]);

  return (
    <div>
      {data !== null && !isSettingData ? (
        <Line options={options} data={data} />
      ) : (
        <></>
      )}
    </div>
  );
}
