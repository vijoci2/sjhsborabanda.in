import type { Metadata } from "next";
import { ContactForm } from "@/components/Forms/ContactForm";
import { SectionTitle } from "@/components/UI/SectionTitle";
import { SmartImage } from "@/components/UI/SmartImage";

export const metadata: Metadata = {
  title: "Alumni",
  description:
            "Stay connected with the St. Joseph's High School community."
};

export default function AlumniPage() {
  return (
    <>
      <section className="bg-navy py-20 text-white">
        <div className="site-container max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Alumni
          </h1>
          <p className="mt-6 text-xl leading-8 text-white/78">
            Once a Josephite, always a Josephite. Share memories, celebrate
            achievements, and stay connected with the school community.
          </p>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="site-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionTitle align="left" title="Alumni Memories" />
            <SmartImage src="/images/gallery/gallery-1.jpg" alt="Students taking part in school activities at St. Joseph's" className="aspect-[3/2] w-full rounded-lg object-contain" />
            <p className="mt-5 leading-7 text-slate-600">Reconnect with the school, share your memories, or tell us where your journey has taken you.</p>
          </div>
          <ContactForm mode="alumni" />
        </div>
      </section>
    </>
  );
}
