'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  Heart,
  Share2,
  MapPin,
  CalendarDays,
  Ticket,
  ArrowUpRightSquare,
} from 'lucide-react';

// Replicate or import the interface for type safety
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

interface EventDetailsClientProps {
  event: ProcessedEventDetails;
}

const defaultImageUrl = '/placeholder-event.jpg'; // Define fallback image URL

export default function EventDetailsClient({ event }: EventDetailsClientProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Truncation logic
  const descriptionLines = event.description
    ? event.description.split('\n')
    : [];
  const showReadMoreButton = descriptionLines.length > 3;
  const displayedDescriptionLines = isDescriptionExpanded
    ? descriptionLines
    : descriptionLines.slice(0, 3);

  // Map link generation
  const mapQuery = encodeURIComponent(
    event.address || `${event.venueName}, ${event.city}`
  );
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  return (
    <Card className="border-none md:border shadow-none md:shadow rounded-none md:rounded-lg overflow-hidden mt-0 md:mt-6">
      {/* Image Section */}
      <div className="relative w-full">
        <AspectRatio ratio={1 / 1} className="bg-muted">
          <Image
            src={event.imageUrl || defaultImageUrl}
            alt={`${event.title} event image`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 896px"
          />
        </AspectRatio>
        {/* Overlay Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full h-9 w-9 border-none bg-background/60 text-foreground backdrop-blur-sm hover:bg-background/80"
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full h-9 w-9 border-none bg-background/60 text-foreground backdrop-blur-sm hover:bg-background/80"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Details Section */}
      <CardContent className="p-4 md:p-6 bg-card">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
        {event.venueName && (
          <p className="text-lg font-semibold text-foreground mb-1">
            {event.venueName}
          </p>
        )}
        <div className="flex items-center text-muted-foreground text-sm mb-4">
          <CalendarDays className="h-4 w-4 mr-1.5" />
          <span>
            {event.dateFormatted}
            {event.timeFormatted ? `, ${event.timeFormatted}` : ''}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-5">
          {event.city && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1.5" />
              <span>{event.city}</span>
            </div>
          )}
          {/* You could add other tags here */}
        </div>

        <Separator className="my-5" />

        {/* Code Section */}
        <div className="mb-5">
          <p className="text-sm font-medium flex items-center">
            <Ticket className="h-4 w-4 mr-2 text-muted-foreground" />
            Got a code?
          </p>
        </div>

        {/* About Section */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">About</h2>
          <div className="text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
            {displayedDescriptionLines.map((line, index) => (
              <p key={index}>{line || <>&nbsp;</>}</p> // Handle empty lines
            ))}
          </div>
          {showReadMoreButton && (
            <Button
              variant="link"
              className="p-0 h-auto text-sm mt-1"
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            >
              {isDescriptionExpanded ? 'Show Less' : 'Read More'}
            </Button>
          )}
        </div>

        {/* Location Section */}
        {(event.venueName || event.address) && (
          <>
            <Separator className="my-5" />
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Location</h2>
              <div className="flex items-start justify-between gap-4">
                <div className="text-sm text-muted-foreground">
                  {event.venueName && (
                    <p className="font-medium text-foreground">
                      {event.venueName}
                    </p>
                  )}
                  {event.address && <p>{event.address}</p>}
                </div>
                {event.address && (
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ArrowUpRightSquare className="h-4 w-4 mr-1.5" />
                      Open in Maps
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
