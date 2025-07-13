// app/organizer/events/new/page.tsx

import EventForm from '../_components/EventForm';
import { BackButton } from '@/components/ui/back-button';
import { getUserFromIdTokenCookie } from '@/server/authUser';
import prisma from '@/server/prisma';
import { redirect } from 'next/navigation';

export default async function CreateEventPage() {
  const user = await getUserFromIdTokenCookie();
  if (!user) {
    redirect('/auth/login');
  }
  const userRole = await prisma.users.findUnique({
    where: {
      id: user.uid,
    },
    select: {
      role: true,
    },
  });
  const paidEventsEnabled = userRole?.role === 'ORGANIZER';

  return (
    <div className="py-8">
      <div className="mb-6 flex items-center gap-2">
        <BackButton />
        <h1 className="text-2xl font-semibold">Create Event</h1>
      </div>
      <p className="text-muted-foreground mb-6">
        Define the details for a new event.
      </p>
      <EventForm initialData={null} paidEventsEnabled={paidEventsEnabled} />
    </div>
  );
}
