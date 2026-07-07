"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cmsApi, clearSessionToken, isCmsConfigured } from "@/lib/appsScriptApi";
import { school } from "@/lib/data";
import type { AdminUser } from "@/types/cms";

const adminLinks = [
  { label: "Overview", href: "/admin/dashboard" },
  { label: "Upcoming Events", href: "/admin/events" },
  { label: "Gallery", href: "/admin/gallery" }
];

type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    cmsApi.validateSession().then((response) => {
      if (!mounted) {
        return;
      }

      if (response.success && response.data?.user) {
        setUser(response.data.user);
      } else {
        clearSessionToken();
        router.replace("/admin");
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [router]);

  async function handleLogout() {
    await cmsApi.adminLogout();
    clearSessionToken();
    router.replace("/admin");
  }

  if (loading) {
    return (
      <section className="section-y bg-mist">
        <div className="site-container rounded-lg bg-white p-8 text-center shadow-sm">
          <p className="font-semibold text-navy">Checking admin session...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-mist py-8">
      <div className="site-container">
        {!isCmsConfigured() ? (
          <div className="mb-5 rounded-lg border border-gold/40 bg-gold/10 p-4 text-sm leading-6 text-navy">
            Add <strong>NEXT_PUBLIC_APPS_SCRIPT_URL</strong> to connect this
            dashboard to Google Apps Script.
          </div>
        ) : null}

        <div className="mb-5 flex items-center justify-between gap-3 rounded-lg bg-white p-4 shadow-sm">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold">
              Website Administration
            </p>
            <h1 className="text-2xl font-bold text-navy">{school.name}</h1>
            {user ? (
              <p className="mt-1 text-sm text-slate-500">
                Signed in as {user.FULL_NAME} ({user.ROLE})
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="focus-ring rounded-md border border-slate-200 px-3 py-2 text-sm font-bold text-navy md:hidden"
          >
            Menu
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-[230px_1fr]">
          <aside
            className={`rounded-lg bg-navy p-4 text-white shadow-sm md:block ${
              mobileOpen ? "block" : "hidden"
            }`}
          >
            <nav className="grid gap-2">
              {adminLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`focus-ring rounded-md px-3 py-3 text-sm font-bold transition ${
                      active
                        ? "bg-white text-navy"
                        : "text-white/78 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={handleLogout}
                className="focus-ring mt-4 rounded-md bg-gold px-3 py-3 text-left text-sm font-bold text-navy-dark"
              >
                Logout
              </button>
            </nav>
          </aside>

          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </section>
  );
}
