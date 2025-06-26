import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/server/prisma'; // Use correct prisma import
import { CreateTicketTypeForm } from '../new/_components/CreateTicketTypeForm';
import { BackButton } from '@/components/ui/back-button'; // Import the new button

interface EditEventTicketPageProps {
  params: {
    eventId: string;
    ticketId: string; // Add ticketId to params
  };
}

async function getTicketTypeData(ticketId: string) {
  try {
    const ticketType = await prisma.ticketTypes.findUniqueOrThrow({
      where: {
        id: ticketId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        quantity: true,
        maxPurchasePerUser: true,
        saleStartDate: true,
        saleEndDate: true,
        ticketingFees: true,
      },
    });
    return ticketType;
  } catch (error) {
    console.error('Failed to fetch ticket type:', error);
    notFound();
  }
}

// Server component to render the edit form
export default async function EditEventTicketPage({
  params,
}: EditEventTicketPageProps) {
  const { eventId, ticketId } = params;

  const ticketData = await getTicketTypeData(ticketId);

  const initialFormData = {
    ...ticketData,
    saleStartDate: ticketData.saleStartDate,
    saleEndDate: ticketData.saleEndDate,
    description: ticketData.description ?? undefined,
  };

  const backUrl = `/organizer/events/${eventId}/tickets`;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center gap-2">
        <BackButton href={backUrl} />
        <h1 className="text-2xl font-semibold ">Edit Ticket Type</h1>
      </div>

      <p className="text-muted-foreground mb-6">
        Update the details for the &apos;{ticketData.name}&apos; ticket type.
      </p>

      <div className="w-full lg:w-1/2 xl:w-2/3">
        <CreateTicketTypeForm eventId={eventId} initialData={initialFormData} />
      </div>
    </div>
  );
}
