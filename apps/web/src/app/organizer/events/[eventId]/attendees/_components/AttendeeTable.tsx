'use client';
import React, { useTransition } from 'react';
import { useParams } from 'next/navigation';
import { FetchedTicketData } from '../page';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { toggleTicketStatus } from '../_actions/attendeeActions';

interface AttendeeTableProps {
  attendees: FetchedTicketData[];
}

const CheckInButton = ({ ticketId, currentStatus, eventId }: { 
  ticketId: string; 
  currentStatus: string; 
  eventId: string; 
}) => {
  const [isPending, startTransition] = useTransition();

  const handleToggleStatus = async () => {
    startTransition(async () => {
      try {
        const result = await toggleTicketStatus(ticketId, eventId);

        if (result.success) {
          toast.success(
            currentStatus === 'AVAILABLE'
              ? 'Attendee checked in successfully!'
              : 'Attendee checked out successfully!'
          );
        } else {
          toast.error(result.error || 'Failed to update check-in status');
        }
      } catch (error) {
        console.error('Error toggling ticket status:', error);
        toast.error('Failed to update check-in status');
      }
    });
  };

  return (
    <Button
      variant={currentStatus === 'AVAILABLE' ? 'default' : 'outline'}
      size="sm"
      onClick={handleToggleStatus}
      disabled={isPending}
      className="min-w-[88px] h-8"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <span className="whitespace-nowrap">
          {currentStatus === 'AVAILABLE' ? 'Check In' : 'Check Out'}
        </span>
      )}
    </Button>
  );
};

const AttendeeTable = ({ attendees }: AttendeeTableProps) => {
  const params = useParams();
  const eventId = params?.eventId as string;

  const columns: ColumnDef<FetchedTicketData>[] = [
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
      accessorKey: 'order.id',
      header: 'Order ID',
      cell: ({ row }) => row.original.order?.id || 'N/A',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge 
            variant={status === 'NOT_AVAILABLE' ? 'default' : 'secondary'}
            className="whitespace-nowrap"
          >
            {status === 'NOT_AVAILABLE' ? 'Checked In' : 'Available'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'checkIn',
      header: 'Action',
      cell: ({ row }) => {
        const ticketId = row.original.id;
        const currentStatus = row.original.status;

        return (
          <CheckInButton 
            ticketId={ticketId}
            currentStatus={currentStatus}
            eventId={eventId}
          />
        );
      },
    },
  ];

  if (!attendees || attendees.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No attendees found for this event.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <DataTable columns={columns} data={attendees} />
    </div>
  );
};

export default AttendeeTable;
