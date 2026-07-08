import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { tools } from "@/data/tools";
import { ToolCard } from "@/components/site/ToolCard";
import { SectionHeading, CTABand } from "@/components/site/sections";
import { Reveal } from "@/components/site/primitives";

export const Route = createFileRoute("/tools/")({
  head: () => ({
    meta: [
      { title: "All AI Tools — AI Vault" },
      { name: "description", content: "Browse every premium AI subscription on AI Vault — ChatGPT, Claude, Lovable, Cursor, Canva Pro and more at up to 60% off." },
      { property: "og:title", content: "All AI Tools — AI Vault" },
      { property: "og:description", content: "Browse every premium AI subscription at up to 60% off." },
    ],
  }),
  component: ToolsPage,
});

function ToolsPage() {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(tools.map((t) => t.category)))],
    [],
  );
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? tools : tools.filter((t) => t.category === active);

  return (
    <>
      <section className="px-4 pb-8 pt-36 md:pt-44">
        <div className="mx-auto max-w-6xl">
          <SectionHeading center eyebrow="The full collection" title="Every premium AI tool" subtitle="Original accounts, instant delivery, honest prices." />

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                  active === c
                    ? "border-transparent text-white shadow-[0_10px_24px_-10px_rgba(109,110,176,0.7)]"
                    : "border-border bg-white/50 text-ink-soft hover:text-ink"
                }`}
                style={active === c ? { background: "var(--gradient-brand)" } : undefined}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t, i) => (
            <ToolCard key={t.slug} tool={t} index={i} />
          ))}
        </div>
        {filtered.length === 0 && (
          <Reveal><p className="mt-10 text-center text-ink-soft">No tools in this category yet.</p></Reveal>
        )}
      </section>

      <CTABand />
    </>
  );
}
