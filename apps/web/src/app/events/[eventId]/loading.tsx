// app/events/[eventId]/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, DollarSign, MapPin } from 'lucide-react'; // Keep TicketIcon if used in ButtonWithIcon skeleton
import * as React from 'react';

export default function EventDetailPageLoading() {
  return (
    <>
      {/* We won't replicate the dynamic background image or backdrop-blur in the skeleton,
          focusing on the content structure. The parent page defines min-h-screen. */}
      <div className="w-full md:min-h-screen flex">
        {' '}
        {/* Removed backdrop-blur for skeleton */}
        <div className={`max-w-5xl mx-auto p-4 sm:p-8 w-full`}>
          {' '}
          {/* Ensure w-full for content spread */}
          <div className="md:flex mt-32">
            {/* Aside (Left Sidebar) Skeleton */}
            <aside className="md:sticky md:top-0 mb-8 md:mb-0 md:w-[350px] flex-shrink-0">
              {' '}
              {/* Explicit width for skeleton consistency */}
              <Skeleton className="h-[350px] w-[350px] max-h-[350px] max-w-[350px] rounded-lg mx-auto mb-8 bg-slate-200 dark:bg-slate-700" />
              <Skeleton className="h-[56px] w-full rounded-md bg-slate-200 dark:bg-slate-700" />{' '}
              {/* Buy Tickets Button Placeholder */}
            </aside>

            {/* Main Content Area (Right) Skeleton */}
            <div className="w-full md:mx-8 md:p-6 p-4 bg-slate-700 bg-opacity-80 rounded-lg ">
              {' '}
              {/* Using a slightly darker placeholder for the themed background */}
              {/* Event Name */}
              <Skeleton className="h-10 w-3/4 sm:w-2/3 mb-6 bg-slate-300 dark:bg-slate-600" />
              {/* Info Blocks Skeleton */}
              <div className="mb-4 space-y-3">
                {/* Date Info */}
                <div className="flex items-center mb-2">
                  <div className="mr-4">
                    <Skeleton className="h-10 w-10 rounded border border-slate-400 dark:border-slate-500 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                    </Skeleton>
                  </div>
                  <div>
                    <Skeleton className="h-5 w-48 mb-1 bg-slate-300 dark:bg-slate-600" />{' '}
                    {/* Date Range */}
                    <Skeleton className="h-4 w-32 bg-slate-300 dark:bg-slate-600" />{' '}
                    {/* Time Range */}
                  </div>
                </div>
                {/* Venue Info */}
                <div className="flex items-center mb-2">
                  <div className="mr-4">
                    <Skeleton className="h-10 w-10 rounded border border-slate-400 dark:border-slate-500 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                    </Skeleton>
                  </div>
                  <div>
                    <Skeleton className="h-5 w-52 mb-1 bg-slate-300 dark:bg-slate-600" />{' '}
                    {/* Venue Name */}
                    <Skeleton className="h-4 w-64 bg-slate-300 dark:bg-slate-600" />{' '}
                    {/* Address */}
                  </div>
                </div>
                {/* Price Info */}
                <div className="flex items-center mb-2">
                  <div className="mr-4">
                    <Skeleton className="h-10 w-10 rounded border border-slate-400 dark:border-slate-500 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                    </Skeleton>
                  </div>
                  <div>
                    <Skeleton className="h-5 w-24 mb-1 bg-slate-300 dark:bg-slate-600" />{' '}
                    {/* "Tickets" Title */}
                    <Skeleton className="h-4 w-36 bg-slate-300 dark:bg-slate-600" />{' '}
                    {/* Price Display */}
                  </div>
                </div>
              </div>
              {/* Organizer Name Skeleton */}
              <Skeleton className="h-6 w-40 mb-6 bg-slate-300 dark:bg-slate-600" />
              {/* About Section Skeleton */}
              <div className="mb-8">
                {/* DividerWithText Placeholder */}
                <div className="flex items-center my-4">
                  <Skeleton className="h-px flex-grow bg-slate-400 dark:bg-slate-500" />
                  <Skeleton className="h-5 w-16 mx-4 bg-slate-300 dark:bg-slate-600" />{' '}
                  {/* "About" Text */}
                  <Skeleton className="h-px flex-grow bg-slate-400 dark:bg-slate-500" />
                </div>
                {/* Description Paragraphs */}
                <Skeleton className="h-4 w-full mt-2 bg-slate-300 dark:bg-slate-600" />
                <Skeleton className="h-4 w-full mt-2 bg-slate-300 dark:bg-slate-600" />
                <Skeleton className="h-4 w-5/6 mt-2 bg-slate-300 dark:bg-slate-600" />
                <Skeleton className="h-4 w-3/4 mt-2 mb-2 bg-slate-300 dark:bg-slate-600" />
                {/* "See more details" Button Placeholder */}
                <Skeleton className="h-5 w-28 mt-1 bg-blue-400 opacity-70 rounded" />
              </div>
              {/* Venue Section (Map) Skeleton */}
              <div>
                {/* DividerWithText Placeholder */}
                <div className="flex items-center my-4">
                  <Skeleton className="h-px flex-grow bg-slate-400 dark:bg-slate-500" />
                  <Skeleton className="h-5 w-16 mx-4 bg-slate-300 dark:bg-slate-600" />{' '}
                  {/* "Venue" Text */}
                  <Skeleton className="h-px flex-grow bg-slate-400 dark:bg-slate-500" />
                </div>
                <Skeleton className="h-5 w-48 mb-1 bg-slate-300 dark:bg-slate-600" />{' '}
                {/* Venue Name */}
                <Skeleton className="h-4 w-56 mb-3 bg-slate-300 dark:bg-slate-600" />{' '}
                {/* Address */}
                <Skeleton className="mt-4 w-full h-60 rounded-md bg-slate-300 dark:bg-slate-600" />{' '}
                {/* Map Placeholder */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
