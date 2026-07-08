import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Minus, ArrowRight } from "lucide-react";
import { tools } from "@/data/tools";
import { ToolLogo, Reveal } from "@/components/site/primitives";
import { SectionHeading, CTABand } from "@/components/site/sections";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare AI Plans — AI Vault" },
      { name: "description", content: "Compare premium AI subscriptions side by side — prices, savings, categories and features across ChatGPT, Claude, Lovable, Cursor and more." },
      { property: "og:title", content: "Compare AI Plans — AI Vault" },
      { property: "og:description", content: "Compare premium AI subscriptions side by side." },
    ],
  }),
  component: ComparePage,
});

const featureRows: { label: string; check: (slug: string) => boolean }[] = [
  { label: "Original account", check: () => true },
  { label: "Instant delivery", check: () => true },
  { label: "Priority support", check: () => true },
  { label: "AI coding features", check: (s) => ["cursor-ai", "github-copilot", "lovable"].includes(s) },
  { label: "Image / media generation", check: (s) => ["chatgpt-plus", "canva-pro", "adobe-creative-cloud", "google-ai-pro"].includes(s) },
  { label: "Live web access", check: (s) => ["perplexity-pro", "google-ai-pro", "chatgpt-plus"].includes(s) },
  { label: "Long-context reasoning", check: (s) => ["claude-pro", "chatgpt-plus", "google-ai-pro"].includes(s) },
];

function ComparePage() {
  const list = tools.slice(0, 9);
  return (
    <>
      <section className="px-4 pb-8 pt-36 md:pt-44">
        <div className="mx-auto max-w-6xl">
          <SectionHeading center eyebrow="Side by side" title="Compare plans" subtitle="Find the perfect AI subscription — pricing, savings, and what each unlocks." />
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="overflow-x-auto rounded-[1.6rem] border border-border bg-white/55 backdrop-blur-xl no-scrollbar">
              <table className="w-full min-w-[820px] border-collapse text-left">
                <thead className="sticky top-0 z-10">
                  <tr style={{ background: "var(--gradient-soft)" }}>
                    <th className="p-5 text-sm font-semibold text-ink-soft">Tool</th>
                    <th className="p-5 text-sm font-semibold text-ink-soft">Category</th>
                    <th className="p-5 text-sm font-semibold text-ink-soft">Our price</th>
                    <th className="p-5 text-sm font-semibold text-ink-soft">Original</th>
                    <th className="p-5 text-sm font-semibold text-ink-soft">You save</th>
                    <th className="p-5"></th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((t) => {
                    const save = Math.round(((t.originalPrice - t.ourPrice) / t.originalPrice) * 100);
                    return (
                      <tr key={t.slug} className="border-t transition-colors hover:bg-white/60" style={{ borderColor: "var(--hairline)" }}>
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <ToolLogo mark={t.mark} gradient={t.gradient} size={40} />
                            <span className="font-display text-lg font-semibold text-ink">{t.name}</span>
                          </div>
                        </td>
                        <td className="p-5 text-sm text-ink-soft">{t.category}</td>
                        <td className="p-5"><span className="font-display text-xl font-semibold text-brand-deep">${t.ourPrice}</span></td>
                        <td className="p-5 text-sm text-ink-soft line-through opacity-60">${t.originalPrice}</td>
                        <td className="p-5"><span className="rounded-full bg-brand/12 px-3 py-1 text-xs font-semibold text-brand-deep">−{save}%</span></td>
                        <td className="p-5">
                          <Link to="/tools/$slug" params={{ slug: t.slug }} className="group inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white" style={{ background: "var(--gradient-brand)" }}>
                            View <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Reveal>

          {/* Feature matrix */}
          <div className="mt-12">
            <SectionHeading eyebrow="Feature matrix" title="What each plan unlocks" />
            <Reveal>
              <div className="mt-8 overflow-x-auto rounded-[1.6rem] border border-border bg-white/55 backdrop-blur-xl no-scrollbar">
                <table className="w-full min-w-[900px] border-collapse text-left">
                  <thead>
                    <tr style={{ background: "var(--gradient-soft)" }}>
                      <th className="p-4 text-sm font-semibold text-ink-soft">Feature</th>
                      {list.map((t) => (
                        <th key={t.slug} className="p-4 text-center">
                          <ToolLogo mark={t.mark} gradient={t.gradient} size={34} className="mx-auto" />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {featureRows.map((row) => (
                      <tr key={row.label} className="border-t" style={{ borderColor: "var(--hairline)" }}>
                        <td className="p-4 text-sm font-medium text-ink">{row.label}</td>
                        {list.map((t) => (
                          <td key={t.slug} className="p-4 text-center">
                            {row.check(t.slug) ? (
                              <span className="mx-auto grid h-6 w-6 place-items-center rounded-full" style={{ background: "var(--gradient-brand)" }}>
                                <Check size={13} className="text-white" />
                              </span>
                            ) : (
                              <Minus size={16} className="mx-auto text-ink-soft opacity-40" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}
