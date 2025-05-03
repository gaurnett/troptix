import Image from 'next/image';
import Link from 'next/link';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation'; // Import notFound

// Import prisma client (adjust path if needed)
import prisma from '@/server/prisma';
// Import Prisma types only if needed for explicit typing, often inferred
// import { Events, TicketTypes } from '@prisma/client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';

import {
  Heart,
  Share2,
  MapPin,
  CalendarDays,
  // Music, // Category 'DJ' not directly in schema, omitting for now
  Search,
  Menu,
  Ticket,
  ArrowUpRightSquare, // <-- Import icon for map link
} from 'lucide-react';

// Import the new client component
import EventDetailsClient from './_components/EventDetailsClient';

// --- Interface for Processed Event Data (Keep for getData return type) ---
interface ProcessedEventDetails {
  id: string;
  title: string;
  venueName: string | null;
  address: string | null;
  city: string | null;
  dateFormatted: string;
  timeFormatted: string | null;
  imageUrl: string | null;
  description: string;
  priceFrom: number | null;
}

// --- Data Fetching using Prisma (Remains the same) ---
async function getData(eventId: string): Promise<ProcessedEventDetails> {
  try {
    const event = await prisma.events.findUniqueOrThrow({
      where: { id: eventId, isDraft: false },
      include: {
        ticketTypes: {
          where: {
            saleStartDate: { lte: new Date() },
            saleEndDate: { gte: new Date() },
            quantity: { gt: prisma.ticketTypes.fields.quantitySold },
          },
          select: {
            price: true,
          },
          orderBy: {
            price: 'asc',
          },
        },
      },
    });

    // --- Process Data (Remains the same) ---

    // 1. Format Date & Time
    const startDate = event.startDate; // This is a DateTime object
    const startTime = event.startTime; // This is also a DateTime object (or null)

    // Example using Intl.DateTimeFormat (flexible and built-in)
    const dateFormatted = new Intl.DateTimeFormat('en-US', {
      weekday: 'short', // Fri
      day: 'numeric', // 10
      month: 'short', // Oct
      // year: 'numeric' // Optional: Add year if needed e.g. , 2025
    }).format(startDate);

    let timeFormatted: string | null = null;
    if (startTime) {
      timeFormatted = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric', // 10
        minute: '2-digit', // 00
        hour12: true, // pm
      }).format(startTime);
    } else {
      // Handle cases where only startDate exists (e.g., all-day event)
      // You might want a default time or different display logic
      timeFormatted = 'All Day'; // Example fallback
    }

    // 2. Determine Lowest Price
    let minPrice: number | null = null;
    if (event.ticketTypes && event.ticketTypes.length > 0) {
      // Prices should already be sorted by the query, but min ensures safety
      const prices = event.ticketTypes
        .map((tt) => tt.price)
        .filter((p) => p != null) as number[];
      if (prices.length > 0) {
        minPrice = Math.min(...prices);
      }
    }

    // 3. Extract City (use full address now)
    let city: string | null = null;
    if (event.address) {
      const addressParts = event.address.split(',');
      // Refined city extraction (still potentially fragile, recommend dedicated field)
      if (addressParts.length >= 3) {
        // "Street, City, State Zip"
        city = addressParts[1]?.trim() || null;
      } else if (addressParts.length === 2) {
        // "City, Country" or "Street, City"
        // Heuristic: Check if the second part looks like a state/zip or country
        const secondPart = addressParts[1]?.trim();
        if (secondPart && !/\d/.test(secondPart) && secondPart.length > 3) {
          // Likely City if not numeric and longer than typical state code
          city = secondPart;
        } else {
          // Assume first part is city if second is short/numeric
          city = addressParts[0]?.trim() || null;
        }
      } else if (addressParts.length === 1) {
        // Only one part, might be city?
        city = addressParts[0]?.trim();
      }
    }
    // Fallback to country if city couldn't be parsed
    if (!city && event.country) {
      city = event.country;
    }

    // 4. Map to Component Props Interface
    const processedData: ProcessedEventDetails = {
      id: event.id,
      title: event.name,
      venueName: event.venue,
      address: event.address,
      city: city,
      dateFormatted: dateFormatted,
      timeFormatted: timeFormatted,
      imageUrl: event.imageUrl,
      description: event.description,
      priceFrom: minPrice,
    };

    return processedData;
  } catch (error) {
    console.error(`Failed to fetch event ${eventId}:`, error);
    notFound();
  }
}

// --- Metadata Generation (Remains the same) ---
type Props = {
  params: { eventId: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const event = await getData(params.eventId); // Fetch processed data

  const title = `${event.title} at ${event.venueName || 'Venue TBC'}`;
  const description = `Tickets for ${event.title} on ${event.dateFormatted}${event.priceFrom ? `. Starting from $${event.priceFrom}` : '.'}`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: event.imageUrl ? [event.imageUrl] : [],
    },
  };
}

// --- Page Component (Now a Server Component again) ---
export default async function EventPage({ params }: Props) {
  // Fetch data on the server
  const event = await getData(params.eventId);

  // Format the price (handle null case) - still needed for Footer CTA
  const formattedPrice =
    event.priceFrom !== null
      ? new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(event.priceFrom)
      : 'N/A';

  return (
    <div className="min-h-screen bg-background text-foreground pb-[90px] md:pb-6">
      {/* Centered content area */}
      <div className="max-w-3xl mx-auto">
        {/* Render the client component with fetched data */}
        <EventDetailsClient event={event} />
      </div>

      {/* --- Footer CTA (Remains in Server Component) --- */}
      {event.priceFrom !== null && (
        <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-3 border-t border-gray-700 md:static md:border-none md:bg-transparent md:text-foreground md:max-w-3xl md:mx-auto md:mt-6 md:p-0 z-40">
          <div className="flex items-center justify-between gap-4 max-w-3xl mx-auto">
            <div>
              <p className="text-lg font-semibold leading-tight">
                From {formattedPrice}
              </p>
              <p className="text-xs text-gray-400 md:text-muted-foreground">
                The price you&apos;ll pay. No surprises later.
              </p>
            </div>
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-200 md:bg-primary md:text-primary-foreground md:hover:bg-primary/90 flex-shrink-0 px-8"
            >
              BUY NOW
            </Button>
          </div>
        </div>
      )}
      {/* Optional: Show something else if priceFrom is null */}
    </div>
  );
}
