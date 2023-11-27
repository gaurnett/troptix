import { Event } from "troptix-models";
import { useContext, useState } from "react";
import { TropTixContext } from "@/components/WebNavigator";
import AddEventFormPage from "@/components/pages/admin/add-event/add-event-form";

export default function AddEventPage() {
  const { user } = useContext(TropTixContext);
  const [event, setEvent] = useState<Event>(new Event(user.id));

  return (
    <div className="mx-auto justify-center w-screen">
      <h1
        className="text-center text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-8"
        data-aos="zoom-y-out"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-teal-400">
          Add Event
        </span>
      </h1>
      <AddEventFormPage event={event} setEvent={setEvent} />
    </div>
  );
}
