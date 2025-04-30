'use client';

import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { FetchedOrder } from '../page'; // Import the type
import { type ColumnDef } from '@tanstack/react-table'; // Keep ColumnDef

// Import DataTable and Button
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
// Import an icon
import { EyeIcon } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import OrderDetails from './OrderDetails';

interface OrderTableProps {
  initialOrders: FetchedOrder[];
}

export default function OrderTable({ initialOrders }: OrderTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<FetchedOrder | null>(null);

  const handleRowClick = (order: FetchedOrder) => {
    setSelectedOrder(order);
  };

  const handleDialogClose = () => {
    setSelectedOrder(null);
  };

  const columns = useMemo<ColumnDef<FetchedOrder>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Order ID',
        cell: ({ row }) => {
          const order = row.original;
          return <span className="font-medium">{order.id}</span>;
        },
      },
      {
        id: 'name',
        header: 'Name',
        accessorFn: (order) =>
          [order.firstName, order.lastName].filter(Boolean).join(' ') || 'N/A',
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => {
          const email = row.getValue('email') as string | null;
          return email ? (
            <a href={`mailto:${email}`} className="hover:underline">
              {email}
            </a>
          ) : (
            <span>{'N/A'}</span>
          );
        },
      },
      {
        accessorKey: 'total',
        header: () => <div className="text-right">Total</div>,
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue('total'));
          const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(amount);
          return <div className="text-right font-medium">{formatted}</div>;
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Date',
        cell: ({ row }) => {
          const date = row.getValue('createdAt') as Date | null;
          return <div>{date ? format(new Date(date), 'PPpp') : 'N/A'}</div>;
        },
      },
      {
        id: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
          const order = row.original;
          return (
            <div className="text-right">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRowClick(order)}
              >
                <span className="sr-only">View Details</span>
                <EyeIcon className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [handleRowClick]
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={initialOrders}
        filterColumnId="name"
        filterInputPlaceholder="Search by name..."
      />

      <Dialog
        open={!!selectedOrder}
        onOpenChange={(open) => !open && handleDialogClose()}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && <OrderDetails order={selectedOrder} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
