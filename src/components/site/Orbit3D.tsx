import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { tools } from "@/data/tools";
import { ToolLogo } from "./primitives";

/**
 * A genuine 3D scene: two rings of tool logos orbiting in real perspective
 * space, tilted on the X axis, continuously rotating, and reacting to the
 * pointer. Each tile is counter-rotated so it always faces the viewer.
 */
type OrbitTile = { slug: string; size: number };

function Ring({
  slugs,
  radius,
  duration,
  reverse = false,
  tileSize,
}: {
  slugs: string[];
  radius: number;
  duration: number;
  reverse?: boolean;
  tileSize: number;
}) {
  const count = slugs.length;
  return (
    <div
      className={reverse ? "orbit-ring orbit-ring--rev" : "orbit-ring"}
      style={{ ["--dur" as string]: `${duration}s` }}
    >
      {slugs.map((slug, i) => {
        const tool = tools.find((t) => t.slug === slug);
        if (!tool) return null;
        const angle = (360 / count) * i;
        return (
          <div
            key={slug}
            className="orbit-item"
            style={{
              transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
            }}
          >
            {/* counter-spin keeps the tile facing forward */}
            <div
              className={reverse ? "orbit-face orbit-face--rev" : "orbit-face"}
              style={{ ["--dur" as string]: `${duration}s` }}
            >
              <div className="glass flex items-center gap-2.5 rounded-2xl p-2.5 pr-4 shadow-[0_24px_60px_-24px_rgba(109,110,176,0.7)]">
                <ToolLogo mark={tool.mark} gradient={tool.gradient} size={tileSize} />
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold leading-tight text-ink">{tool.name}</p>
                  <p className="text-[11px] leading-tight text-ink-soft">
                    <span className="font-semibold text-brand-deep">${tool.ourPrice}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Orbit3D({ className }: { className?: string }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  // pointer tilts the whole stage in 3D
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [8, -22]), { stiffness: 60, damping: 18 });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-24, 24]), { stiffness: 60, damping: 18 });

  const outer: OrbitTile[] = [
    { slug: "chatgpt-plus", size: 40 },
    { slug: "claude-pro", size: 40 },
    { slug: "lovable", size: 40 },
    { slug: "cursor-ai", size: 40 },
    { slug: "perplexity-pro", size: 40 },
    { slug: "google-ai-pro", size: 40 },
  ];
  const inner: OrbitTile[] = [
    { slug: "linkedin-premium", size: 34 },
    { slug: "lovable", size: 34 },
    { slug: "chatgpt-plus", size: 34 },
    { slug: "claude-pro", size: 34 },
  ];

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
      {/* central glow core */}
      <div className="orbit-core" aria-hidden />

      <motion.div
        className="orbit-world"
        style={{ rotateX: rotX, rotateY: rotY }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <Ring slugs={outer.map((t) => t.slug)} radius={240} duration={26} tileSize={40} />
        <Ring slugs={inner.map((t) => t.slug)} radius={140} duration={18} reverse tileSize={34} />
      </motion.div>
    </div>
  );
}
