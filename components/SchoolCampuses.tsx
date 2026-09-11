import { SmartImage } from "@/components/UI/SmartImage";
import { school, schoolUnits } from "@/lib/data";

export function SchoolCampuses() {
  return (
    <section className="section-y border-y border-slate-200 bg-mist" aria-labelledby="campuses-title">
      <div className="site-container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Rooted in Borabanda</p>
            <h2 id="campuses-title">Our School Buildings</h2>
          </div>
          <a href={school.googleMapsUrl} target="_blank" rel="noreferrer" className="button-secondary">Get directions</a>
        </div>
        <div className="campus-photos">
          {schoolUnits.map((unit) => (
            <article key={unit.name}>
              <div className="building-photo-stage">
                {unit.photoKind === "primary" ? (
                  <SmartImage src="/images/campus-right.jpg" alt={unit.name + " building"} />
                ) : (
                  <div className={"building-cut building-cut-" + unit.photoKind}>
                    <SmartImage src="/images/campus.jpg" alt={unit.name + " building"} />
                  </div>
                )}
              </div>
              <address className="campus-details not-italic">
                <h3>{unit.shortName}</h3>
                <p className="mt-3 font-semibold text-navy">{unit.inCharge}</p>
                <a href={"tel:" + unit.phone.replace(/\s/g, "")} className="focus-ring underline decoration-gold decoration-2 underline-offset-4">{unit.phone}</a>
                <p className="mt-2 text-slate-600">{unit.address}</p>
              </address>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
