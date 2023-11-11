import Image from "next/image";
import React from "react";

type EventCardProps = {
  image: string;
  eventName: string;
  date: string;
  location: string;
  price: string | number;
};

const EventCard: React.FC<EventCardProps> = ({
  image,
  eventName,
  date,
  location,
  price,
}) => {
  return (
    <div className=" rounded-md flex flex-col items-center  overflow-hidden shadow-lg hover:shadow-xl ">
      <Image width={150} height={150} className="w-full" src={image} alt={eventName} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{eventName}</div>
        <p className="text-gray-700 text-base">
          <strong>Date:</strong> {date}
        </p>
        <p className="text-gray-700 text-base">
          <strong>Location:</strong> {location}
        </p>
        <p className="text-gray-700 text-base">
          <strong>Price:</strong> ${price}
        </p>
      </div>
    </div>
  );
};

export default EventCard;
