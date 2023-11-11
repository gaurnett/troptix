import { useFetchEvents } from "@/hooks/useFetchEvents";
import EventCard from "@/components/EventCard";
import { EventType } from "@/types/Event";
import { useRouter } from "next/navigation";
import { Collapse, Divider } from "antd";

export default function AboutFeatures() {

  return (
    <section className="relative pb-16">
      {/* Section background (needs .relative class on parent and next sibling elements) */}
      <div className="absolute inset-0 bg-gray-100 pointer-events-none" aria-hidden="true"></div>
      <div className="absolute left-0 right-0 m-auto w-px p-px h-20 bg-gray-200 transform -translate-y-1/2"></div>
      <div className="absolute left-0 right-0 bottom-0 m-auto w-px p-px h-20 bg-gray-200 transform translate-y-1/2"></div>

      <div className="relative max-w-6xl md:mx-auto px-4 sm:px-6">
        <div className="pt-12 md:pt-20">

          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <h1 className="h2 mb-4">Explore our current features</h1>
            <p className="text-xl text-gray-600">TropTix provides a wide range of services and features to fit your needs.</p>
          </div>

          <Divider orientation="left">Event Creation and Management</Divider>
          <Collapse
            items={[{
              key: '1',
              label: 'See event creation and management features',
              children:
                <ol>
                  <li>
                    <b>Create Events:</b> From intimate meetups to grand conferences, our platform will be flexible and able to scale.
                  </li>
                  <li>
                    <b>Sell Tickets Online:</b> Whether directly through our platform or embedded on an organizer’s website, ticket sales are seamless.
                  </li>
                  <li>
                    <b>Ticket Customization:</b> Create tickets of different types, such as early bird, general, or vip.
                  </li>
                  <li>
                    <b>Promote Events:</b> Harness the power of social media, email marketing, and other channels to spread the word
                  </li>
                </ol>
            }]}
          />
          <Divider orientation="left">Registrations and Attendee Management</Divider>
          <Collapse
            items={[{
              key: '1',
              label: 'See registration and attendee features',
              children:
                <ol>
                  <li>
                    <b>Track Registrations:</b> Stay updated with real-time registration data.
                  </li>
                  <li>
                    <b>Manage Attendee Lists:</b> Oversee waitlists, send timely reminders, and ensure every attendee is catered to.
                  </li>
                </ol>
            }]}
          />
          <Divider orientation="left">Payment and Revenue:</Divider>
          <Collapse
            items={[{
              key: '1',
              label: 'See payout and revenue features',
              children:
                <ol>
                  <li>
                    <b>Diverse Payment Gateways:</b>  Accept payments via credit cards, PayPal, and more. Focusing on Caribbean payment methods.
                  </li>
                  <li>
                    <b>Transparent Reporting:</b> Generate insightful reports on ticket sales, revenue, and other crucial metrics.
                  </li>
                </ol>
            }]}
          />

        </div>
      </div>
    </section>
  )
}