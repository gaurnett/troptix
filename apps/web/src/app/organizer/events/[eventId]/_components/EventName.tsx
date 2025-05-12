import prisma from '@/server/prisma';

interface EventNameDisplayProps {
  eventId: string;
}

async function getEventName(eventId: string) {
  const event = await prisma.events.findUnique({
    where: {
      id: eventId,
    },
    select: {
      name: true,
    },
  });
  return event?.name || 'Manage Event';
}

export async function EventNameDisplay({ eventId }: EventNameDisplayProps) {
  try {
    const eventName = await getEventName(eventId);
    if (!eventName) {
      return (
        <h2
          className="text-xl font-semibold tracking-tight truncate"
          title="Event"
        >
          Manage Event
        </h2>
      );
    }
    return (
      <h2
        className="text-xl font-semibold tracking-tight truncate"
        title={eventName}
      >
        {eventName}
      </h2>
    );
  } catch (error) {
    console.error('Failed to fetch event name for layout:', error);
    return (
      <h2
        className="text-xl font-semibold tracking-tight truncate"
        title="Error"
      >
        Error loading name
      </h2>
    );
  }
}
