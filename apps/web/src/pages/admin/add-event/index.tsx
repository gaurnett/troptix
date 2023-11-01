
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import BasicInfoPage from './basic-info';
import { Event } from 'troptix-models';
import { useContext, useState } from 'react';
import DetailsPage from './details';
import TicketsPage from './tickets';
import EventCard from '@/components/EventCard';
import { TropTixContext } from '@/components/WebNavigator';
import AddEventStarterPage from './add-event-starter';

export default function AddEventPage() {

  const { user } = useContext(TropTixContext);
  const [event, setEvent] = useState<Event>(new Event(user.id));

  return (
    <div className='mx-auto justify-center w-screen'>
      <h1 className="text-center text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-8" data-aos="zoom-y-out"><span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-teal-400">Add Event</span></h1>
      <AddEventStarterPage event={event} setEvent={setEvent} />
    </div>

  );
}