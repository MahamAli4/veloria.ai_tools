import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/site/Hero";
import {
  FeaturedTools, HowItWorks, WhyChooseUs, Testimonials, FAQSection, Contact, CTABand,
} from "@/components/site/sections";
import { faqs } from "@/data/tools";

const title = "AI Vault — Premium AI Subscriptions for Less | Veloria.AI";
const description =
  "AI Vault by Veloria.AI is the premium marketplace for AI subscriptions. Get ChatGPT Plus, Claude, Lovable, Cursor and more — original accounts, delivered in minutes, up to 60% off.";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AI Vault",
    alternateName: "Veloria.AI",
    url: "/",
    logo: "/favicon.png",
    description,
    sameAs: [],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AI Vault",
    url: "/",
    description,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { property: "og:image", content: "/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: "/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: jsonLd.map((data) => ({
      type: "application/ld+json",
      children: JSON.stringify(data),
    })),
  }),
  component: Index,
});

function Index() {
  return (
    <div id="top">
      <Hero />
      <FeaturedTools />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <FAQSection />
      <Contact />
      <CTABand />
    </div>
  );
}
