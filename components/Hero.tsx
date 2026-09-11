import Link from "next/link";
import { school } from "@/lib/data";
import { SmartImage } from "@/components/UI/SmartImage";

export function Hero() {
  return (
    <section className="school-hero">
      <SmartImage src="/images/gallery/annual-day.jpg" alt="Students and teachers gathered for assembly at St. Joseph's High School" className="hero-photo" priority />
      <div className="hero-shade" />
      <div className="site-container relative z-10 py-16 md:py-24">
        <div className="max-w-xl">
          <p className="mb-5 text-sm font-semibold text-white">Borabanda, Hyderabad | Since {school.establishedYear}</p>
          <h1>{school.name}</h1>
          <p className="mt-6 max-w-md text-xl leading-8 text-white/90">{school.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/admissions" className="button-primary">Admission enquiry</Link>
            <Link href="/about" className="button-light">Discover our school</Link>
          </div>
        </div>
      </div>
      <div className="relative z-10 border-t border-white/25">
        <div className="site-container flex flex-wrap items-center justify-between gap-3 py-5 text-sm text-white">
          <span>Pre Primary | Primary | High School</span>
          <a href={"tel:" + school.phone.replace(/\s/g, "")} className="focus-ring rounded py-1 font-semibold">Admissions: {school.phone}</a>
        </div>
      </div>
    </section>
  );
}
