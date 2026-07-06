"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navLinks, school } from "@/lib/data";
import { SmartImage } from "@/components/UI/SmartImage";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-dark/95 text-white shadow-sm backdrop-blur">
      <div className="site-container flex min-h-20 items-center justify-between gap-4">
        <Link
          href="/"
          className="focus-ring flex min-w-0 items-center gap-3 rounded"
          onClick={() => setOpen(false)}
        >
          <SmartImage
            src="/images/logo.png"
            alt={`${school.name} logo`}
            className="h-12 w-12 rounded-lg object-cover"
            fallbackLabel="SJ"
            priority
          />
          <span className="min-w-0">
            <span className="block truncate text-base font-bold leading-5 md:text-lg">
              {school.name}
            </span>
            <span className="block truncate text-xs font-medium text-white/70">
              {school.location}
            </span>
          </span>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="nav-scroll hidden max-w-[690px] items-center gap-1 overflow-x-auto xl:flex"
        >
          {navLinks.map((link) => {
            const active =
              pathname === link.href.split("#")[0] ||
              (link.href !== "/" && pathname.startsWith(link.href.split("#")[0]));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`focus-ring whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-white text-navy"
                    : "text-white/78 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <Link
            href="/admissions"
            className="focus-ring rounded-md bg-gold px-4 py-2 text-sm font-bold text-navy-dark shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
          >
            Enquiry
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/20 text-white transition hover:bg-white/10 xl:hidden"
        >
          <span className="sr-only">Menu</span>
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 rounded bg-current transition ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] h-0.5 w-5 rounded bg-current transition ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-0.5 w-5 rounded bg-current transition ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      <div
        className={`overflow-hidden border-t border-white/10 bg-navy-dark transition-all duration-300 xl:hidden ${
          open ? "max-h-[720px]" : "max-h-0"
        }`}
      >
        <nav aria-label="Mobile navigation" className="site-container grid gap-1 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`focus-ring rounded-md px-3 py-3 text-sm font-semibold ${
                pathname === link.href.split("#")[0]
                  ? "bg-white text-navy"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admissions"
            onClick={() => setOpen(false)}
            className="focus-ring mt-2 rounded-md bg-gold px-4 py-3 text-center text-sm font-bold text-navy-dark"
          >
            Admission Enquiry
          </Link>
        </nav>
      </div>
    </header>
  );
}
