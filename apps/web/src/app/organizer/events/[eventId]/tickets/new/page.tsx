import React from 'react';
import { CreateTicketTypeForm } from './_components/CreateTicketTypeForm';
import { BackButton } from '@/components/ui/back-button';

interface CreateEventTicketPageProps {
  params: {
    eventId: string;
  };
}

export default function CreateEventTicketPage({
  params,
}: CreateEventTicketPageProps) {
  const { eventId } = params;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center gap-2">
        <BackButton />
        <h1 className="text-2xl font-semibold">Create Ticket Type</h1>
      </div>
      <p className="text-muted-foreground mb-6">
        Define the details for a new ticket type for your event.
      </p>

      <div className="w-full lg:w-1/2 xl:w-2/3">
        <CreateTicketTypeForm eventId={eventId} />
      </div>
    </div>
  );
}
