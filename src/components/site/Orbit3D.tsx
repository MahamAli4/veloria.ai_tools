import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { tools } from "@/data/tools";
import { ToolLogo } from "./primitives";

/**
 * A genuine 3D scene built in real perspective space. Cards are positioned
 * with translate3d on different depth planes, gently float, and the whole
 * "world" tilts toward the pointer on the X/Y axes — so you get real
 * parallax and depth, while every card stays readable (front-facing).
 */
type Node = {
  slug: string;
  x: number; // px
  y: number; // px
  z: number; // px depth (+ = closer)
  size: number;
  delay: number;
};

const nodes: Node[] = [
  { slug: "chatgpt-plus", x: 40, y: -170, z: 120, size: 48, delay: 0 },
  { slug: "claude-pro", x: 210, y: -60, z: 30, size: 44, delay: 0.5 },
  { slug: "lovable", x: -190, y: -110, z: 60, size: 46, delay: 0.9 },
  { slug: "cursor-ai", x: -60, y: 40, z: 180, size: 50, delay: 0.3 },
  { slug: "perplexity-pro", x: 180, y: 150, z: 90, size: 44, delay: 1.2 },
  { slug: "google-ai-pro", x: -210, y: 120, z: -20, size: 42, delay: 0.7 },
  { slug: "linkedin-premium", x: 30, y: 200, z: -60, size: 40, delay: 1.5 },
];

export function Orbit3D({ className }: { className?: string }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [16, -16]), { stiffness: 70, damping: 18 });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-22, 22]), { stiffness: 70, damping: 18 });

  return (
    <div
      className={`orbit-stage ${className ?? ""}`}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <div className="orbit-core" aria-hidden />

      <motion.div
        className="orbit-world"
        style={{ rotateX: rotX, rotateY: rotY }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        {nodes.map((n) => {
          const tool = tools.find((t) => t.slug === n.slug);
          if (!tool) return null;
          const scale = 1 + n.z / 900;
          return (
            <motion.div
              key={n.slug + n.x}
              className="orbit-node"
              style={{ transform: `translate3d(${n.x}px, ${n.y}px, ${n.z}px) scale(${scale})` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 + n.delay * 0.25 }}
            >
              <div className="orbit-float" style={{ animationDelay: `${n.delay}s` }}>
                <div className="glass flex items-center gap-2.5 rounded-2xl p-2.5 pr-4 shadow-[0_28px_70px_-24px_rgba(109,110,176,0.75)]">
                  <ToolLogo mark={tool.mark} gradient={tool.gradient} size={n.size} />
                  <div>
                    <p className="text-xs font-semibold leading-tight text-ink">{tool.name}</p>
                    <p className="text-[11px] leading-tight text-ink-soft">
                      <span className="font-semibold text-brand-deep">${tool.ourPrice}</span>{" "}
                      <span className="line-through opacity-60">${tool.originalPrice}</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
