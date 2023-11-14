import { Image } from "antd";
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
  console.log(image);
  return (
    <div className=" rounded-md flex flex-col overflow-hidden shadow-lg hover:shadow-xl ">
      <div>
        <Image
          preview={false}
          width={"100%"}
          height={"100%"}
          className="w-auto h-72"
          style={{ objectFit: 'cover' }}
          src={image}
          alt={eventName} />
      </div>
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
