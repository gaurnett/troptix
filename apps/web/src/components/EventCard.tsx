import { getFormattedCurrency } from "@/lib/utils";
import { Divider } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function EventCard({ event, showDivider = false }) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768
  );

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }

    if (typeof window !== 'undefined') {
      handleResize();
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  let lowest = Number.MAX_VALUE;
  let priceString = "";
  if (!event.ticketTypes || event.ticketTypes.length === 0) {
    priceString = "No tickets available";
  } else {
    event.ticketTypes.forEach((ticket) => {
      const price = ticket.price;
      if (price < lowest) {
        lowest = price;
      }
    });

    priceString = "From " + getFormattedCurrency(lowest);
  }

  function renderMobileCard() {
    return (
      <div>
        <div className="flex">
          <div>
            <Image
              width={110}
              height={110}
              className="w-auto rounded"
              style={{ objectFit: "cover" }}
              src={
                event.imageUrl !== null
                  ? event.imageUrl
                  : "https://placehold.co/400x400?text=Add+Event+Flyer"
              }
              alt={"event flyer image"}
            />
          </div>
          <div className="ml-4 my-auto">
            <div className="font-bold text-xl">{event.name}</div>
            <div className="text-blue-500 text-base">{new Date(event.startDate).toDateString()}</div>
            <div className="text-green-700 text-base">{priceString}</div>
            <div className="text-base">{event.venue}</div>
          </div>
        </div>

        {
          showDivider &&
          <Divider dashed className="m-0 mt-2" />
        }
      </div>
    )
  }

  function renderDesktopCard() {
    return (
      <div
        className="relative rounded-md"
        style={{
          backgroundImage: `url("${event.imageUrl ??
            "https://placehold.co/400x400?text=Add+Event+Flyer"
            }")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          WebkitBackgroundSize: "cover",
          backgroundPosition: "center",
          height: 300,
        }}>
        <div className="py-2 px-4 bg-white bg-opacity-90 absolute inset-x-0 bottom-0">
          <div className="font-bold text-base">{event.name}</div>
          <p className="text-blue-500 text-sm">
            {new Date(event.startDate).toDateString()}
          </p>
          <p className="text-green-700 text-sm">
            {priceString}
          </p>
          <p style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }} className="text-gray-700 text-sm text-ellipsis">
            {event.venue}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="cursor-pointer">
      {
        isMobile ? renderMobileCard() : renderDesktopCard()
      }
    </div>

  );
};
