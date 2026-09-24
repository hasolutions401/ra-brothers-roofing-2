import { pageMetadata } from "@/lib/seo";
import { PageHero, CtaBand } from "@/components/sections";
import { SectionHeading } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About Us",
  description:
    "A group of friends who started a roofing company to give homeowners in Southern New Hampshire and Northern Massachusetts a fair price, a trusted service and a satisfaction guarantee.",
  path: "/about/",
});

const principles = [
  {
    title: "A recommendation you can understand",
    text: "Ask what caused the problem, what work is proposed and why. A useful estimate explains the condition of the roof and the options available to you.",
  },
  {
    title: "A clear scope before work starts",
    text: "The written estimate sets out the proposed work and its price. Ask how concealed damage, including decking that becomes visible during tear-off, will be priced and approved.",
  },
  {
    title: "If you are not satisfied, we make it right",
    text: "Every job is backed by a satisfaction guarantee. If something about the work is not right, tell us and we will come back and put it right. That is the reason the company exists.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        image="/images/home-tudor"
        crumbs={[{ href: "/about", label: "About" }]}
        title="Friends who wanted roofing done right"
        lede="We are a new roofing company serving Southern New Hampshire and Northern Massachusetts, started by a group of friends with one idea: people deserve a fair price, a service they can trust, and a guarantee that the job will be done right."
      />

      {/* Story */}
      <section className="bg-white">
        <div className="wrap py-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">Our story</h2>
              <p className="mt-5 max-w-[40ch] font-display text-2xl font-semibold leading-snug text-navy-900 sm:text-[1.7rem]">
                Between us we had all heard the same stories: the quote that
                doubled halfway through the job, the roofer who stopped answering
                the phone, the homeowner who had no idea whether they had been
                treated fairly.
              </p>
            </div>
            <div className="space-y-5 text-base leading-relaxed text-charcoal-500 lg:pt-14">
              <p className="max-w-[64ch]">
                So we came together to build the roofing company we would want
                to hire ourselves: honest about what a roof needs, clear about
                what it costs before anything starts, and quick to pick up the
                phone. A free estimate, a fair price in writing, and a call back
                within one business day.
              </p>
              <p className="max-w-[64ch]">
                Trust has to be earned rather than claimed, so every job comes
                with a satisfaction guarantee. If you are not happy with the
                work, we will make it right.
              </p>
              <p className="max-w-[64ch]">
                We are starting in Southern New Hampshire and the Massachusetts
                towns closest to Salem, residential first and commercial too, and
                we plan to grow from here.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="bg-navy-900">
        <div className="wrap py-14 lg:py-20">
          <SectionHeading tone="light" title="Three things we hold to" />
          <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-3">
            {principles.map((p) => (
              <div key={p.title} className="border-t-2 border-accent-500 pt-5">
                <h3 className="text-lg font-bold text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-200">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The guarantee, spelled out */}
      <section id="guarantee" className="scroll-mt-24 bg-mist-50">
        <div className="wrap py-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
            <SectionHeading
              title="Our satisfaction guarantee"
              lede="What it covers, and how to use it if you ever need to."
            />
            <dl className="divide-y divide-mist-200 border-y border-mist-200">
              {site.guarantee.map(([title, text]) => (
                <div key={title} className="flex flex-col gap-1.5 py-4 sm:flex-row sm:gap-6">
                  <dt className="shrink-0 text-sm font-bold text-navy-900 sm:w-52">{title}</dt>
                  <dd className="text-sm leading-relaxed text-charcoal-500">{text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
