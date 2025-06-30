// app/organizer/events/new/page.tsx

'use client';

import React from 'react';

import EventForm from '../_components/EventForm';
import { BackButton } from '@/components/ui/back-button';

export default function CreateEventPage() {
  return (
    <div className="py-8">
      <div className="mb-6 flex items-center gap-2">
        <BackButton />
        <h1 className="text-2xl font-semibold">Create Event</h1>
      </div>
      <p className="text-muted-foreground mb-6">
        Define the details for a new event.
      </p>
      <EventForm initialData={null} />
    </div>
  );
}
