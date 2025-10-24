import EventsCard from "./EventsCard";

export default function EventsList({ events, today }) {
  if (!events?.length)
    return <p className="text-center text-gray-400">No events found.</p>;

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 space-y-10 pb-16">
      {events.map((event) => {
        const isPast = new Date(event.date) < today;
        return <EventsCard key={event.id} event={event} isPast={isPast} />;
      })}
    </section>
  );
}
