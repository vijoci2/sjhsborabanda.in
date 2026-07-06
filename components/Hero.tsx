import Link from "next/link";
import { homeCopy, school } from "@/lib/data";
import { SmartImage } from "@/components/UI/SmartImage";

export function Hero() {
  return (
    <section className="relative isolate min-h-[680px] overflow-hidden bg-navy-dark text-white">
      <SmartImage
        src="/images/campus.jpg"
        alt="St. Joseph's High School campus"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        fallbackLabel="Campus"
        priority
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-dark via-navy-dark/78 to-navy/20" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-navy-dark to-transparent" />

      <div className="site-container grid min-h-[680px] items-center gap-12 py-24 lg:grid-cols-[1.05fr_0.75fr]">
        <div className="max-w-3xl">
          <h1 className="text-balance text-5xl font-bold tracking-tight md:text-7xl">
            {homeCopy.mainHeading}
          </h1>
          <p className="mt-4 text-xl font-semibold text-gold md:text-2xl">
            {school.location}
          </p>
          <p className="mt-7 max-w-2xl text-pretty text-2xl font-medium leading-snug text-white/92 md:text-4xl">
            {school.tagline}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/admissions"
              className="focus-ring rounded-md bg-gold px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.12em] text-navy-dark shadow-soft transition hover:-translate-y-0.5 hover:bg-white"
            >
              Admissions Open
            </Link>
            <Link
              href="/contact"
              className="focus-ring rounded-md border border-white/35 px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-navy"
            >
              Schedule a Campus Visit / Contact Administration
            </Link>
          </div>
        </div>
        <div className="hidden justify-self-end lg:block">
          <div className="overflow-hidden rounded-lg border border-white/20 bg-white/10 p-2 shadow-2xl backdrop-blur-sm">
            <SmartImage
              src="/images/campus-right.jpg"
              alt="St. Joseph's High School building front view"
              className="aspect-[4/5] w-[360px] rounded-md object-cover object-center xl:w-[420px]"
              fallbackLabel="School Building"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
