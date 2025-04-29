'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ColumnDef,
  Table as ReactTable,
  RowData,
  FilterFn,
} from '@tanstack/react-table';

import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircleIcon } from 'lucide-react';

interface TicketType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  quantitySold: number | null;
  saleStartDate: Date;
  saleEndDate: Date;
}

const priceFilterFn: FilterFn<TicketType> = (row, columnId, filterValue) => {
  const price = row.getValue<number>(columnId);
  if (filterValue === '0') {
    return price === 0;
  }
  if (filterValue === 'paid') {
    return price > 0;
  }
  return true;
};

const columns: ColumnDef<TicketType>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row, table }) => {
      const ticket = row.original;
      const eventId = table.options.meta?.eventId;
      if (!eventId) return <span>{ticket.name}</span>;
      return (
        <Link href={`/organizer/events/${eventId}/tickets/${ticket.id}`}>
          <span className="font-medium hover:underline cursor-pointer">
            {ticket.name}
          </span>
        </Link>
      );
    },
  },
  {
    accessorKey: 'price',
    header: 'Price',
    filterFn: priceFilterFn,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));
      const formatted =
        price === 0
          ? 'Free'
          : new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(price);
      return <div>{formatted}</div>;
    },
  },
  {
    id: 'sold',
    header: 'Sold / Available',
    cell: ({ row }) => {
      const ticket = row.original;
      const sold = ticket.quantitySold ?? 0;
      const available = ticket.quantity;
      return <div>{`${sold} / ${available}`}</div>;
    },
  },
  {
    accessorKey: 'saleStartDate',
    header: 'Sale Starts',
    cell: ({ row }) => {
      const date = row.getValue('saleStartDate') as Date;
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: 'saleEndDate',
    header: 'Sale Ends',
    cell: ({ row }) => {
      const date = row.getValue('saleEndDate') as Date;
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: 'status',
    header: 'Status',
    accessorFn: (row) => {
      const now = new Date();
      const startDate = row.saleStartDate;
      const endDate = row.saleEndDate;
      if (now < startDate) return 'Upcoming';
      if (now > endDate) return 'Ended';
      return 'On Sale';
    },
    filterFn: 'equalsString',
  },
];

declare module '@tanstack/table-core' {
  interface TableMeta<TData extends RowData> {
    eventId?: string;
  }
}

interface TicketTableWrapperProps {
  eventId: string;
  initialTicketTypes: TicketType[];
}

export default function TicketTableWrapper({
  eventId,
  initialTicketTypes,
}: TicketTableWrapperProps) {
  const router = useRouter();

  const handleAddTicket = () => {
    router.push(`/organizer/events/${eventId}/tickets/new`);
  };

  const renderToolbar = (table: ReactTable<TicketType>) => (
    <div className="flex items-center gap-2 justify-end flex-wrap gap-y-2">
      <div className="hidden sm:flex sm:items-center sm:gap-2">
        <Select
          value={
            (table.getColumn('price')?.getFilterValue() as string) ?? 'all'
          }
          onValueChange={(value) => {
            if (value === 'all') {
              table.getColumn('price')?.setFilterValue(undefined);
            } else {
              table.getColumn('price')?.setFilterValue(value);
            }
          }}
        >
          <SelectTrigger className="h-8 w-[120px]">
            <SelectValue placeholder="Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="0">Free</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={
            (table.getColumn('status')?.getFilterValue() as string) ?? 'all'
          }
          onValueChange={(value) =>
            table
              .getColumn('status')
              ?.setFilterValue(value === 'all' ? undefined : value)
          }
        >
          <SelectTrigger className="h-8 w-[120px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="On Sale">On Sale</SelectItem>
            <SelectItem value="Upcoming">Upcoming</SelectItem>
            <SelectItem value="Ended">Ended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button size="sm" className="h-8" onClick={handleAddTicket}>
        <PlusCircleIcon className="mr-2 h-4 w-4" />
        Add Ticket
      </Button>
    </div>
  );

  return (
    <DataTable
      columns={columns}
      data={initialTicketTypes}
      filterColumnId="name"
      filterInputPlaceholder="Search ticket names..."
      renderToolbarActions={renderToolbar}
      meta={{ eventId }}
      enableColumnVisibility={true}
      enablePagination={true}
    />
  );
}
