import React from "react";
interface TicketTypeProps {
  ticketName: string;
  price: string;
  description: string;
  onAdd: () => void;
}
export function TicketDetail({
  ticketName,
  price,
  description,
  onAdd,
}: TicketTypeProps) {
  return (
    <div className="flex items-start p-4 border rounded-lg">
      <div className="flex-1">
        <div className="flex justify-between items-baseline">
          <h3 className="text-xl font-bold">{ticketName}</h3>
          <p className="text-lg font-semibold">{price}</p>
        </div>
        <p className="mt-2">{description}</p>
      </div>
      <button
        className="ml-4 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={onAdd}
      >
        Add
      </button>
    </div>
  );
}
