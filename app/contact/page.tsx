import type { Metadata } from "next";
import { ContactForm } from "@/components/Forms/ContactForm";
import { SchoolContacts } from "@/components/SchoolContacts";
import { SchoolCampuses } from "@/components/SchoolCampuses";
import { school } from "@/lib/data";

export const metadata: Metadata = { title: "Contact Us", description: "Contact the leadership team at St. Joseph's High School for admissions, visits, and school enquiries." };

export default function ContactPage() {
  return (
    <>
      <section className="page-intro">
        <div className="site-container"><p className="eyebrow">Stay connected</p><h1>Contact Our School</h1><p>Speak with our team about admissions, school visits, or your child's learning.</p></div>
      </section>
      <SchoolContacts />
      <SchoolCampuses />
      <section className="section-y bg-white">
        <div className="site-container grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow">Come and meet us</p>
            <h2 className="section-headline mt-3">Visit St. Joseph's</h2>
            <p className="mt-5 leading-8 text-slate-600">{school.address}</p>
            <p className="mt-3 text-slate-600">{school.timings}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={school.googleMapsUrl} target="_blank" rel="noreferrer" className="button-secondary">Get directions</a>
              <a href={school.whatsapp} className="button-primary">WhatsApp enquiry</a>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
