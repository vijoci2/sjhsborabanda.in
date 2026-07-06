"use client";

import { FormEvent, useState } from "react";

type ContactFormProps = {
  mode?: "contact" | "admission" | "alumni";
};

const modeContent = {
  contact: {
    title: "Send an Enquiry",
    button: "Submit Enquiry",
    success: "Thank you. Your enquiry UI has been captured locally for demo purposes."
  },
  admission: {
    title: "Admission Enquiry Form",
    button: "Submit Admission Enquiry",
    success:
      "Thank you. This is a front-end enquiry preview; connect a secure backend before collecting real applications."
  },
  alumni: {
    title: "Alumni Registration",
    button: "Register Interest",
    success:
      "Thank you. This alumni registration UI is ready for a secure backend connection."
  }
};

export function ContactForm({ mode = "contact" }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const content = modeContent[mode];
  const isAdmission = mode === "admission";
  const isAlumni = mode === "alumni";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft"
    >
      <h2 className="text-2xl font-bold text-navy">{content.title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Please share public enquiry information only. Do not submit marks, fee
        records, personal addresses, ID numbers, or private student records.
      </p>

      <div className="mt-6 grid gap-5">
        <label className="grid gap-2 text-sm font-semibold text-navy">
          Full name
          <input
            required
            name="name"
            type="text"
            className="rounded-md border border-slate-300 px-4 py-3 text-base text-ink outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/20"
            placeholder={isAlumni ? "Alumni name" : "Parent or visitor name"}
          />
        </label>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-navy">
            Email
            <input
              required
              name="email"
              type="email"
              className="rounded-md border border-slate-300 px-4 py-3 text-base text-ink outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/20"
              placeholder="name@example.com"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-navy">
            Phone
            <input
              name="phone"
              type="tel"
              className="rounded-md border border-slate-300 px-4 py-3 text-base text-ink outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/20"
              placeholder="Public enquiry number"
            />
          </label>
        </div>

        {isAdmission ? (
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-navy">
              Class seeking admission
              <select
                name="class"
                className="rounded-md border border-slate-300 px-4 py-3 text-base text-ink outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/20"
              >
                <option>Nursery</option>
                <option>Primary</option>
                <option>Middle School</option>
                <option>High School</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-navy">
              Preferred contact time
              <select
                name="time"
                className="rounded-md border border-slate-300 px-4 py-3 text-base text-ink outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/20"
              >
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Evening</option>
              </select>
            </label>
          </div>
        ) : null}

        {isAlumni ? (
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-navy">
              Passing year
              <input
                name="passingYear"
                type="text"
                inputMode="numeric"
                className="rounded-md border border-slate-300 px-4 py-3 text-base text-ink outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/20"
                placeholder="Example: 2014"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-navy">
              Current field
              <input
                name="field"
                type="text"
                className="rounded-md border border-slate-300 px-4 py-3 text-base text-ink outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/20"
                placeholder="Profession or higher studies"
              />
            </label>
          </div>
        ) : null}

        <label className="grid gap-2 text-sm font-semibold text-navy">
          Message
          <textarea
            required
            name="message"
            rows={5}
            className="resize-y rounded-md border border-slate-300 px-4 py-3 text-base text-ink outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/20"
            placeholder="Write your enquiry"
          />
        </label>
      </div>

      <button
        type="submit"
        className="focus-ring mt-6 w-full rounded-md bg-navy px-5 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:bg-navy-dark"
      >
        {content.button}
      </button>

      {submitted ? (
        <p className="mt-4 rounded-md bg-gold/15 px-4 py-3 text-sm font-semibold text-navy">
          {content.success}
        </p>
      ) : null}
    </form>
  );
}
