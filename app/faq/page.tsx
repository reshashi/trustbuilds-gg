import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { generateFaqJsonLd } from "@/lib/structuredData";

export const metadata = {
  title: "FAQ | TrustBuilds.gg",
  description:
    "Frequently asked questions about TrustBuilds.gg, our Trust Scores, and how to buy gaming PC components.",
};

const faqs = [
  {
    question: "What is a Trust Score?",
    answer:
      "A Trust Score is our proprietary reliability rating for PC components. It combines failure rate data, warranty length, brand reputation, and RMA experience into a single 1-100 score. Higher is better.",
  },
  {
    question: "How often are prices updated?",
    answer:
      "We update prices weekly from all major retailers including Amazon, Newegg, B&H Photo, Best Buy, and Micro Center. The 'last updated' date on each build shows when prices were last verified.",
  },
  {
    question: "Do you make money from affiliate links?",
    answer:
      "Yes, we earn a small commission when you purchase through our affiliate links. This doesn't affect the price you pay. Our Trust Scores are based entirely on reliability data, not affiliate relationships.",
  },
  {
    question: "Why do some components show 'Out of Stock'?",
    answer:
      "PC component availability changes frequently. When a component is out of stock at all retailers, we show alternatives at similar price points. We recommend checking back regularly or using the 'View' button to monitor availability directly.",
  },
  {
    question: "How do I know these builds are compatible?",
    answer:
      "Every build is manually verified for compatibility. We check CPU/motherboard socket matching, RAM type (DDR4 vs DDR5), case/cooler clearance, and power supply wattage requirements. If you see a build on our site, it will work together.",
  },
  {
    question: "What does 'Build Difficulty' mean?",
    answer:
      "Build Difficulty indicates how challenging the build is to assemble. 'Easy' builds have standard components suitable for first-time builders. 'Medium' builds may require additional cable management or attention to thermals. 'Hard' builds often include custom water cooling or tight cases that require experience.",
  },
  {
    question: "Can I swap out components in a build?",
    answer:
      "Absolutely! Our builds are starting points. Each component shows alternatives that maintain similar performance and price. Just ensure any swaps are compatible with the rest of the build (same socket, DDR type, etc.).",
  },
  {
    question: "Why don't you include monitors, keyboards, or peripherals?",
    answer:
      "We focus exclusively on the PC itself to keep our expertise deep rather than broad. Peripheral preferences are highly personal (gaming style, desk space, aesthetic preferences), so we leave those choices to you.",
  },
  {
    question: "How are Trust Scores calculated?",
    answer:
      "Trust Scores combine four factors: Failure Rate (40% weight), Warranty Length (30%), Brand Reputation (20%), and RMA Experience (10%). See our Trust Methodology page for the full formula and data sources.",
  },
  {
    question: "What if a component I buy fails?",
    answer:
      "All components we recommend come with manufacturer warranties (minimum 1 year, many have 3-5 years). Contact the manufacturer directly for warranty claims. Our RMA Rating helps you understand which brands have the smoothest return process.",
  },
  {
    question: "Do you offer build services or support?",
    answer:
      "We don't offer assembly services—we're focused on helping you choose the right parts. For build help, we recommend communities like r/buildapc on Reddit, or YouTube channels like JayzTwoCents and Linus Tech Tips.",
  },
  {
    question: "How do I suggest a build or report an issue?",
    answer:
      "We'd love to hear from you! Use the contact form on our website or reach out via social media. We review all feedback and use it to improve our builds and Trust Score methodology.",
  },
];

export default function FaqPage() {
  const jsonLd = generateFaqJsonLd(faqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow">
          {/* Hero */}
          <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-[var(--muted)]">
              Everything you need to know about TrustBuilds.gg
            </p>
          </section>

          {/* FAQ List */}
          <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-16">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden"
                >
                  <summary className="flex items-center justify-between cursor-pointer p-6 list-none">
                    <h2 className="text-lg font-semibold text-white pr-4">
                      {faq.question}
                    </h2>
                    <svg
                      className="w-5 h-5 text-[var(--muted)] flex-shrink-0 transition-transform group-open:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-[var(--muted)]">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Still Have Questions */}
          <section className="border-t border-[var(--card-border)] bg-[var(--card-bg)]">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Still Have Questions?
              </h2>
              <p className="text-[var(--muted)] mb-6 max-w-xl mx-auto">
                Check out our Trust Methodology page for more details on how we
                rate components, or browse our builds to see Trust Scores in
                action.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[var(--card-border)] text-white font-medium hover:border-[var(--accent)] transition-colors"
                >
                  Trust Methodology
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-light)] transition-colors"
                >
                  View All Builds
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
