// app/orders/[orderId]/receipt/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import { CalendarDays, MapPin } from 'lucide-react';

const SkeletonReceiptTableRow = () => (
  <TableRow className="dark:border-slate-700/50">
    <TableCell className="pl-4 py-3">
      <Skeleton className="h-5 w-32 sm:w-48" />
    </TableCell>
    <TableCell className="text-center py-3">
      <Skeleton className="h-5 w-8 mx-auto" />
    </TableCell>
    <TableCell className="text-right py-3">
      <Skeleton className="h-5 w-16 ml-auto" />
    </TableCell>
    <TableCell className="text-right pr-4 py-3">
      <Skeleton className="h-5 w-20 ml-auto" />
    </TableCell>
  </TableRow>
);

export default function OrderReceiptLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 md:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-xl overflow-hidden border dark:border-slate-700">
          <CardHeader className="bg-slate-100 dark:bg-slate-800 p-6 sm:p-8 border-b dark:border-slate-700">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <Skeleton className="h-8 w-48 mb-2" />{' '}
                {/* Order Receipt Title */}
                <Skeleton className="h-4 w-56 mb-1" /> {/* Order ID */}
                <Skeleton className="h-4 w-64" /> {/* Date Placed */}
              </div>
              <div className="text-left sm:text-right mt-2 sm:mt-0">
                <Skeleton className="h-7 w-32 rounded-full" />{' '}
                {/* Status Badge */}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 space-y-8">
            {/* Event Info Section Skeleton */}
            <section>
              <Skeleton className="h-6 w-36 mb-4" />{' '}
              {/* Section Title: Event Details */}
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg border dark:border-slate-700">
                <Skeleton className="w-full sm:w-24 h-24 rounded-md flex-shrink-0" />{' '}
                {/* Event Image */}
                <div className="text-center sm:text-left w-full">
                  <Skeleton className="h-7 w-3/4 sm:w-full mb-2" />{' '}
                  {/* Event Name */}
                  <div className="space-y-1.5 mt-1">
                    <div className="flex items-center justify-center sm:justify-start">
                      <CalendarDays
                        size={14}
                        className="mr-1.5 text-gray-300 dark:text-gray-600 flex-shrink-0"
                      />
                      <Skeleton className="h-4 w-40" />{' '}
                      {/* Event Date & Time */}
                    </div>
                    <div className="flex items-center justify-center sm:justify-start">
                      <MapPin
                        size={14}
                        className="mr-1.5 text-gray-300 dark:text-gray-600 flex-shrink-0"
                      />
                      <Skeleton className="h-4 w-32" /> {/* Event Venue */}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Tickets Summary Table Skeleton */}
            <section>
              <Skeleton className="h-6 w-40 mb-4" />{' '}
              {/* Section Title: Items Purchased */}
              <div className="border dark:border-slate-700 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-100 dark:bg-slate-800/50">
                      <TableHead className="pl-4 py-3">
                        <Skeleton className="h-5 w-24" />
                      </TableHead>
                      <TableHead className="text-center py-3">
                        <Skeleton className="h-5 w-16 mx-auto" />
                      </TableHead>
                      <TableHead className="text-right py-3">
                        <Skeleton className="h-5 w-20 ml-auto" />
                      </TableHead>
                      <TableHead className="text-right pr-4 py-3">
                        <Skeleton className="h-5 w-12 ml-auto" />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <SkeletonReceiptTableRow />
                    <SkeletonReceiptTableRow />
                  </TableBody>
                  <TableFooter className="bg-slate-100 dark:bg-slate-800/50 font-semibold border-t dark:border-slate-700">
                    <TableRow className="dark:border-slate-700/50">
                      <TableCell colSpan={3} className="text-right pl-4 py-2.5">
                        <Skeleton className="h-5 w-20 ml-auto" />
                      </TableCell>
                      <TableCell className="text-right pr-4 py-2.5">
                        <Skeleton className="h-5 w-24 ml-auto" />
                      </TableCell>
                    </TableRow>
                    <TableRow className="dark:border-slate-700/50">
                      <TableCell colSpan={3} className="text-right pl-4 py-2.5">
                        <Skeleton className="h-5 w-12 ml-auto" />
                      </TableCell>
                      <TableCell className="text-right pr-4 py-2.5">
                        <Skeleton className="h-5 w-16 ml-auto" />
                      </TableCell>
                    </TableRow>
                    <TableRow className="dark:border-slate-700/50 text-lg">
                      <TableCell colSpan={3} className="text-right pl-4 py-3">
                        <Skeleton className="h-6 w-32 ml-auto" />
                      </TableCell>
                      <TableCell className="text-right pr-4 py-3 font-bold">
                        <Skeleton className="h-6 w-28 ml-auto" />
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </section>

            {/* Billing Information Skeleton */}
            <section>
              <Skeleton className="h-6 w-44 mb-4" />{' '}
              {/* Section Title: Billing Information */}
              <div className="text-sm p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg border dark:border-slate-700 space-y-2.5">
                <div className="flex">
                  <Skeleton className="h-4 w-24 mr-2 flex-shrink-0" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex">
                  <Skeleton className="h-4 w-24 mr-2 flex-shrink-0" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex">
                  <Skeleton className="h-4 w-24 mr-2 flex-shrink-0" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex">
                  <Skeleton className="h-4 w-24 mr-2 flex-shrink-0" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </section>

            {/* Actions Skeleton */}
            <section className="text-center space-y-4 pt-6 border-t dark:border-slate-700">
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                <Skeleton className="h-12 w-full sm:w-52 rounded-md" />
                <Skeleton className="h-12 w-full sm:w-52 rounded-md" />
              </div>
            </section>
          </CardContent>
          <CardFooter className="p-6 bg-slate-100 dark:bg-slate-800 border-t dark:border-slate-700 text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400 mx-auto">
              <Skeleton className="h-3 w-3/4 mx-auto" />
              <Skeleton className="h-3 w-1/2 mx-auto mt-1" />
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
