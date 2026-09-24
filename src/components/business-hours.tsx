import { site } from "@/lib/site";

/** The heading that goes above <BusinessHours />. */
export const hoursLabel = site.hoursConfirmed ? "Business hours" : "Getting in touch";

/** Hours appear only once confirmed, never as a proposal visitors could rely on. */
export function BusinessHours({ className = "" }: { className?: string }) {
  if (!site.hoursConfirmed) {
    return (
      <p className={`text-sm leading-relaxed ${className}`}>
        Call either number, or send a request any time. {site.callback}
      </p>
    );
  }
  return (
    <div className={className}>
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
