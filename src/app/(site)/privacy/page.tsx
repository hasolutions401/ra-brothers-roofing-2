import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/sections";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Privacy Notice",
  description: `How ${site.name} uses, stores and protects the details you send through this website, and how to ask us to see or delete them.`,
  path: "/privacy/",
});

/*
 * Plain-language notice for the two website forms. Keep it in step with
 * what the site and the Laravel API (backend/) actually do: if a form gains
 * a field, analytics or a new service provider, update this page too.
 * CLIENT TO CONFIRM: the retention period in site.privacy.
 */
const contact = (
  <>
    call us on{" "}
    {site.phones.map((p, i) => (
      <span key={p.state}>
        {i > 0 && " or "}
        <a href={p.href} className="font-semibold text-accent-600 underline underline-offset-2">
          {p.display}
        </a>
      </span>
    ))}
    {site.email && (
      <>
        , or email{" "}
        <a href={`mailto:${site.email}`} className="font-semibold text-accent-600 underline underline-offset-2">
          {site.email}
        </a>
      </>
    )}
  </>
);

const sections: { title: string; body: ReactNode }[] = [
  {
    title: "What we collect",
    body: (
      <>
        <p>When you send a request through this website, we receive what you type or choose in the form:</p>
        <ul>
          <li>your name and phone number, and your email address if you give it;</li>
          <li>your town, and your street address if you give it;</li>
          <li>your answers about the roof, the service you need and the best time to call, and any notes;</li>
          <li>roof photos, if you attach them to the full estimate form.</li>
        </ul>
        <p>
          With each request we also record the page it was sent from, your internet (IP) address and
          your browser type. We use these only to prevent spam and abuse of the forms.
        </p>
      </>
    ),
  },
  {
    title: "How we use it",
    body: (
      <>
        <p>
          We use your details to call you back, prepare your estimate, arrange a visit if one is needed
          and, if you hire us, carry out and keep records of the work. {site.callback}
        </p>
        <p>
          We do not sell your details, and we do not use them for advertising or add you to a mailing
          list. We share them only when you ask us to (for example with your insurance company, if you
          want help with a claim) or when the law requires it.
        </p>
      </>
    ),
  },
  {
    title: "Your photos",
    body: (
      <p>
        Photos are resized on your own device before they are sent. Our server then saves a fresh copy
        of each one, which removes the information cameras attach to photos, such as GPS location. Photos
        are never published: only our team can open them.
      </p>
    ),
  },
  {
    title: "Where it is stored and who can see it",
    body: (
      <p>
        Requests are sent over an encrypted (HTTPS) connection and kept in a private database and
        private file storage with our web hosting provider. Nothing you send is shown on the website.
        Only our own team can see requests, by signing in to a password-protected dashboard. If new-request
        email alerts are switched on, a summary of each request is also emailed to our team.
      </p>
    ),
  },
  {
    title: "How long we keep it",
    body: <p>{site.privacy.retention}</p>,
  },
  {
    title: "Seeing, correcting or deleting your details",
    body: (
      <p>
        You can ask us what we hold about you, ask us to correct it, or ask us to delete it. To do any of
        these, {contact}. We may ask you to confirm a detail from your request so we know it is yours, and
        we will tell you when it is done.
      </p>
    ),
  },
  {
    title: "Cookies and tracking",
    body: (
      <p>
        This website does not use advertising or analytics cookies, and it does not track you from site
        to site. The only cookies are the ones our own staff need to sign in to the dashboard.
      </p>
    ),
  },
  {
    title: "Changes to this notice",
    body: (
      <p>
        If we change how we handle your details, we will update this page and the date below.
        Last updated: {site.privacy.updated}.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        image="/images/home-tudor"
        crumbs={[{ href: "/privacy", label: "Privacy" }]}
        title="Privacy notice"
        lede={`What ${site.short} does with the details you send us, in plain language.`}
      />

      <section className="bg-white">
        <div className="wrap max-w-3xl py-14 lg:py-20">
          <div className="space-y-10">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="text-xl font-extrabold tracking-tight text-navy-900 sm:text-2xl">{s.title}</h2>
                <div className="mt-3 space-y-3 text-base leading-relaxed text-charcoal-500 [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1.5">
                  {s.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
