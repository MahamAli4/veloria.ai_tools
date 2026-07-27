import { motion, useScroll, useSpring, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/* Scroll-linked progress bar at the top of the page */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[60] h-[3px] w-full origin-left"
    >
      <div className="h-full w-full" style={{ background: "var(--gradient-brand)" }} />
    </motion.div>
  );
}

/* Soft cursor glow that follows the pointer (desktop only) */
export function CursorGlow() {
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-[55] hidden h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full md:block"
      style={{
        left: x,
        top: y,
        background: "radial-gradient(circle, rgba(137,138,196,0.18), transparent 65%)",
      }}
    />
  );
}

/* Scroll reveal wrapper */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* Magnetic button that leans toward the cursor */
export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 200, damping: 15 });
  const y = useSpring(my, { stiffness: 200, damping: 15 });
  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className={className}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        mx.set((e.clientX - (r.left + r.width / 2)) * 0.3);
        my.set((e.clientY - (r.top + r.height / 2)) * 0.3);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* Letter/glyph logo tile for each tool */
export function ToolLogo({
  mark,
  gradient,
  toolName = "",
  size = 56,
  className,
}: {
  mark?: string;
  gradient?: string;
  toolName?: string;
  size?: number;
  className?: string;
}) {
  const displayMark = mark && mark.trim() 
    ? mark.trim() 
    : (toolName ? toolName.trim().charAt(0).toUpperCase() : "?");

  const fallbackGradients = [
    "linear-gradient(135deg, #ff6b6b, #ff8e53)", // Red-Orange
    "linear-gradient(135deg, #4facfe, #00f2fe)", // Blue-Cyan
    "linear-gradient(135deg, #43e97b, #38f9d7)", // Green-Teal
    "linear-gradient(135deg, #fa709a, #fee140)", // Pink-Yellow
    "linear-gradient(135deg, #30cfd0, #330867)", // Teal-Purple
    "linear-gradient(135deg, #a18cd1, #fbc2eb)", // Purple-Pink
    "linear-gradient(135deg, #f093fb, #f5576c)", // Violet-Red
    "linear-gradient(135deg, #5ee7df, #b490ca)", // Soft Mint-Lavender
  ];

  const getFallbackGradient = (name: string) => {
    if (!name) return fallbackGradients[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % fallbackGradients.length;
    return fallbackGradients[index];
  };

  const rawGradient = gradient && gradient.trim() ? gradient.trim() : getFallbackGradient(toolName);

  // Check if rawGradient contains tailwind gradient classes (e.g. "from-", "to-")
  const isTailwind = rawGradient.includes("from-") || rawGradient.includes("to-");

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-2xl font-display font-semibold text-white shadow-[0_10px_30px_-10px_rgba(109,110,176,0.6)] ${
        isTailwind ? `bg-gradient-to-br ${rawGradient}` : ""
      } ${className ?? ""}`}
      style={{
        width: size,
        height: size,
        background: isTailwind ? undefined : rawGradient,
        fontSize: size * 0.42,
      }}
    >
      {displayMark}
    </div>
  );
}

/* Count-up number animation */
export function CountUp({ to, suffix = "", prefix = "" }: { to: number; suffix?: string; prefix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const dur = 1400;
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(eased * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);
  return (
    <span ref={ref}>
      {prefix}
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

export function useParallax(range = 60) {
  const { scrollYProgress } = useScroll();
  return useTransform(scrollYProgress, [0, 1], [-range, range]);
}
