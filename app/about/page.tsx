import type { Metadata } from "next";
import Image from "next/image";
import { LeadershipGrid } from "@/components/LeadershipGrid";
import { SchoolCampuses } from "@/components/SchoolCampuses";
import { SmartImage } from "@/components/UI/SmartImage";
import { historyTimeline, homeCopy, school } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Us",
  description: "Meet our leadership and discover St. Joseph's High School, serving Borabanda since 1992."
};

export default function AboutPage() {
  return (
    <>
      <section className="page-intro">
        <div className="site-container">
          <p className="eyebrow">Our story</p>
          <h1>About St. Joseph's</h1>
          <p>A school community built on learning, character, and care. Serving families in Borabanda since {school.establishedYear}.</p>
        </div>
      </section>
      <section className="section-y bg-white">
        <div className="site-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <figure>
            <div className="about-group-photo">
              <Image src="/images/leadership-group.jpg" alt="St. Joseph's leadership: Maram Vijaya Prasad, Kakumanu Nirmala Mary, Maram Vijoci Dev, and Kakumanu Swarna Ravali" width={5568} height={3712} sizes="(min-width: 1024px) 820px, 132vw" priority />
            </div>
            <figcaption className="mt-4 text-sm leading-6 text-slate-600">Our school leadership, united by a commitment to education.</figcaption>
          </figure>
          <div>
            <p className="eyebrow">Since 1992</p>
            <h2 className="section-headline mt-3">Education with Purpose</h2>
            <p className="mt-5 leading-8 text-slate-600">{homeCopy.body}</p>
            <blockquote className="mt-6 border-l-4 border-gold pl-5 text-xl font-medium leading-8 text-navy">{school.philosophy}</blockquote>
          </div>
        </div>
      </section>
      <SchoolCampuses />
      <section className="section-y bg-white">
        <div className="site-container grid gap-10 md:grid-cols-2">
          <div>
            <p className="eyebrow">Our heritage</p>
            <h2 className="mt-3 text-3xl font-bold text-navy">The Maram Joji Educational Trust</h2>
            <p className="mt-5 leading-8 text-slate-600">{homeCopy.heritage}</p>
            <p className="mt-4 leading-8 text-slate-600">{homeCopy.philosophy}</p>
          </div>
          <div>
            <p className="eyebrow">Our foundation</p>
            <h2 className="mt-3 text-3xl font-bold text-navy">Discipline, Integrity, Accountability</h2>
            <p className="mt-5 leading-8 text-slate-600">{homeCopy.founding}</p>
          </div>
        </div>
      </section>
      <section className="section-y border-y border-slate-200 bg-mist" id="leadership">
        <div className="site-container">
          <div className="section-heading"><div><p className="eyebrow">Meet our team</p><h2>Our Leadership</h2></div></div>
          <LeadershipGrid />
        </div>
      </section>
      <section className="section-y bg-white">
        <div className="site-container">
          <div className="section-heading"><div><p className="eyebrow">Beyond the classroom</p><h2>Space to Learn, Play, and Belong</h2></div></div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { image: "/images/gallery/gallery-3.jpg", title: "Learning through activity" },
              { image: "/images/gallery/gallery-2.jpg", title: "Thinking, sharing, playing" },
              { image: "/images/gallery/gallery-1.jpg", title: "Growing together" }
            ].map((item) => (
              <figure key={item.image}>
                <SmartImage src={item.image} alt={item.title} className="aspect-[3/2] w-full rounded-lg object-contain" />
                <figcaption className="mt-4 font-semibold text-navy">{item.title}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <section className="section-y border-t border-slate-200 bg-mist">
        <div className="site-container">
          <div className="section-heading"><div><p className="eyebrow">Our journey</p><h2>Built on a Lasting Foundation</h2></div></div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {historyTimeline.map((item) => (
              <article key={item.year} className="border-t-2 border-gold pt-5">
                <p className="text-sm font-semibold text-slate-600">{item.year}</p>
                <h3 className="mt-3 text-xl font-bold text-navy">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
