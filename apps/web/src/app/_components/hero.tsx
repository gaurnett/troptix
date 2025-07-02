'use client';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useFeatureFlagEnabled } from 'posthog-js/react';

export default function LandingHero() {
  return (
    <section className="relative bg-background">
      <div
        className="absolute left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none -z-1"
        aria-hidden="true"
      >
        <svg
          width="1360"
          height="578"
          viewBox="0 0 1360 578"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              x1="50%"
              y1="0%"
              x2="50%"
              y2="100%"
              id="illustration-01"
            >
              <stop stopColor="hsl(var(--muted))" offset="0%" />
              <stop stopColor="hsl(var(--muted) / 0.8)" offset="77.402%" />
              <stop stopColor="hsl(var(--muted) / 0.6)" offset="100%" />
            </linearGradient>
          </defs>
          <g fill="url(#illustration-01)" fillRule="evenodd">
            <circle cx="1232" cy="128" r="128" />
            <circle cx="155" cy="443" r="64" />
          </g>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Hero content */}
        <div className="pt-32 pb-12 md:pt-40 md:pb-12">
          {/* Section header */}
          <div className="text-center pb-12 md:pb-16">
            <div className="mx-auto w-fit mb-8">
              <Alert
                variant="default"
                className="p-3 border-primary/20 bg-primary/5 text-primary"
              >
                TropTix is now in Beta Testing!
              </Alert>
            </div>
            <h1
              className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4 text-foreground"
              data-aos="zoom-y-out"
            >
              Unforgettable{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-chart-2 inline-block pr-1">
                experiences
              </span>{' '}
              start here.
            </h1>
            <div className="max-w-3xl mx-auto">
              <p
                className="text-xl text-muted-foreground mb-8"
                data-aos="zoom-y-out"
                data-aos-delay="150"
              >
                Discover events, buy tickets instantly, or create your own. Make
                every moment memorable with TropTix.
              </p>

              <CTAButtons />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTAButtons() {
  const showCreateEvent = useFeatureFlagEnabled('show-create-event-button');

  return (
    <div
      className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center sm:gap-4"
      data-aos="zoom-y-out"
      data-aos-delay="300"
    >
      <Button size="lg" asChild className="w-full sm:w-auto">
        <Link href="/events">Explore Events</Link>
      </Button>

      {showCreateEvent && (
        <Button
          size="lg"
          variant="outline"
          asChild
          className="w-full sm:w-auto mt-3 sm:mt-0"
        >
          <Link href="/organizer/events/new">Create Your First Event</Link>
        </Button>
      )}
    </div>
  );
}
