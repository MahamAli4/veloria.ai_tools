import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Check, ArrowLeft, ArrowRight, Star, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { getTool, tools, type Tool } from "@/data/tools";
import { ToolLogo, Reveal, Magnetic } from "@/components/site/primitives";
import { ToolCard } from "@/components/site/ToolCard";
import { FAQSection, SectionHeading } from "@/components/site/sections";

export const Route = createFileRoute("/tools/$slug")({
  loader: ({ params }) => {
    const tool = getTool(params.slug);
    if (!tool) throw notFound();
    return { tool };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Tool not found — AI Vault" }, { name: "robots", content: "noindex" }] };
    const { tool } = loaderData;
    return {
      meta: [
        { title: `${tool.name} — AI Vault` },
        { name: "description", content: tool.description },
        { property: "og:title", content: `${tool.name} — ${tool.tagline}` },
        { property: "og:description", content: tool.description },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center px-4 pt-24 text-center">
      <div>
        <h1 className="font-display text-4xl font-semibold text-ink">Tool not found</h1>
        <Link to="/tools" className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white" style={{ background: "var(--gradient-brand)" }}>
          Back to tools
        </Link>
      </div>
    </div>
  ),
  component: ToolDetail,
});

function ToolDetail() {
  const { tool } = Route.useLoaderData() as { tool: Tool };
  const discount = Math.round(((tool.originalPrice - tool.ourPrice) / tool.originalPrice) * 100);
  const related = tools.filter((t) => t.category === tool.category && t.slug !== tool.slug).slice(0, 3);
  const fallbackRelated = related.length ? related : tools.filter((t) => t.slug !== tool.slug).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-12 pt-36 md:pt-44">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-24 h-96 w-96 rounded-full opacity-50 blur-[110px]" style={{ background: tool.gradient }} />
        </div>
        <div className="mx-auto max-w-6xl">
          <Link to="/tools" className="inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink">
            <ArrowLeft size={15} /> All tools
          </Link>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-start">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex items-center gap-4">
                <ToolLogo mark={tool.mark} gradient={tool.gradient} size={72} />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-brand-deep">{tool.category}</p>
                  <h1 className="font-display text-4xl font-semibold text-ink md:text-5xl">{tool.name}</h1>
                </div>
              </motion.div>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="mt-6 max-w-xl text-lg text-ink-soft">
                {tool.overview}
              </motion.p>
              <div className="mt-6 flex flex-wrap gap-2">
                {tool.benefits.map((b) => (
                  <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/50 px-3 py-1.5 text-xs font-medium text-ink-soft">
                    <Check size={13} className="text-brand" /> {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Purchase card */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="rounded-[1.6rem] border border-border bg-white/60 p-7 backdrop-blur-xl shadow-[0_40px_90px_-40px_rgba(109,110,176,0.6)]">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-brand/12 px-3 py-1 text-xs font-semibold text-brand-deep">Save {discount}%</span>
                <div className="flex items-center gap-1 text-sm text-brand"><Star size={14} fill="currentColor" /> 4.9</div>
              </div>
              <div className="mt-5 flex items-baseline gap-3">
                <span className="font-display text-5xl font-semibold text-ink">${tool.ourPrice}</span>
                <span className="text-lg text-ink-soft line-through opacity-60">${tool.originalPrice}</span>
              </div>
              <p className="text-sm text-ink-soft">{tool.duration}</p>
              <Magnetic className="mt-6">
                <button className="w-full rounded-full py-4 text-sm font-semibold text-white transition-transform hover:scale-[1.02]" style={{ background: "var(--gradient-brand)" }}>
                  Purchase now
                </button>
              </Magnetic>
              <div className="mt-5 space-y-2.5 text-sm text-ink-soft">
                <p className="flex items-center gap-2"><ShieldCheck size={15} className="text-brand" /> Original, warrantied account</p>
                <p className="flex items-center gap-2"><Zap size={15} className="text-brand" /> Delivered within minutes</p>
                <p className="flex items-center gap-2"><Sparkles size={15} className="text-brand" /> Full premium features</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Overview blocks */}
      <section className="px-4 py-12">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <InfoBlock title="What this tool does" body={tool.whatItDoes} />
          <InfoBlock title="Who should use it" body={tool.whoFor} />
        </div>
      </section>

      {/* Features + advantages */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Deep dive" title="Key features & advantages" />
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <ListCard title="Key Features" items={tool.features} />
            <ListCard title="Advantages" items={tool.advantages} />
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="In practice" title="Use cases" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tool.useCases.map((u, i) => (
              <Reveal key={u} delay={i * 0.06}>
                <div className="h-full rounded-2xl border border-border bg-white/55 p-6 backdrop-blur-xl">
                  <span className="font-display text-2xl font-semibold text-brand-deep">0{i + 1}</span>
                  <p className="mt-3 font-medium text-ink">{u}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <SectionHeading center eyebrow="Pricing" title="Subscription plans" subtitle="Longer plans, deeper savings. Cancel anytime." />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {tool.plans.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.08}>
                <div className={`relative h-full rounded-[1.6rem] border p-7 backdrop-blur-xl ${p.highlighted ? "border-transparent text-white shadow-[0_40px_90px_-40px_rgba(109,110,176,0.7)]" : "border-border bg-white/55"}`} style={p.highlighted ? { background: "var(--gradient-brand)" } : undefined}>
                  {p.highlighted && <span className="absolute right-6 top-6 rounded-full bg-white/25 px-3 py-1 text-xs font-semibold">Popular</span>}
                  <p className={`text-sm font-medium ${p.highlighted ? "text-white/80" : "text-ink-soft"}`}>{p.name}</p>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="font-display text-4xl font-semibold">${p.price}</span>
                    <span className={p.highlighted ? "text-white/70" : "text-ink-soft"}>/ {p.duration}</span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {p.features.map((f) => (
                      <li key={f} className={`flex items-center gap-2 text-sm ${p.highlighted ? "text-white/90" : "text-ink-soft"}`}>
                        <Check size={15} className={p.highlighted ? "text-white" : "text-brand"} /> {f}
                      </li>
                    ))}
                  </ul>
                  <button className={`mt-7 w-full rounded-full py-3.5 text-sm font-semibold transition-transform hover:scale-[1.02] ${p.highlighted ? "bg-white text-brand-deep" : "text-white"}`} style={p.highlighted ? undefined : { background: "var(--gradient-brand)" }}>
                    Choose {p.name}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FAQSection items={[...tool.faqs, { q: "What is your refund policy?", a: "If we can't deliver a working subscription, you're fully refunded — no questions asked." }]} />

      {/* Related */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="You might also like" title="Related tools" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fallbackRelated.map((t, i) => (
              <ToolCard key={t.slug} tool={t} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-8">
        <div className="mx-auto max-w-6xl">
          <Link to="/compare" className="group inline-flex items-center gap-2 text-sm font-semibold text-brand-deep">
            Compare all plans <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
}

function InfoBlock({ title, body }: { title: string; body: string }) {
  return (
    <Reveal>
      <div className="h-full rounded-[1.6rem] border border-border bg-white/55 p-8 backdrop-blur-xl">
        <h3 className="font-display text-2xl font-semibold text-ink">{title}</h3>
        <p className="mt-3 leading-relaxed text-ink-soft">{body}</p>
      </div>
    </Reveal>
  );
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Reveal>
      <div className="h-full rounded-[1.6rem] border border-border bg-white/55 p-8 backdrop-blur-xl">
        <h3 className="font-display text-2xl font-semibold text-ink">{title}</h3>
        <ul className="mt-5 space-y-3">
          {items.map((f) => (
            <li key={f} className="flex items-start gap-3 text-ink-soft">
              <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full" style={{ background: "var(--gradient-brand)" }}>
                <Check size={12} className="text-white" />
              </span>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
