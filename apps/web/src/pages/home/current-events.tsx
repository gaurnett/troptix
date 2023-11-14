import { useFetchEvents } from "@/hooks/useFetchEvents";
import EventCard from "@/components/EventCard";
import { EventType } from "@/types/Event";
import { useRouter } from "next/navigation";

export default function CurrentEvents() {

  const { events, isError, isLoading } = useFetchEvents();
  const router = useRouter();
  function openEventDetails(index: number) {
    router.push(`/events/${index}`)
  }

  return (
    <section className="relative">
      {/* Section background (needs .relative class on parent and next sibling elements) */}
      <div className="absolute inset-0 bg-gray-100 pointer-events-none" aria-hidden="true"></div>
      <div className="absolute left-0 right-0 m-auto w-px p-px h-20 bg-gray-200 transform -translate-y-1/2"></div>
      <div className="absolute left-0 right-0 bottom-0 m-auto w-px p-px h-20 bg-gray-200 transform translate-y-1/2"></div>

      <div className="relative max-w-6xl mx-4 md:mx-auto px-4 sm:px-6">
        <div className="pt-12 md:pt-20">

          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <h1 className="h2 mb-4">Explore our current events</h1>
            <p className="text-xl text-gray-600">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat.</p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
            {!isLoading
              ? events.map((event: EventType, index: number) => {
                return (
                  <div key={index} onClick={() => openEventDetails(index)}>
                    <EventCard
                      image={event.imageUrl}
                      eventName={event.name}
                      date={""}
                      location={""}
                      price={""}
                    />
                  </div>
                );
              })
              : null}
          </div>
        </div>
      </div>
    </section>
  )
}