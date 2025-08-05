import { Skeleton } from "@/components/ui/skeleton";

export function CheckoutFormSkeleton() {
  return (
    <div className="md:px-4">
      {/* Contact Information Section */}
      <div className="mb-6">
        <Skeleton className="h-6 w-40 mb-4" />
        
        {/* First and Last Name Row */}
        <div className="flex justify-between gap-4 mb-4">
          <div className="w-full">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="w-full">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* Email and Confirm Email Row */}
        <div className="md:flex justify-between gap-4">
          <div className="w-full mb-4 md:mb-0">
            <Skeleton className="h-4 w-12 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="w-full">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>

      {/* Tickets Section */}
      <div className="mb-6">
        <Skeleton className="h-6 w-16 mb-4" />
        
        {/* Promo Code Section */}
        <div className="mb-4">
          <Skeleton className="h-4 w-28 mb-2" />
          <div className="flex w-full gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-16" />
          </div>
        </div>

        {/* Ticket Items */}
        {[1, 2].map((index) => (
          <div key={index} className="mb-4 p-4 border border-gray-300 rounded-lg">
            <div className="flex justify-between items-center h-14">
              <div className="flex-1">
                <Skeleton className="h-5 w-32 mb-1" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
            
            <div className="border-t border-gray-300 mt-2 pt-2">
              <div className="flex items-baseline gap-2 mb-1">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-40 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PaymentFormSkeleton() {
  return (
    <div className="h-full w-full md:max-w-2xl mx-auto mb-6 p-4">
      {/* Payment Method Section */}
      <div className="mb-6">
        <Skeleton className="h-6 w-32 mb-4" />
        
        {/* Card Number */}
        <div className="mb-4">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-12 w-full rounded-md" />
        </div>

        {/* Expiry and CVC Row */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
          <div className="flex-1">
            <Skeleton className="h-4 w-12 mb-2" />
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        </div>

        {/* Billing Address */}
        <div className="mb-4">
          <Skeleton className="h-4 w-28 mb-2" />
          <Skeleton className="h-12 w-full rounded-md mb-4" />
          
          <div className="flex gap-4">
            <div className="flex-1">
              <Skeleton className="h-4 w-12 mb-2" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
            <div className="flex-1">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
            <div className="w-24">
              <Skeleton className="h-4 w-8 mb-2" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <Skeleton className="h-12 w-full rounded-md mt-6" />
      </div>
    </div>
  );
}