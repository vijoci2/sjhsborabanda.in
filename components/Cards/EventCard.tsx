type EventCardProps = {
  date: string;
  title: string;
  description: string;
};

export function EventCard({ date, title, description }: EventCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="mb-5 inline-flex rounded-lg bg-gold/15 px-4 py-3 text-sm font-bold text-navy">
        {date}
      </div>
      <h3 className="text-xl font-semibold text-navy">{title}</h3>
      <p className="mt-3 leading-7 text-slate-600">{description}</p>
    </article>
  );
}
