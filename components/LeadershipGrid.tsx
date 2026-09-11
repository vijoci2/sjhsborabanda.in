import { SmartImage } from "@/components/UI/SmartImage";
import { leadershipTeam } from "@/lib/data";

export function LeadershipGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {leadershipTeam.map((leader) => (
        <article key={leader.name} className="leadership-card">
          <SmartImage src={leader.image} alt={leader.name} fallbackLabel={leader.role} className="aspect-[3/2] w-full bg-mist object-contain" />
          <div className="flex flex-1 flex-col p-5">
            <p className="eyebrow">{leader.role}</p>
            <h3 className="mt-2 text-xl font-bold leading-snug text-navy">{leader.name}</h3>
            {leader.qualification ? <p className="mt-1 text-sm text-slate-600">{leader.qualification}</p> : null}
            <p className="mb-5 mt-3 text-sm leading-6 text-slate-600">{leader.bio}</p>
            <a href={"tel:" + leader.phone.replace(/\s/g, "")} aria-label={"Call " + leader.name + " on " + leader.phone} className="focus-ring mt-auto block border-t border-slate-200 pt-4 text-base font-bold text-navy hover:underline">{leader.phone}</a>
          </div>
        </article>
      ))}
    </div>
  );
}
