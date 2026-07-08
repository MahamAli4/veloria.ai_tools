import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import type { Tool } from "@/data/tools";
import { ToolLogo } from "./primitives";
import { OrderDialog } from "./OrderDialog";

export function ToolCard({ tool, index = 0 }: { tool: Tool; index?: number }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 150, damping: 15 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 150, damping: 15 });

  const discount = Math.round(((tool.originalPrice - tool.ourPrice) / tool.originalPrice) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onMouseLeave={() => {
          mx.set(0);
          my.set(0);
        }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="group relative flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-border bg-white/55 p-6 backdrop-blur-xl transition-shadow duration-500 hover:shadow-[0_40px_90px_-40px_rgba(109,110,176,0.7)]"
      >
        {/* glow border on hover */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[1.6rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ boxShadow: "inset 0 0 0 1.5px rgba(137,138,196,0.55)" }}
        />

        <div className="flex items-start justify-between" style={{ transform: "translateZ(30px)" }}>
          <ToolLogo mark={tool.mark} gradient={tool.gradient} size={54} className="transition-transform duration-500 group-hover:scale-110" />
          <span className="rounded-full bg-brand/12 px-3 py-1 text-xs font-semibold text-brand-deep">
            −{discount}%
          </span>
        </div>

        <div className="mt-5" style={{ transform: "translateZ(20px)" }}>
          <p className="text-xs font-medium uppercase tracking-wider text-brand-deep">{tool.category}</p>
          <h3 className="mt-1 font-display text-2xl font-semibold text-ink">{tool.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{tool.description}</p>
        </div>

        <ul className="mt-4 space-y-1.5">
          {tool.benefits.slice(0, 3).map((b) => (
            <li key={b} className="flex items-center gap-2 text-sm text-ink-soft">
              <Check size={14} className="text-brand" /> {b}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-end justify-between pt-6">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-semibold text-ink">${tool.ourPrice}</span>
              <span className="text-sm text-ink-soft line-through opacity-60">${tool.originalPrice}</span>
            </div>
            <p className="text-xs text-ink-soft">{tool.duration}</p>
          </div>
          <OrderDialog tool={tool}>
            <button
              type="button"
              className="group/btn inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Get
              <ArrowRight size={15} className="transition-transform group-hover/btn:translate-x-0.5" />
            </button>
          </OrderDialog>
        </div>
      </motion.div>
    </motion.div>
  );
}
