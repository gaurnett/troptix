import { TropTixContext } from '@/components/AuthProvider';
import AddEventFormPage from '@/components/pages/admin/add-event/add-event-form';
import { useContext, useState } from 'react';
import { Event } from 'troptix-models';

import { requireAuth } from '@/server/lib/auth';

export const getServerSideProps = (ctx) =>
  requireAuth(ctx, { organizerOnly: true });

export default function AddEventPage() {
  const { user } = useContext(TropTixContext);
  const [event, setEvent] = useState<Event>(new Event(user.id));

  return (
    <div>
      <AddEventFormPage event={event} setEvent={setEvent} />
    </div>
  );
}
