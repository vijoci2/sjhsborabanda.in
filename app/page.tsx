import Link from "next/link";
import { Card } from "@/components/Cards/Card";
import { EventCard } from "@/components/Cards/EventCard";
import { Hero } from "@/components/Hero";
import { SectionTitle } from "@/components/UI/SectionTitle";
import { SmartImage } from "@/components/UI/SmartImage";
import {
  aboutCards,
  academicLevels,
  alumniStories,
  chooseItems,
  events,
  galleryItems,
  homeCopy,
  leadershipTeam,
  newsItems,
  school,
  stats
} from "@/lib/data";

export default function Home() {
  return (
    <>
      <Hero />

      <section className="section-y bg-white">
        <div className="site-container">
          <SectionTitle
            title="Our Leadership Team"
            description="Guided by experienced academic and administrative leadership."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {leadershipTeam.map((leader) => (
              <article
                key={leader.name}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft"
              >
                <SmartImage
                  src={leader.image}
                  alt={leader.name}
                  fallbackLabel={leader.role}
                  className="aspect-[4/5] w-full object-cover object-center"
                />
                <div className="p-6">
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold">
                    {leader.role}
                  </p>
                  <h2 className="mt-3 text-2xl font-bold leading-tight text-navy">
                    {leader.name}
                  </h2>
                  <p className="mt-4 leading-7 text-slate-600">{leader.bio}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/about#leadership"
              className="focus-ring inline-flex rounded-md bg-navy px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:bg-navy-dark"
            >
              Meet Our Leadership
            </Link>
          </div>
        </div>
      </section>

      <section className="section-y bg-mist">
        <div className="site-container">
          <SectionTitle
            title="About St. Joseph's"
            description={homeCopy.body}
          />
          <div className="mb-8 grid gap-5 lg:grid-cols-2">
            <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold">
                {homeCopy.heritageTitle}
              </p>
              <h3 className="mt-3 text-2xl font-bold text-navy">
                Inspired by Shri Maram Joji
              </h3>
              <p className="mt-3 leading-7 text-slate-600">{homeCopy.heritage}</p>
              <p className="mt-3 leading-7 text-slate-600">
                "{school.philosophy}"
              </p>
            </article>
            <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold">
                {homeCopy.foundingTitle}
              </p>
              <h3 className="mt-3 text-2xl font-bold text-navy">
                Discipline, Integrity, Accountability
              </h3>
              <p className="mt-3 leading-7 text-slate-600">{homeCopy.founding}</p>
            </article>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {aboutCards.map((card) => (
              <Card key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="site-container">
          <SectionTitle
            title="Why Choose St. Joseph's?"
            description="A balanced learning environment for academics, discipline, activity, safety, and values."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {chooseItems.map((item) => (
              <Card key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-navy text-white">
        <div className="site-container">
          <SectionTitle
            title="Academic Excellence"
            description="A clear progression from early foundations to high school readiness."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {academicLevels.map((level) => (
              <article
                key={level.title}
                className="overflow-hidden rounded-lg bg-white text-ink shadow-soft"
              >
                <SmartImage
                  src={level.image}
                  alt={level.title}
                  fallbackLabel={level.title}
                  className="h-56 w-full object-cover"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-navy">{level.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">
                    {level.description}
                  </p>
                  <ul className="mt-5 grid gap-2 text-sm font-semibold text-navy">
                    {level.points.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="site-container grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionTitle align="left" title="Latest News" />
            <div className="grid gap-4">
              {newsItems.slice(0, 5).map((item) => (
                <article
                  key={item.title}
                  className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-gold/60"
                >
                  <p className="text-sm font-bold text-gold">
                    {new Date(item.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-navy">
                    {item.title}
                  </h3>
                  <p className="mt-2 leading-7 text-slate-600">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
          <div>
            <SectionTitle align="left" title="Upcoming Events" />
            <div className="grid gap-5">
              {events.map((event) => (
                <EventCard key={event.title} {...event} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-mist py-12">
        <div className="site-container grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-lg bg-white p-6 text-center shadow-sm">
              <p className="text-4xl font-bold text-navy">{stat.value}</p>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="site-container">
          <SectionTitle
            title="Gallery Preview"
            description="Public moments from campus life, celebrations, academics, and student activities."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.slice(0, 6).map((item) => (
              <article key={item.title} className="group overflow-hidden rounded-lg bg-white shadow-soft">
                <SmartImage
                  src={item.image}
                  alt={item.title}
                  fallbackLabel={item.title}
                  className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-navy">{item.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-gold">
                    {item.category}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/gallery"
              className="focus-ring inline-flex rounded-md border border-navy px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-navy transition hover:bg-navy hover:text-white"
            >
              View Gallery
            </Link>
          </div>
        </div>
      </section>

      <section className="section-y bg-navy-dark text-white">
        <div className="site-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <SectionTitle
              align="left"
              title="Once a Josephite, Always a Josephite"
              description="Alumni memories and achievements are part of the school's continuing story."
            />
            <Link
              href="/alumni"
              className="focus-ring inline-flex rounded-md bg-gold px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-navy-dark transition hover:-translate-y-0.5 hover:bg-white"
            >
              Alumni Registration
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {alumniStories.map((story) => (
              <article key={story.name} className="rounded-lg border border-white/10 bg-white/8 p-6">
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-gold">
                  {story.role}
                </p>
                <h3 className="mt-3 text-2xl font-semibold">{story.name}</h3>
                <p className="mt-4 leading-7 text-white/72">{story.quote}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="site-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <SectionTitle
              align="left"
              title="Contact St. Joseph's"
              description="For admissions, office visits, public enquiries, and official communication."
            />
            <div className="grid gap-4 text-slate-700">
              <p>
                <strong className="text-navy">Address:</strong> {school.address}
              </p>
              <p>
                <strong className="text-navy">Phone:</strong> {school.phone}
              </p>
              <p>
                <strong className="text-navy">Email:</strong> {school.email}
              </p>
              <p>
                <strong className="text-navy">Office Timings:</strong>{" "}
                {school.timings}
              </p>
            </div>
            <a
              href={school.whatsapp}
              className="focus-ring mt-8 inline-flex rounded-md bg-navy px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:bg-navy-dark"
            >
              Schedule a Campus Visit / Contact Administration
            </a>
          </div>
          <div className="rounded-lg border border-slate-200 bg-mist p-8 text-center shadow-sm">
            <div className="flex min-h-[280px] items-center justify-center rounded-lg border border-dashed border-navy/25 bg-white">
              <div>
                <p className="text-xl font-bold text-navy">Google Maps Embed</p>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
                  Replace this public placeholder with the official school map
                  embed when the verified map link is available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
