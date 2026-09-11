import Link from "next/link";
import { HomeNewsEvents } from "@/components/CMS/HomeNewsEvents";
import { Hero } from "@/components/Hero";
import { LeadershipGrid } from "@/components/LeadershipGrid";
import { SchoolCampuses } from "@/components/SchoolCampuses";
import { SchoolContacts } from "@/components/SchoolContacts";
import { SmartImage } from "@/components/UI/SmartImage";
import { academicLevels, homeCopy, school } from "@/lib/data";

export default function Home() {
  return (
    <>
      <Hero />
      <section className="section-y bg-white">
        <div className="site-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow">Welcome to St. Joseph's</p>
            <h2 className="section-headline mt-3">A place to learn.<br />A community to grow.</h2>
            <p className="mt-6 leading-8 text-slate-600">{homeCopy.body}</p>
            <Link href="/about" className="button-secondary mt-6">Our story</Link>
          </div>
          <figure>
            <SmartImage src="/images/classrooms/classroom.jpg" alt="St. Joseph's students learning together in their classroom" className="aspect-[3/2] w-full rounded-lg object-contain" />
            <figcaption className="mt-3 text-sm text-slate-500">Learning together, every day.</figcaption>
          </figure>
        </div>
      </section>
      <SchoolCampuses />
      <section className="section-y bg-white">
        <div className="site-container">
          <div className="section-heading">
            <div><p className="eyebrow">Every stage of learning</p><h2>A Strong Foundation for Life</h2></div>
            <Link href="/academics" className="button-secondary">Explore academics</Link>
          </div>
          <div className="grid gap-7 md:grid-cols-3">
            {academicLevels.map((level) => (
              <article key={level.title} className="min-w-0">
                <SmartImage src={level.image} alt={level.title} className="aspect-[3/2] w-full rounded-lg bg-mist object-contain" />
                <h3 className="mt-5 text-2xl font-bold text-navy">{level.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{level.description}</p>
                <ul className="mt-4 grid gap-2 border-t border-slate-200 pt-4 text-sm text-navy">
                  {level.points.map((point) => <li key={point}>{point}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section id="leadership" className="section-y border-y border-slate-200 bg-mist">
        <div className="site-container">
          <div className="section-heading">
            <div><p className="eyebrow">People behind our school</p><h2>Our Leadership Team</h2></div>
            <Link href="/about#leadership" className="button-secondary">Meet our team</Link>
          </div>
          <LeadershipGrid />
        </div>
      </section>
      <section className="section-y bg-white"><HomeNewsEvents /></section>
      <section className="border-y border-slate-200 bg-mist py-12">
        <div className="site-container grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow">Life at St. Joseph's</p>
            <h2 className="mt-2 text-3xl font-bold text-navy">School moments, shared with you.</h2>
            <p className="mt-3 text-slate-600">Explore photographs and memories in our school gallery.</p>
          </div>
          <Link href="/gallery" className="button-secondary justify-self-start">Visit the gallery</Link>
        </div>
      </section>
      <SchoolContacts />
      <section className="bg-navy py-12 text-white">
        <div className="site-container flex flex-wrap items-center justify-between gap-6">
          <div><h2 className="text-3xl font-bold">Come and meet us.</h2><p className="mt-3 text-white/80">Visit {school.name} and speak with our team.</p></div>
          <Link href="/contact" className="button-primary">Plan a school visit</Link>
        </div>
      </section>
    </>
  );
}
