import { createFileRoute } from "@tanstack/react-router";

const title = "Refund & Replacement Policy | Veloria.AI";
const description = "Refund and Replacement Policy explaining our 100% replacement warranty and refund terms.";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/refund" },
    ],
    links: [{ rel: "canonical", href: "/refund" }],
  }),
  component: RefundPage,
});

function RefundPage() {
  return (
    <div className="relative overflow-hidden px-4 py-24 md:py-32">
      {/* soft ambient glow background elements */}
      <div className="pointer-events-none absolute -left-24 top-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-3xl">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Refund & Replacement Policy
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Last updated: July 19, 2026
          </p>
        </div>

        <div className="prose prose-invert mt-12 space-y-8 text-foreground/80 text-[15px] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground border-b border-white/10 pb-2">
              1. 100% Replacement Warranty
            </h2>
            <p>
              At Veloria.AI, we stand behind the reliability of our digital subscriptions. We provide a **100% Replacement Warranty** that matches the exact duration of your purchased plan (e.g., a 30-day warranty for a 1-month plan).
            </p>
            <p>
              If a shared account password is reset, or if access is blocked due to primary provider changes, we commit to restoring your access or providing new credentials within **12 to 24 hours** after you report the issue.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground border-b border-white/10 pb-2">
              2. Refund Eligibility
            </h2>
            <p>
              Due to the nature of digital goods and instantaneous credential activation, **all sales are final** once the working login details have been successfully delivered to you. 
            </p>
            <p>
              However, you are eligible for a **full or partial refund** under the following conditions:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Non-Delivery:</strong> If we fail to deliver your login credentials or setup instructions within 48 hours of your confirmed order payment.</li>
              <li><strong>Warranty Failure:</strong> If a purchased tool experiences downtime or credentials stop working, and our support team fails to provide a replacement or resolution within **48 hours** of your ticket submission.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground border-b border-white/10 pb-2">
              3. Refund Process
            </h2>
            <p>
              Once a refund request is verified and approved by our billing department:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>The refund will be processed back to your original payment source (bank transfer, JazzCash, EasyPaisa, or billing card).</li>
              <li>Processing times may take between 1 to 3 business days depending on bank clearance speeds.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground border-b border-white/10 pb-2">
              4. How to Claim a Replacement or Refund
            </h2>
            <p>
              To initiate a warranty claim or request a refund:
            </p>
            <ol className="list-decimal pl-5 space-y-1.5">
              <li>Open a support conversation via the **WhatsApp Button** on our site or submit a message via the **Contact Us** form.</li>
              <li>Provide your **Order ID**, registered **email address**, and a brief description/screenshot of the issue you are experiencing.</li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
