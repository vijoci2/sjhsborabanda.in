"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks, school } from "@/lib/data";
import { SmartImage } from "@/components/UI/SmartImage";

export function Header() {
  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        document.getElementById("navigation-toggle")?.focus();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  function isActive(href: string) {
    const [path, section] = href.split("#");
    if (section) return pathname === path && hash === "#" + section;
    if (path === "/about" && hash === "#leadership") return false;
    return pathname === path || (path !== "/" && pathname.startsWith(path + "/"));
  }

  function navigate(href: string) {
    setOpen(false);
    setHash(href.includes("#") ? "#" + href.split("#")[1] : "");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white text-navy">
      <div className="site-container flex min-h-20 items-center justify-between gap-4">
        <Link href="/" className="focus-ring flex min-w-0 items-center gap-3 rounded" onClick={() => navigate("/")}>
          <SmartImage src="/images/logo.png" alt="St. Joseph's school crest" className="h-12 w-12 shrink-0 object-contain" priority />
          <span className="min-w-0">
            <span className="block text-sm font-bold leading-5 sm:text-base">{school.name}</span>
            <span className="mt-1 block text-xs text-slate-500">Borabanda, Hyderabad</span>
          </span>
        </Link>
        <nav aria-label="Primary navigation" className="hidden shrink-0 items-center gap-1 xl:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => navigate(link.href)} aria-current={isActive(link.href) ? "page" : undefined}
              className={"focus-ring rounded px-3 py-3 text-sm font-semibold transition " + (isActive(link.href) ? "bg-mist text-navy" : "text-slate-600 hover:bg-mist hover:text-navy")}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden shrink-0 xl:block"><Link href="/admissions" className="button-primary">Enquiry</Link></div>
        <button id="navigation-toggle" type="button" aria-label={open ? "Close navigation menu" : "Open navigation menu"} aria-controls="mobile-navigation" aria-expanded={open} onClick={() => setOpen((value) => !value)}
          className="focus-ring inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-slate-200 hover:bg-mist xl:hidden">
          <span className="relative block h-4 w-5" aria-hidden="true">
            <span className={"absolute left-0 top-0 h-0.5 w-5 bg-current transition " + (open ? "translate-y-[7px] rotate-45" : "")} />
            <span className={"absolute left-0 top-[7px] h-0.5 w-5 bg-current transition " + (open ? "opacity-0" : "")} />
            <span className={"absolute bottom-0 left-0 h-0.5 w-5 bg-current transition " + (open ? "-translate-y-[7px] -rotate-45" : "")} />
          </span>
        </button>
      </div>
      {open ? (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="site-container grid max-h-[calc(100dvh-80px)] gap-1 overflow-y-auto border-t border-slate-200 py-4 xl:hidden">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => navigate(link.href)} aria-current={isActive(link.href) ? "page" : undefined}
              className={"focus-ring rounded px-3 py-3 text-sm font-semibold " + (isActive(link.href) ? "bg-mist" : "text-slate-600 hover:bg-mist")}>{link.label}</Link>
          ))}
          <Link href="/admissions" onClick={() => navigate("/admissions")} className="button-primary mt-2">Admission enquiry</Link>
        </nav>
      ) : null}
    </header>
  );
}
