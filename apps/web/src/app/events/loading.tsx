// app/events/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';
import * as React from 'react';

const SkeletonEventCardPlaceholder = () => (
  <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <Skeleton className="w-full h-48 bg-gray-300 dark:bg-gray-700" />{' '}
      {/* Event Image Placeholder */}
      <div className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2 bg-gray-300 dark:bg-gray-700" />{' '}
        {/* Event Name Placeholder */}
        <Skeleton className="h-4 w-1/2 mb-1 bg-gray-300 dark:bg-gray-700" />{' '}
        {/* Date Placeholder */}
        <Skeleton className="h-4 w-1/3 mb-3 bg-gray-300 dark:bg-gray-700" />{' '}
        {/* Venue Placeholder */}
        <Skeleton className="h-4 w-1/4 bg-gray-300 dark:bg-gray-700" />{' '}
        {/* Price Placeholder */}
      </div>
    </div>
  </div>
);

export default function EventsPageLoading() {
  const numberOfSkeletonCards = 8;

  return (
    <div className="flex min-h-screen flex-col">
      <div className="grow mt-28 md:mt-32 w-full md:max-w-5xl mx-auto">
        <div className="">
          <div className="text-center mb-4">
            <Skeleton className="h-12 w-48 md:h-16 md:w-64 mx-auto bg-gray-300 dark:bg-gray-700" />
          </div>
          <div className="mx-auto p-4">
            <div className="flex flex-wrap -mx-2">
              {Array.from({ length: numberOfSkeletonCards }).map((_, index) => (
                <SkeletonEventCardPlaceholder key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
