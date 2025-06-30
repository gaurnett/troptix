import React from 'react';
import { CreateTicketTypeForm } from './_components/CreateTicketTypeForm';
import { BackButton } from '@/components/ui/back-button';
import { getUserFromIdTokenCookie } from '@/server/authUser';
import { redirect } from 'next/navigation';
import { verifyEventAccess } from '@/server/accessControl';

interface CreateEventTicketPageProps {
  params: {
    eventId: string;
  };
}

export default async function CreateEventTicketPage({
  params,
}: CreateEventTicketPageProps) {
  const { eventId } = params;

  // Get user and verify authentication
  const user = await getUserFromIdTokenCookie();
  if (!user) {
    redirect('/auth/signin');
  }

  // Verify access to this event
  await verifyEventAccess(user.uid, user.email, eventId);

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
