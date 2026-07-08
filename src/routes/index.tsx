import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/site/Hero";
import {
  FeaturedTools, HowItWorks, WhyChooseUs, Testimonials, FAQSection, Contact, CTABand,
} from "@/components/site/sections";

export const Route = createFileRoute("/")({
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
