import { DEMO_MODE, site } from "@/lib/site";

/** Proposed hours stay visible only in the demo, never as launch facts. */
export function BusinessHours({ className = "" }: { className?: string }) {
  if (!site.hoursConfirmed && !DEMO_MODE) {
    return <p className={`text-sm leading-relaxed ${className}`}>Call to arrange a time to discuss your roof.</p>;
  }
  return (
    <div className={className}>
      {!site.hoursConfirmed && <p className="mb-3 text-xs leading-relaxed">{site.hoursNote}</p>}
      <dl className="space-y-1.5 text-sm">
        {site.hours.map((h) => (
          <div key={h.day} className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-b border-current/20 pb-1.5">
            <dt>{h.day}</dt><dd>{h.time}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
