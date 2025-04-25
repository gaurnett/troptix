// app/organizer/events/[eventId]/_components/DailyRevenueChart.tsx
'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { format } from 'date-fns';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'; // Assuming path to shadcn UI components

// Define the shape of the data points specific to this chart
interface DailyRevenueDataPoint {
  date: string; // Expecting format like "YYYY-MM-DD"
  revenue: number;
}

// Define the props for this component
interface DailyRevenueChartProps {
  data: DailyRevenueDataPoint[];
}

// Chart configuration specific to revenue
const revenueChartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-2))', // Use your defined CSS variable
  },
} satisfies ChartConfig;

// Helper to format currency for the Y-axis and tooltip
const formatCurrency = (value: number) =>
  value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0, // Show whole dollars
  });

// Helper to format date for the X-axis
const formatDate = (value: string) => {
  try {
    // Attempt to parse the date assuming "YYYY-MM-DD" and format
    // Adding 'T00:00:00' helps avoid timezone issues during parsing
    return format(new Date(value + 'T00:00:00'), 'MMM d'); // e.g., "Apr 25"
  } catch (error) {
    console.error('Error formatting date:', value, error);
    return value; // Fallback to original string if formatting fails
  }
};

export function DailyRevenueChart({ data }: DailyRevenueChartProps) {
  // Handle case with no data
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No revenue data available for this period.
      </div>
    );
  }
  return (
    <ChartContainer config={revenueChartConfig} className="h-[250px] w-full">
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12, // Space for Y-axis labels
          right: 12,
          top: 10,
          bottom: 0,
        }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
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
          width={80} // Adjust width to fit currency labels
        />
        <ChartTooltip
          cursor={true} // Enable cursor line
          content={
            <ChartTooltipContent
              labelFormatter={formatDate} // Format date in tooltip header
              formatter={(value, name) => {
                // Format the value as currency inside the tooltip body
                if (name === 'revenue' && typeof value === 'number') {
                  return formatCurrency(value);
                }
                return String(value);
              }}
              indicator="dot" // Style of the indicator on the line
            />
          }
        />
        <defs>
          {/* Define gradient */}
          <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-revenue)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-revenue)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="revenue"
          type="natural" // Smooth curve
          fill="url(#fillRevenue)" // Use gradient fill
          // fillOpacity={0.4} // Opacity handled by gradient now
          stroke="var(--color-revenue)"
          strokeWidth={2}
          stackId="a" // Required for AreaChart, even with one area
          dot={false} // Hide dots on the line unless hovered
        />
      </AreaChart>
    </ChartContainer>
  );
}
