import Link from "next/link";
import { allPageLinks, school } from "@/lib/data";
import { SmartImage } from "@/components/UI/SmartImage";

const usefulLinks = [
  { label: "Admissions", href: "/admissions" },
  { label: "Events Archive", href: "/events/archive" },
  { label: "Gallery", href: "/gallery" },
  { label: "Alumni", href: "/alumni" }
];

const socialLinks = [
  { label: "Facebook", short: "F" },
  { label: "Instagram", short: "I" },
  { label: "YouTube", short: "Y" }
];

export function Footer() {
  const quickLinks = allPageLinks.slice(0, 6);

  return (
    <footer className="bg-navy-dark text-white">
      <div className="site-container grid gap-10 py-14 md:grid-cols-[1.25fr_1fr_1fr_1.15fr]">
        <div>
          <div className="flex items-center gap-3">
            <SmartImage
              src="/images/logo.png"
              alt={`${school.name} logo`}
              className="h-14 w-14 rounded-lg object-cover"
              fallbackLabel="SJ"
            />
            <div>
              <p className="text-lg font-bold">{school.name}</p>
              <p className="text-sm text-white/65">{school.location}</p>
            </div>
          </div>
          <p className="mt-5 max-w-sm leading-7 text-white/70">
            A values-led learning community for academics, character, service,
            and confident futures.
          </p>
          <div className="mt-6 flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href="#"
                aria-label={social.label}
                className="focus-ring flex h-10 w-10 items-center justify-center rounded-md border border-white/15 text-sm font-bold text-white/80 transition hover:border-gold hover:bg-gold hover:text-navy-dark"
              >
                {social.short}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-gold">
            Quick Links
          </h2>
          <ul className="mt-5 grid gap-3 text-sm text-white/72">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-gold">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-gold">
            Useful Links
          </h2>
          <ul className="mt-5 grid gap-3 text-sm text-white/72">
            {usefulLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-gold">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-gold">
            Contact
          </h2>
          <address className="mt-5 grid gap-3 not-italic text-sm leading-6 text-white/72">
            <span>{school.address}</span>
            <a href={`tel:${school.phone.replace(/\s/g, "")}`} className="hover:text-gold">
              {school.phone}
            </a>
            <a href={`mailto:${school.email}`} className="hover:text-gold">
              {school.email}
            </a>
            <span>{school.timings}</span>
          </address>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <div className="site-container flex flex-col gap-3 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <p>
            Copyright {new Date().getFullYear()} {school.name}. All rights
            reserved.
          </p>
          <div className="flex items-center gap-3">
            <p>Public information only. Private student records are never displayed.</p>
            <Link
              href="/admin"
              aria-label="Administration"
              title="Administration"
              className="focus-ring inline-flex h-7 w-7 items-center justify-center rounded text-xs text-white/35 transition hover:bg-white/10 hover:text-gold"
            >
              ⚙
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
