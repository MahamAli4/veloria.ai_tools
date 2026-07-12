
import { motion } from "motion/react";
import { useState } from "react";
import {
  ShieldCheck, Zap, BadgeCheck, Lock, Headphones, Sparkles,
  ChevronDown, MousePointerClick, CreditCard, Mail, Rocket, Loader2, ArrowRight,
} from "lucide-react";
import { testimonials as fallbackTestimonials, faqs } from "@/data/tools";
import { useTools } from "@/lib/tools";
import { useTestimonials } from "@/lib/testimonials";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ToolCard } from "./ToolCard";
import { Reveal, CountUp, Magnetic } from "./primitives";

export function SectionHeading({
  eyebrow, title, subtitle, center,
}: { eyebrow: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Reveal>
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/50 px-3.5 py-1 text-xs font-medium uppercase tracking-wider text-brand-deep">
          <Sparkles size={12} /> {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-ink md:text-5xl text-balance">
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.1}>
          <p className="mt-4 text-lg text-ink-soft text-balance">{subtitle}</p>
        </Reveal>
      )}
    </div>
  );
}

/* ---------- Featured Tools ---------- */
export function FeaturedTools() {
  const { data: tools = [], isLoading } = useTools();
  return (
    <section className="px-4 py-20" id="tools">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Curated collection" title="Featured AI tools" subtitle="Tell us the tool you need — we help you get the subscription and guide you every step." />
        {isLoading ? (
          <div className="mt-16 flex justify-center">
            <Loader2 className="animate-spin text-brand-deep" />
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t, i) => (
              <ToolCard key={t.slug} tool={t} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- How It Works ---------- */
const steps = [
  { icon: MousePointerClick, title: "Choose Tool", desc: "Browse the collection and pick the AI subscription you need." },
  { icon: CreditCard, title: "Complete Order", desc: "Check out securely in seconds with your preferred method." },
  { icon: Mail, title: "Receive Subscription", desc: "Get your original, upgraded account delivered in minutes." },
  { icon: Rocket, title: "Start Using Premium AI", desc: "Log in and enjoy full premium features immediately." },
];

export function HowItWorks() {
  return (
    <section className="px-4 py-20" id="how">
      <div className="mx-auto max-w-6xl">
        <SectionHeading center eyebrow="Simple process" title="How it works" subtitle="From browsing to premium access in four effortless steps." />
        <div className="relative mt-16 grid gap-6 md:grid-cols-4">
          <div className="pointer-events-none absolute left-0 right-0 top-9 hidden h-px md:block" style={{ background: "var(--hairline)" }} />
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <div className="relative flex flex-col items-center text-center">
                <div className="relative z-10 grid h-18 w-18 place-items-center rounded-2xl border border-border bg-white/70 p-5 shadow-[0_16px_40px_-18px_rgba(137,138,196,0.6)]">
                  <s.icon size={26} className="text-brand-deep" />
                  <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full text-xs font-bold text-white" style={{ background: "var(--gradient-brand)" }}>
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 max-w-[16rem] text-sm text-ink-soft">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Why Choose Us ---------- */
const reasons = [
  { icon: BadgeCheck, title: "Affordable Prices", desc: "Save up to 60% versus paying retail for every tool." },
  { icon: ShieldCheck, title: "Original Accounts", desc: "Genuine, fully-featured subscriptions — never shared junk." },
  { icon: Zap, title: "Fast Delivery", desc: "Most orders arrive within minutes of checkout." },
  { icon: Lock, title: "Secure Payments", desc: "Encrypted checkout with trusted payment providers." },
  { icon: Headphones, title: "24/7 Support", desc: "Real humans ready to help, any time of day." },
  { icon: Sparkles, title: "Trusted Service", desc: "Thousands of five-star reviews from happy members." },
];

export function WhyChooseUs() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="The AI Vault difference" title="Why choose us" subtitle="Premium service, premium trust — every single order." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={(i % 3) * 0.08}>
              <div className="group h-full rounded-2xl border border-border bg-white/55 p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_70px_-34px_rgba(109,110,176,0.6)]">
                <div className="grid h-12 w-12 place-items-center rounded-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" style={{ background: "var(--gradient-brand)" }}>
                  <r.icon size={22} className="text-white" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-ink">{r.title}</h3>
                <p className="mt-2 text-sm text-ink-soft">{r.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* stats */}
        <div className="mt-8 grid gap-5 rounded-[1.6rem] border border-border bg-white/50 p-8 backdrop-blur-xl sm:grid-cols-3">
          {[
            { n: 20000, s: "+", l: "Subscriptions delivered" },
            { n: 60, s: "%", l: "Average savings" },
            { n: 99, s: "%", l: "Satisfaction rate" },
          ].map((stat) => (
            <div key={stat.l} className="text-center">
              <p className="font-display text-4xl font-semibold text-brand-deep md:text-5xl">
                <CountUp to={stat.n} suffix={stat.s} />
              </p>
              <p className="mt-1 text-sm text-ink-soft">{stat.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Testimonials ---------- */
export function Testimonials() {
  const { data } = useTestimonials();
  const list = data && data.length
    ? data
    : fallbackTestimonials.map((t, i) => ({ ...t, id: String(i), avatar_url: "", rating: 5 }));
  if (!list.length) return null;
  const row = [...list, ...list];
  return (
    <section className="overflow-hidden py-20" id="testimonials">
      <div className="px-4">
        <SectionHeading center eyebrow="Loved by members" title="What people say" subtitle="Join thousands who upgraded their AI stack for less." />
      </div>
      <div className="relative mt-14">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#fff2e0] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#fff2e0] to-transparent" />
        <div className="flex w-max animate-marquee gap-5 hover:[animation-play-state:paused]">
          {row.map((t, i) => (
            <div key={i} className="w-[340px] shrink-0 rounded-2xl border border-border bg-white/55 p-6 backdrop-blur-xl">
              <div className="flex text-brand">{Array.from({ length: Math.max(1, Math.min(5, (t as { rating?: number }).rating ?? 5)) }).map((_, j) => <span key={j}>★</span>)}</div>
              <p className="mt-4 text-[15px] leading-relaxed text-ink">"{t.quote}"</p>
              <div className="mt-5 flex items-center gap-3">
                {(t as { avatar_url?: string }).avatar_url ? (
                  <img src={(t as { avatar_url?: string }).avatar_url} alt={t.name} className="h-10 w-10 shrink-0 rounded-full object-cover" />
                ) : (
                  <div className="grid h-10 w-10 place-items-center rounded-full font-display font-semibold text-white" style={{ background: "var(--gradient-brand)" }}>
                    {t.name[0]}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-ink">{t.name}</p>
                  <p className="text-xs text-ink-soft">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
export function FAQSection({ items = faqs }: { items?: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="px-4 py-20" id="faq">
      <div className="mx-auto max-w-3xl">
        <SectionHeading center eyebrow="Questions" title="Frequently asked" />
        <div className="mt-12 space-y-3">
          {items.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.04}>
              <div className="overflow-hidden rounded-2xl border border-border bg-white/55 backdrop-blur-xl">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-display text-lg font-medium text-ink">{f.q}</span>
                  <ChevronDown size={18} className={`shrink-0 text-brand-deep transition-transform duration-300 ${open === i ? "rotate-180" : ""}`} />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-5 text-ink-soft">{f.a}</p>
                </motion.div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Contact ---------- */
export function Contact() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    });
    setLoading(false);
    if (error) {
      toast.error("Message send nahi ho saka. Dobara try karein.");
      return;
    }
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    toast.success("Aap ka message mil gaya — hum jald reply karenge!");
  };

  return (
    <section className="px-4 py-20" id="contact">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-border bg-white/50 backdrop-blur-xl">
        <div className="grid md:grid-cols-2">
          <div className="relative p-8 md:p-12" style={{ background: "var(--gradient-soft)" }}>
            <SectionHeading eyebrow="Get in touch" title="Let's talk" subtitle="Questions about a tool or a bulk order? We reply fast." />
            <div className="mt-8 space-y-4 text-sm text-ink-soft">
              <p className="flex items-center gap-3"><Mail size={16} className="text-brand-deep" /> hello@aivault.com</p>
              <p className="flex items-center gap-3"><Headphones size={16} className="text-brand-deep" /> 24/7 live chat support</p>
              <p className="flex items-center gap-3"><ShieldCheck size={16} className="text-brand-deep" /> Money-back guarantee</p>
            </div>
          </div>
          <form onSubmit={submit} className="space-y-4 p-8 md:p-12">
            <Field label="Name"><input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} maxLength={100} className="w-full rounded-xl border border-border bg-white/70 px-4 py-3 text-ink outline-none focus:border-brand" placeholder="Your name" /></Field>
            <Field label="Email"><input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} maxLength={255} className="w-full rounded-xl border border-border bg-white/70 px-4 py-3 text-ink outline-none focus:border-brand" placeholder="you@email.com" /></Field>
            <Field label="Message"><textarea required value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} maxLength={1000} rows={4} className="w-full resize-none rounded-xl border border-border bg-white/70 px-4 py-3 text-ink outline-none focus:border-brand" placeholder="How can we help?" /></Field>
            <Magnetic>
              <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-70" style={{ background: "var(--gradient-brand)" }}>
                {loading && <Loader2 size={15} className="animate-spin" />}
                {sent ? "Message sent ✓" : "Send message"}
              </button>
            </Magnetic>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-soft">{label}</span>
      {children}
    </label>
  );
}

/* ---------- CTA band ---------- */
export function CTABand() {
  return (
    <section className="px-4 py-16">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] p-10 text-center md:p-16" style={{ background: "var(--gradient-brand)" }}>
        <div className="pointer-events-none absolute -left-10 -top-10 h-56 w-56 rounded-full bg-white/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-10 h-64 w-64 rounded-full bg-white/15 blur-2xl" />
        <Reveal>
          <h2 className="relative font-display text-4xl font-semibold text-white md:text-5xl text-balance">Ready to upgrade your AI workflow?</h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="relative mx-auto mt-4 max-w-lg text-white/85">Join thousands of members getting premium AI for a fraction of the price.</p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Magnetic>
              <a href="#tools" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-brand-deep transition-transform hover:scale-[1.03]">
                Browse Tools <ArrowRight size={16} />
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#contact" className="inline-flex items-center rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                Contact Us
              </a>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
