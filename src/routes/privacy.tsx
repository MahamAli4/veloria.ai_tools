import { createFileRoute } from "@tanstack/react-router";

const title = "Privacy Policy | Veloria.AI";
const description = "Privacy Policy explaining how Veloria.AI collects, handles, and protects your information.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="relative overflow-hidden px-4 py-24 md:py-32">
      {/* soft ambient glow background elements */}
      <div className="pointer-events-none absolute -left-24 top-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-3xl">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Last updated: July 19, 2026
          </p>
        </div>

        <div className="prose prose-invert mt-12 space-y-8 text-foreground/80 text-[15px] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground border-b border-white/10 pb-2">
              1. Information We Collect
            </h2>
            <p>
              We collect minimal information required to process and deliver your subscription orders securely. This includes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Contact Information:</strong> Your name, email address, and WhatsApp phone number (used solely to deliver login details and support).</li>
              <li><strong>Order Data:</strong> Transaction ID, screenshot of payment transfer (if manually submitted), and items purchased.</li>
              <li><strong>Technical Data:</strong> Anonymized site analytics (page views) to optimize catalog performance.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground border-b border-white/10 pb-2">
              2. How We Use Your Information
            </h2>
            <p>
              We process your data for the following essential purposes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>To deliver subscription logins, invite codes, and support instructions.</li>
              <li>To verify transaction confirmations and prevent fraudulent requests.</li>
              <li>To answer customer inquiries received via our contact forms or WhatsApp.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground border-b border-white/10 pb-2">
              3. Data Security & Storage
            </h2>
            <p>
              All customer records, order histories, and contact messages are stored securely inside our PostgreSQL cloud database hosted by Neon.tech.
            </p>
            <p>
              All traffic between your browser, our servers, and our databases is encrypted using industry-standard TLS/SSL encryption. We do not store or process your credit card numbers on our server. All billing transactions are handled via external verified gateways or bank transfers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground border-b border-white/10 pb-2">
              4. Cookies and Analytics
            </h2>
            <p>
              We use lightweight technical cookies to keep you logged in to your account session (such as when accessing the admin panel). We do not run invasive tracking scripts or sell user behavior data to third-party advertisers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground border-b border-white/10 pb-2">
              5. Third-Party Sharing
            </h2>
            <p>
              Veloria.AI enforces a strict anti-spam policy. We do not sell, rent, trade, or distribute your email addresses, phone numbers, or order history to any marketing agencies or third-party networks.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
