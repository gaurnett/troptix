// app/organizer/events/[eventId]/_components/DailyPerformanceChart.tsx
'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  LineChart,
} from 'recharts';
import { format } from 'date-fns'; // Use date-fns for reliable formatting
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface DailyDataPoint {
  date: string;
  tickets?: number | null; // Optional: data might only have one or the other
  revenue?: number | null; // Optional: data might only have one or the other
}

interface DailyPerformanceChartProps {
  data: DailyDataPoint[];
}

// Define chart configurations
const ticketChartConfig = {
  tickets: {
    label: 'Tickets Sold',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const revenueChartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

// Formatter for currency
const formatCurrency = (value: number) =>
  value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

// Formatter for date
const formatDate = (value: string) =>
  format(new Date(value + 'T00:00:00'), 'MMM d'); // Format as 'Apr 22'

export function DailyPerformanceChart({ data }: DailyPerformanceChartProps) {
  return (
    // Wrap charts in a Card or display them separately
    <Card>
      <CardHeader>
        <CardTitle>Daily Performance</CardTitle>
        <CardDescription>
          Ticket sales and revenue over the last 30 days.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Ticket Sales Chart */}
        <div>
          <h3 className="text-sm font-medium mb-2">Tickets Sold</h3>
          <ChartContainer
            config={ticketChartConfig}
            className="h-[200px] w-full"
          >
            <AreaChart
              accessibilityLayer
              data={data}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={formatDate}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" hideLabel />}
              />
              <Area
                dataKey="tickets"
                type="natural"
                fill="var(--color-tickets)"
                fillOpacity={0.4}
                stroke="var(--color-tickets)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </div>

        {/* Revenue Chart */}
        <div>
          <h3 className="text-sm font-medium mb-2">Revenue</h3>
          <ChartContainer
            config={revenueChartConfig}
            className="h-[200px] w-full"
          >
            <AreaChart
              accessibilityLayer
              data={data}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={formatDate}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={formatCurrency}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    hideLabel
                    formatter={formatCurrency}
                  />
                }
              />
              <Area
                dataKey="revenue"
                type="natural"
                fill="var(--color-revenue)"
                fillOpacity={0.4}
                stroke="var(--color-revenue)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
