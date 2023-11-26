import { Typography } from "antd";
import Image from "next/image";
import React from "react";
const { Paragraph } = Typography;

function getFormattedCurrency(price) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return formatter.format(price);
}

export default function EventCard({ event }) {
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

  return (
    <div className="">
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
          height: 300
        }}>
        <div className="py-2 px-4 bg-white bg-opacity-90 absolute inset-x-0 bottom-0">
          <div className="font-bold text-xl">{event.name}</div>
          <p className="text-blue-500 text-base">
            {new Date(event.startDate).toDateString()}
          </p>
          <p className="text-green-700 text-base">
            {priceString}
          </p>
          <p style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }} className="text-gray-700 text-base text-ellipsis">
            {event.address}
          </p>
        </div>
      </div>
    </div>

  );
};
