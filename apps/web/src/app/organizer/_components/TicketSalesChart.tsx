'use client';

import { useState, useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
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
} from '@/components/ui/chart'; // Assuming charts components are in ui/chart
import { Button } from '@/components/ui/button';

// Define the expected data structure for the chart prop
interface ChartDataPoint {
  date: string;
  tickets: number;
}

interface TicketSalesChartProps {
  data: ChartDataPoint[];
}

// Define the chart configuration
const chartConfig = {
  tickets: {
    label: 'Tickets Sold',
    color: 'hsl(var(--chart-1))', // Use Shadcn chart colors
  },
} satisfies ChartConfig;

export function TicketSalesChart({ data }: TicketSalesChartProps) {
  const [selectedRange, setSelectedRange] = useState<7 | 30>(30);

  // Memoize the filtered data based on the selected range
  const filteredData = useMemo(() => {
    if (!data) return [];
    // Ensure data is sorted by date if it isn't already
    const sortedData = [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    // Slice the last N days
    return sortedData.slice(-selectedRange);
  }, [data, selectedRange]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Ticket Sales Over Time</CardTitle>
          <CardDescription>Last {selectedRange} days</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={selectedRange === 7 ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedRange(7)}
          >
            7 Days
          </Button>
          <Button
            variant={selectedRange === 30 ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedRange(30)}
          >
            30 Days
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart
            accessibilityLayer // Good for accessibility
            data={filteredData}
            margin={{
              left: 12, // Add margin for Y-axis labels
              right: 12, // Add margin for potential right-side elements
            }}
          >
            <CartesianGrid vertical={false} /> {/* Horizontal grid lines */}
            <XAxis
              dataKey="date"
              tickLine={false} // Hide tick lines
              axisLine={false} // Hide axis line
              tickMargin={8}
              // Format date labels if needed (e.g., show Month/Day)
              tickFormatter={(value) => {
                try {
                  const date = new Date(value + 'T00:00:00'); // Ensure parsing in local time
                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  });
                } catch (e) {
                  return value;
                } // Fallback
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 'auto']} // Ensure the Y-axis starts at 0
              // Consider tickCount for better spacing if needed
            />
            <ChartTooltip
              cursor={false} // Hide cursor line on hover
              content={<ChartTooltipContent hideLabel />} // Use Shadcn tooltip style, hide default label
            />
            <Area
              dataKey="tickets"
              type="monotoneX" // Change from "natural" to "monotoneX"
              fill="var(--color-tickets)" // Use color from chartConfig
              fillOpacity={0.4}
              stroke="var(--color-tickets)"
              stackId="a" // Required for Area chart styling
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
