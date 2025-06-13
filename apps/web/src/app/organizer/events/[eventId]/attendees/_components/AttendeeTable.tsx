'use client';
import React from 'react';
import { FetchedTicketData } from '../page';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';

export const columns: ColumnDef<FetchedTicketData>[] = [
  {
    accessorKey: 'name',
    header: 'Attendee Name',
    cell: ({ row }) => {
      const name = [row.original.firstName, row.original.lastName]
        .filter(Boolean)
        .join(' ');
      return name || 'N/A';
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => row.original.email || 'N/A',
  },
  {
    accessorKey: 'ticketType.name',
    header: 'Ticket Type',
    cell: ({ row }) => row.original.ticketType?.name || 'N/A',
  },

  {
    accessorKey: 'checkIn',
    header: 'Check In',
    cell: ({ row }) => {
      return (
        <Button
          variant={
            row.original.status === 'AVAILABLE' ? 'default' : 'secondary'
          }
        >
          {row.original.status === 'AVAILABLE' ? 'Check In' : 'Check Out'}
        </Button>
      );
    },
  },
];

interface AttendeeTableProps {
  attendees: FetchedTicketData[];
}

const AttendeeTable = ({ attendees }: AttendeeTableProps) => {
  if (!attendees || attendees.length === 0) {
    return <p>No attendees found for this event.</p>;
  }

  return (
    <div className=" mx-auto">
      <DataTable columns={columns} data={attendees} />
    </div>
  );
};

export default AttendeeTable;
