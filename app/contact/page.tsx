import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { SectionTitle } from "@/components/SectionTitle";
import { school } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact information, office timings, enquiry UI, and map placeholder for St. Joseph's High School."
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

            <div className="mt-8 rounded-lg border border-dashed border-navy/25 bg-white p-8 text-center shadow-sm">
              <p className="text-xl font-bold text-navy">Google Maps Embed</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Use the verified public Google Maps embed link here during
                deployment.
              </p>
            </div>
          </div>
          <ContactForm mode="contact" />
        </div>
      </section>
    </>
  );
}
