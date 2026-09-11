import Link from "next/link";
import { leadershipTeam, school } from "@/lib/data";
import { SmartImage } from "@/components/UI/SmartImage";

export function Footer() {
  return (
    <footer className="bg-navy-dark text-white">
      <div className="site-container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.1fr_.7fr_1.3fr]">
        <div>
          <div className="flex items-center gap-3">
            <SmartImage src="/images/logo.png" alt="St. Joseph's school crest" className="h-14 w-14 shrink-0 rounded bg-white object-contain" />
            <div><p className="text-lg font-bold">{school.name}</p><p className="mt-1 text-sm text-white/70">Borabanda, Hyderabad</p></div>
          </div>
          <p className="mt-5 text-sm leading-7 text-white/70">{school.address}</p>
          <p className="mt-3 text-sm leading-7 text-white/70">{school.timings}</p>
          <a href={school.googleMapsUrl} target="_blank" rel="noreferrer" className="focus-ring mt-4 inline-block py-2 text-sm font-semibold text-gold">Find us on Google Maps</a>
        </div>
        <div>
          <h2 className="text-sm font-bold text-gold">Explore</h2>
          <nav aria-label="Footer navigation" className="mt-4 grid gap-3 text-sm text-white/80">
            {[["About our school", "/about"], ["Our leadership", "/about#leadership"], ["Academics", "/academics"], ["Facilities", "/facilities"], ["Gallery", "/gallery"], ["News & events", "/events"], ["Admissions", "/admissions"], ["Contact us", "/contact"]].map(([label, href]) => <Link key={href} href={href} className="focus-ring hover:text-gold">{label}</Link>)}
          </nav>
        </div>
        <div>
          <h2 className="text-sm font-bold text-gold">School contacts</h2>
          <div className="mt-4 grid gap-4">
            {leadershipTeam.map((person) => (
              <div key={person.name} className="border-b border-white/10 pb-3">
                <p className="text-sm font-semibold">{person.name}</p>
                <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="text-white/65">{person.role}</span>
                  <a href={"tel:" + person.phone.replace(/\s/g, "")} className="focus-ring py-1 text-white hover:text-gold">{person.phone}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/15 py-5">
        <div className="site-container flex flex-wrap justify-between gap-3 text-xs text-white/65">
          <p>Copyright {new Date().getFullYear()} {school.name}. All rights reserved.</p>
          <Link href="/admin" className="focus-ring hover:text-white">Administration</Link>
        </div>
      </div>
    </footer>
  );
}
