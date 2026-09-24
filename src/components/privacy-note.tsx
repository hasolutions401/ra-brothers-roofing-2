import { SiteLink as Link } from "./site-link";

/** Beside each form's send button: what happens to the details. */
export function PrivacyNote({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs leading-relaxed text-charcoal-500 ${className}`}>
      We use your details only to answer this request, and never sell them.{" "}
      <Link href="/privacy" className="font-semibold text-accent-600 underline underline-offset-2">
        Privacy notice
      </Link>
    </p>
  );
}
