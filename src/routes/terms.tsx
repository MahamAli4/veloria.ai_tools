import { createFileRoute } from "@tanstack/react-router";

const title = "Terms of Service | Veloria.AI";
const description = "Terms and conditions governing the use of Veloria.AI digital subscriptions catalog.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="relative overflow-hidden px-4 py-24 md:py-32">
      {/* soft ambient glow background elements */}
      <div className="pointer-events-none absolute -left-24 top-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-3xl">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Last updated: July 19, 2026
          </p>
        </div>

        <div className="prose prose-invert mt-12 space-y-8 text-foreground/80 text-[15px] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground border-b border-white/10 pb-2">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using Veloria.AI, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not access or use our services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground border-b border-white/10 pb-2">
              2. Description of Services
            </h2>
            <p>
              Veloria.AI operates as a curated catalog offering affordable access, setup assistance, and shared/group-buy subscription management for various premium digital and AI tools (including ChatGPT Plus, Claude Pro, Canva, and others). We facilitate group-buy and regional purchasing structures to reduce monthly costs for digital creators, freelancers, and students.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground border-b border-white/10 pb-2">
              3. Account Access & Responsibilities
            </h2>
            <p>
              When purchasing a subscription package through Veloria.AI:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>You will receive shared/individual credentials or invite links depending on the purchased package.</li>
              <li>You agree not to modify account credentials (passwords, emails, profile settings) on shared accounts.</li>
              <li>You agree not to share provided login details with external parties.</li>
              <li>Any unauthorized account manipulation will result in instant termination of your access without a refund.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground border-b border-white/10 pb-2">
              4. Disclaimer of Affiliation
            </h2>
            <p>
              Veloria.AI is an independent subscription provider. We are not officially affiliated with, associated with, sponsored by, or endorsed by OpenAI, Anthropic (Claude), Canva, Midjourney, or any other trademark owners mentioned on our catalog. All trademarks, names, and logos are the property of their respective owners.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground border-b border-white/10 pb-2">
              5. Support & Warranty
            </h2>
            <p>
              We provide active support and replacement warranties for the entire duration of your purchased package. If a shared service undergoes password changes or technical adjustments, we commit to replacing or restoring credentials within 12 to 24 hours of a report.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground border-b border-white/10 pb-2">
              6. Limitation of Liability
            </h2>
            <p>
              Veloria.AI shall not be liable for any indirect, incidental, special, or consequential damages resulting from the temporary unavailability of tools or changes in policies by primary tool creators.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
