export function getPrismaUpdateEventQuery(event) {
  return {
    address: event.address,
    description: event.description,
    endDate: event.endDate,
    endTime: event.endTime,
    id: event.id,
    imageUrl: event.imageUrl,
    name: event.name,
    organizer: event.organizer,
    startDate: event.startDate,
    startTime: event.startTime,
  };
}