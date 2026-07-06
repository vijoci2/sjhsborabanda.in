import Link from "next/link";

type CardProps = {
  title: string;
  description: string;
  href?: string;
  symbol?: string;
};

export function Card({ title, description, href, symbol }: CardProps) {
  const content = (
    <div className="group h-full rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-lift">
      {symbol ? (
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-navy text-sm font-bold tracking-wide text-gold">
          {symbol}
        </div>
      ) : null}
      <h3 className="text-xl font-semibold text-navy transition group-hover:text-navy-dark">
        {title}
      </h3>
      <p className="mt-3 leading-7 text-slate-600">{description}</p>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="focus-ring block h-full rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
