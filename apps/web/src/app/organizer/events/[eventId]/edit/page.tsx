import { BackButton } from '@/components/ui/back-button';
import prisma from '@/server/prisma';
import EventForm from '../../_components/EventForm';
import { notFound } from 'next/navigation';

interface EditEventPageProps {
  params: {
    eventId: string;
  };
}

async function getEvent(eventId: string) {
  try {
    const event = await prisma.events.findUnique({
      where: { id: eventId },
    });
    return event;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { eventId } = params;
  const event = await getEvent(eventId);

  if (!event) {
    notFound();
  }

  const initialData = {
    ...event,
    eventName: event?.name,
    startDate: event?.startDate,
    endDate: event?.endDate,
    venue: event?.venue ?? '',
    address: event?.address ?? '',
    country: event?.country ?? '',
    countryCode: event?.countryCode ?? '',
    latitude: event?.latitude ?? 0,
    longitude: event?.longitude ?? 0,
    imageUrl: event?.imageUrl ?? '',
    description: event?.description ?? '',
    organizer: event?.organizer ?? '',
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center gap-2">
        <BackButton />
        <h1 className="text-2xl font-semibold">Edit Event</h1>
      </div>
      <p className="text-muted-foreground mb-6">
        Update the details for the &apos;{event?.name}&apos; event.
      </p>
      <EventForm initialData={initialData} eventId={eventId} />
    </div>
  );
}
