// app/organizer/events/[eventId]/_components/TicketTypePieChart.tsx
'use client';

import * as React from 'react';
import { Pie, PieChart } from 'recharts';
import { TrendingUp } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface TicketTypeData {
  name: string;
  sold: number;
}

interface TicketTypePieChartProps {
  data: TicketTypeData[];
}

const chartConfig = {
  sold: {
    label: 'Tickets Sold',
  },
  'General Admission': {
    label: 'General Admission',
    color: 'hsl(var(--chart-1))',
  },
  'VIP Pass': {
    label: 'VIP Pass',
    color: 'hsl(var(--chart-2))',
  },
  'Early Bird': {
    label: 'Early Bird',
    color: 'hsl(var(--chart-3))',
  },
  'Student Ticket': {
    label: 'Student',
    color: 'hsl(var(--chart-4))',
  },
  Complimentary: {
    label: 'Comp',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

export function TicketTypePieChart({ data }: TicketTypePieChartProps) {
  const totalSold = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.sold, 0);
  }, [data]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Tickets Sold by Type</CardTitle>
        {/* TODO: Add a relevant description like event date range */}
        {/* <CardDescription>For Event Duration</CardDescription> */}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {totalSold > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px] pb-0 [&_.recharts-pie-label-text]:fill-foreground" // Added class for label visibility
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />} // Tooltip shows value on hover
              />
              <Pie data={data} dataKey="sold" nameKey="name" label />
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-[250px] text-muted-foreground">
            No ticket sales data available.
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {/* TODO: Could a footer with a note with insights about the ticket types */}
        {/* <div className="flex items-center gap-2 font-medium leading-none">
            VIP tickets trending <TrendingUp className="h-4 w-4" />
          </div> */}
        <div className="leading-none text-muted-foreground">
          Showing breakdown for {totalSold.toLocaleString()} tickets sold.
        </div>
      </CardFooter>
    </Card>
  );
}
