"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  cmsApi,
  getStoredSessionToken,
  isCmsConfigured,
  storeSessionToken
} from "@/lib/appsScriptApi";
import { school } from "@/lib/data";
import { SmartImage } from "@/components/UI/SmartImage";

export function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!getStoredSessionToken()) {
      return;
    }

    cmsApi.validateSession().then((response) => {
      if (response.success) {
        router.replace("/admin/dashboard");
      }
    });
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await cmsApi.adminLogin(username.trim(), password);

    if (response.success && response.data?.sessionToken) {
      storeSessionToken(response.data.sessionToken);
      router.replace("/admin/dashboard");
      return;
    }

    setMessage(response.message || "Login failed. Please check your details.");
    setLoading(false);
  }

  return (
    <section className="section-y bg-mist">
      <div className="site-container max-w-md">
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-slate-200 bg-white p-7 shadow-soft"
        >
          <div className="mb-6 flex items-center gap-3">
            <SmartImage
              src="/images/logo.png"
              alt={`${school.name} logo`}
              fallbackLabel="SJ"
              className="h-14 w-14 rounded-lg object-cover"
              priority
            />
            <div>
              <p className="font-bold text-navy">{school.name}</p>
              <p className="text-sm text-slate-500">Website Administration</p>
            </div>
          </div>

          {!isCmsConfigured() ? (
            <div className="mb-5 rounded-md bg-gold/10 p-3 text-sm leading-6 text-navy">
              Configure <strong>NEXT_PUBLIC_APPS_SCRIPT_URL</strong> before
              live admin login can work.
            </div>
          ) : null}

          <label className="grid gap-2 text-sm font-semibold text-navy">
            Username
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
              className="focus-ring rounded-md border border-slate-200 px-3 py-3 text-ink"
            />
          </label>

          <label className="mt-4 grid gap-2 text-sm font-semibold text-navy">
            Password
            <div className="flex rounded-md border border-slate-200">
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="min-w-0 flex-1 rounded-l-md px-3 py-3 text-ink outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="px-3 text-sm font-bold text-navy"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          {message ? (
            <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">
              {message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="focus-ring mt-6 w-full rounded-md bg-navy px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-navy-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
}
