import type { Metadata } from "next";
import { ContactForm } from "@/components/Forms/ContactForm";
import { SectionTitle } from "@/components/UI/SectionTitle";
import { school, schoolUnits } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact information, office timings, enquiry UI, and Google Maps link for St. Joseph's High School."
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-navy py-20 text-white">
        <div className="site-container max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Contact Us
          </h1>
          <p className="mt-6 text-xl leading-8 text-white/78">
            Reach the school office for admissions, visits, and public enquiries
            through verified contact channels.
          </p>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="site-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionTitle align="left" title="School Office" />
            <div className="grid gap-4 rounded-lg bg-mist p-6 text-slate-700">
              <p>
                <strong className="text-navy">Address:</strong> {school.address}
              </p>
              <p>
                <strong className="text-navy">Phone:</strong> {school.phone}
              </p>
              <p>
                <strong className="text-navy">Email:</strong> {school.email}
              </p>
              <p>
                <strong className="text-navy">Office Timings:</strong>{" "}
                {school.timings}
              </p>
            </div>
            <a
              href={school.whatsapp}
              className="focus-ring mt-6 inline-flex rounded-md bg-gold px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-navy-dark transition hover:-translate-y-0.5 hover:bg-navy hover:text-white"
            >
              WhatsApp Enquiry
            </a>

            <div className="mt-8 rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-xl font-bold text-navy">Find Us on Google Maps</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Open the official St. Joseph's High School location for
                directions and campus visits.
              </p>
              <a
                href={school.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="focus-ring mt-5 inline-flex rounded-md bg-navy px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:bg-navy-dark"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
          <ContactForm mode="contact" />
        </div>
      </section>

      <section className="section-y bg-mist">
        <div className="site-container">
          <SectionTitle
            title="School Units & Addresses"
            description="Official public address details for the High School, Primary School, and Pre Primary School."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {schoolUnits.map((unit) => (
              <article
                key={unit.name}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
              >
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold">
                  {unit.name}
                </p>
                <h2 className="mt-3 text-2xl font-bold text-navy">
                  {unit.inCharge}
                </h2>
                <p className="mt-4 leading-7 text-slate-600">{unit.address}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
