import Image from "next/image";
import { Inter } from "next/font/google";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { useFetchEvents } from "@/hooks/useFetchEvents";
import EventCard from "@/components/EventCard";
import { EventType } from "@/types/Event";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { events, isError, isLoading } = useFetchEvents();
  console.log(events);
  return (
    <main className="">
      <div>
        <h1 className="text-3xl font-bold my-14">
          Troptix is a better way to{" "}
          <span className="text-red-100">get tickets</span>
        </h1>
        {/* <Button variant={"secondary"}>Explore Events</Button> */}
      </div>
      <section>
        {/* Section to render a grid of card components of events */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {!isLoading
            ? events.map((event: EventType, index: number) => {
                return (
                  <Link href={`/events/${index}`}>
                    <EventCard
                      image={event.imageUrl}
                      eventName={event.name}
                      date={""}
                      location={""}
                      price={""}
                    />
                  </Link>
                );
              })
            : null}
        </div>
      </section>
    </main>
  );
}
