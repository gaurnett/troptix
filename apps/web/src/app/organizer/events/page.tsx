// app/organizer/events/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Edit, Eye, Settings } from 'lucide-react';
import {
  getAllOrganizerEvents,
  EventCardData,
  GroupedEvents, // Import the new type
} from '../_lib/getEventsData'; // Adjust import path
import { getUserFromIdTokenCookie } from '../page';

// Helper function for formatting time (optional)
const formatEventTime = (date: Date | null): string => {
  if (!date) return '';
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

// Helper function for badge variants based on derived status
const getStatusBadgeVariant = (status: EventCardData['status']) => {
  switch (status) {
    case 'Active':
      return 'default';
    case 'Upcoming':
      return 'outline';
    case 'Past':
      return 'secondary';
    case 'Draft':
      return 'secondary';
    default:
      return 'secondary';
  }
};

// Make page component async
export default async function AllEventsListPage() {
  const user = await getUserFromIdTokenCookie();
  if (!user) {
    return <div>No user found</div>;
  }
  const organizerUserId = user.uid;

  const groupedEvents = await getAllOrganizerEvents(organizerUserId);

  // Define the order of statuses for rendering
  const statusOrder: Array<EventCardData['status']> = [
    'Active',
    'Upcoming',
    'Draft',
    'Past',
  ];

  const hasEvents = Object.values(groupedEvents).some(
    (group) => group && group.length > 0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Your Events</h1>
        <Link href="/organizer/events/new" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Event
          </Button>
        </Link>
      </div>

      {/* TODO: Add Filtering/Search controls here later */}

      {/* Events List - Grouped */}
      <div className="space-y-8">
        {' '}
        {hasEvents ? (
          statusOrder.map((status) => {
            const events = groupedEvents[status];
            if (events && events.length > 0) {
              return (
                <section
                  key={status}
                  aria-labelledby={`section-title-${status.toLowerCase()}`}
                >
                  <h2
                    id={`section-title-${status.toLowerCase()}`}
                    className="text-xl font-semibold tracking-tight text-muted-foreground mb-3"
                  >
                    {status} Events
                  </h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {events.map((event) => (
                      <Card
                        key={event.id}
                        className="overflow-hidden flex flex-col"
                      >
                        <div className="relative w-full flex-shrink-0 aspect-video">
                          <Image
                            src={
                              event.imageUrl ?? '/placeholder-flyer-default.png'
                            }
                            alt={`${event.name} Flyer`}
                            layout="fill"
                            objectFit="cover"
                            className="bg-muted"
                          />
                        </div>

                        <div className="flex flex-1 flex-col p-4 md:p-6">
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="text-xl font-semibold tracking-tight">
                                {event.name}
                              </h3>
                              <Badge
                                variant={getStatusBadgeVariant(event.status)}
                                className="flex-shrink-0"
                              >
                                {event.status}
                              </Badge>
                            </div>

                            <p className="text-sm text-muted-foreground mb-1">
                              {event.startDate.toLocaleDateString('en-US', {
                                dateStyle: 'medium',
                              })}
                              {event.startTime
                                ? ` @ ${formatEventTime(event.startTime)}`
                                : ''}
                            </p>
                            <p className="text-sm text-muted-foreground mb-3">
                              {event.venue}
                            </p>
                            <p className="text-sm mb-4 line-clamp-2 max-h-[3rem] overflow-hidden">
                              {event.description}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2 justify-end items-center mt-auto pt-4 border-t">
                            <Button variant="outline" size="sm" asChild>
                              <Link
                                href={`/events/${event.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Eye className="mr-1 h-3 w-3" /> View Public
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/organizer/events/${event.id}/edit`}>
                                <Edit className="mr-1 h-3 w-3" /> Edit
                              </Link>
                            </Button>
                            <Button size="sm" asChild>
                              <Link href={`/organizer/events/${event.id}`}>
                                <Settings className="mr-1 h-3 w-3" /> Manage
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </section>
              );
            }
            return null;
          })
        ) : (
          // Empty State
          <Card className="text-center p-10">
            <CardContent>
              <p className="text-muted-foreground">
                You haven&apos;t created any events yet.
              </p>
              <Button className="mt-4" asChild>
                <Link href="/organizer/events/new">
                  Create Your First Event
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
