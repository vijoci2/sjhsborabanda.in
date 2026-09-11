import Link from "next/link";
import { leadershipTeam, school } from "@/lib/data";

export function SchoolContacts() {
  return (
    <section className="section-y bg-white" aria-labelledby="contacts-title">
      <div className="site-container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">We are here to help</p>
            <h2 id="contacts-title">Talk to Our Team</h2>
            <p className="mt-3 text-slate-600">Admissions, school visits, and everyday questions.</p>
          </div>
          <Link href="/contact" className="button-secondary">Contact the school</Link>
        </div>
        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 xl:grid-cols-4">
          {leadershipTeam.map((person) => (
            <div key={person.name} className="border-t border-slate-200 pt-5">
              <p className="text-sm text-slate-600">{person.role}</p>
              <h3 className="mt-1 text-base font-bold text-navy">{person.name}</h3>
              <a href={"tel:" + person.phone.replace(/\s/g, "")} className="focus-ring mt-3 inline-block py-2 text-lg font-semibold text-navy underline decoration-gold decoration-2 underline-offset-4">{person.phone}</a>
            </div>
          ))}
        </div>
        <p className="mt-7 border-t border-slate-200 pt-5 text-sm text-slate-600">Office hours: {school.timings}</p>
      </div>
    </section>
  );
}
