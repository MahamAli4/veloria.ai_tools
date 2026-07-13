import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowRight, Sparkles, ArrowUpRight } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { Magnetic } from "./primitives";
import type { Tool } from "@/data/tools";
import { useTools } from "@/lib/tools";
import { useSiteStats } from "@/lib/stats";

// Round down to a clean "+" milestone (e.g. 36 -> "30+", 5432 -> "5000+")
function niceCount(n: number): string {
  if (n <= 0) return "0";
  if (n < 10) return `${n}`;
  if (n < 100) return `${Math.floor(n / 10) * 10}+`;
  if (n < 1000) return `${Math.floor(n / 100) * 100}+`;
  return `${Math.floor(n / 1000) * 1000}+`;
}

const headlineTop = ["Premium", "AI", "Tools"];
const headlineBottom = ["Without", "Premium", "Prices"];





/* one premium acrylic product card */
function ProductCard({ tool }: { tool: Tool }) {
  return (
    <a
      href="#tools"
      className="acrylic-card group block"
    >
      <div className="flex items-center gap-3">
        <span className="acrylic-mark" style={{ background: tool.gradient }}>
          {tool.mark}
        </span>
        <div className="min-w-0">
          <div className="truncate font-display text-[15px] font-semibold leading-tight text-foreground">
            {tool.name}
          </div>
          <div className="truncate text-[11px] uppercase tracking-wide text-muted-foreground">
            {tool.category}
          </div>
        </div>
        <span className="acrylic-badge ml-auto">Available</span>
      </div>

      <p className="mt-3 line-clamp-2 text-[12.5px] leading-relaxed text-muted-foreground">
        {tool.description}
      </p>

      <div className="mt-4 flex items-end justify-between">
        <span className="text-[11px] font-medium text-brand-deep">Fully guided</span>
        <span className="acrylic-cta">
          View <ArrowUpRight size={13} />
        </span>
      </div>
    </a>
  );
}

/* an infinite vertical marquee column of cards */
function CardColumn({ items, direction }: { items: Tool[]; direction: "up" | "down" }) {
  const loop = [...items, ...items];
  return (
    <div className="acrylic-col">
      <div className={direction === "up" ? "acrylic-track-up" : "acrylic-track-down"}>
        {loop.map((t, i) => (
          <ProductCard key={`${t.slug}-${i}`} tool={t} />
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const { data: tools = [] } = useTools();
  const { data: siteStats } = useSiteStats();
  const stats = [
    { value: niceCount(siteStats?.tools ?? tools.length), label: "Premium AI Tools" },
    { value: niceCount(siteStats?.customers ?? 0), label: "Customers" },
    { value: "24/7", label: "Support" },
  ];
  const { colA, colB } = useMemo(() => {
    const list = tools.slice(0, 9);
    return {
      colA: list.filter((_, i) => i % 2 === 0),
      colB: list.filter((_, i) => i % 2 === 1),
    };
  }, [tools]);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [10, -10]), { stiffness: 120, damping: 20 });
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [-8, 8]), { stiffness: 120, damping: 20 });

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mx.set((e.clientX - r.left) / r.width - 0.5);
      my.set((e.clientY - r.top) / r.height - 0.5);
    };
    const onLeave = () => {
      mx.set(0);
      my.set(0);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [mx, my]);

  return (
    <section className="relative overflow-hidden">
      {/* soft luxury background accents */}
      <div className="hero-glow hero-glow-1" aria-hidden />
      <div className="hero-glow hero-glow-2" aria-hidden />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-28 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pt-36">
        {/* LEFT — editorial */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur"
          >
            <Sparkles size={13} className="text-primary" />
            Curated premium AI subscriptions
          </motion.div>

          <h1 className="mt-6 font-display text-[3.1rem] font-semibold leading-[0.98] tracking-tight text-foreground sm:text-6xl lg:text-[4.6rem]">
            {[headlineTop, headlineBottom].map((line, li) => (
              <span key={li} className="block">
                {line.map((w, i) => (
                  <span key={i} className="mr-[0.28em] inline-block overflow-hidden align-top pb-[0.08em]">
                    <span
                      className="hero-word inline-block"
                      style={{ animationDelay: `${0.15 + (li * line.length + i) * 0.08}s` }}
                    >
                      {li === 1 && w === "Premium" ? (
                        <span className="italic text-primary">{w}</span>
                      ) : (
                        w
                      )}
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground"
          >
            We help you get subscriptions to the world&apos;s best digital tools — with full
            guidance on how to get them for less, plus fast delivery and trusted support.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <a
                href="#tools"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold text-background shadow-[0_16px_40px_-16px_rgba(30,25,45,0.6)] transition-transform hover:scale-[1.03]"
              >
                Browse Tools
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#faq"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-7 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:bg-card"
              >
                Learn more
              </a>
            </Magnetic>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 flex max-w-md items-center gap-8 border-t border-border pt-8"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-3xl font-semibold text-foreground">{s.value}</dt>
                <dd className="mt-1 text-xs leading-tight text-muted-foreground">{s.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* RIGHT — floating acrylic showcase */}
        <div ref={stageRef} className="relative hidden lg:block" style={{ perspective: "1400px" }}>
          <motion.div
            style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
            className="acrylic-stage"
          >
            <div className="acrylic-grid">
              <CardColumn items={colA} direction="up" />
              <CardColumn items={colB} direction="down" />
            </div>
          </motion.div>
          <div className="acrylic-mask-top" aria-hidden />
          <div className="acrylic-mask-bottom" aria-hidden />
        </div>
      </div>
    </section>
  );
}
