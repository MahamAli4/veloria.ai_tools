import { Link } from "@tanstack/react-router";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Magnetic } from "./primitives";
import { Orbit3D } from "./Orbit3D";


export function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const words = "Upgrade Your AI Workflow.".split(" ");

  return (
    <section
      className="relative overflow-hidden px-4 pb-16 pt-36 md:pt-44"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
    >
      {/* soft aura backgrounds */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-24 h-[420px] w-[720px] -translate-x-1/2 rounded-full opacity-60 blur-[100px]" style={{ background: "radial-gradient(circle, #c0c9ee, transparent 70%)" }} />
        <div className="absolute right-10 top-72 h-72 w-72 rounded-full opacity-50 blur-[90px]" style={{ background: "radial-gradient(circle, #a2aadb, transparent 70%)" }} />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        {/* Copy */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white/50 px-4 py-1.5 text-xs font-medium text-ink-soft backdrop-blur"
          >
            <Sparkles size={13} className="text-brand" />
            Premium AI subscriptions, up to 60% off
          </motion.div>

          <h1 className="mt-6 font-display text-[3.1rem] font-semibold leading-[0.98] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            {words.map((w, i) => (
              <span key={i} className="mr-3 inline-block overflow-hidden align-top">
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.15 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                >
                  {w === "Workflow." ? (
                    <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                      {w}
                    </span>
                  ) : (
                    w
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-6 max-w-md text-lg text-ink-soft"
          >
            Access premium AI tools at affordable subscription prices — original accounts, delivered in minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.62 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <Link
                to="/tools"
                className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-[0_16px_40px_-14px_rgba(109,110,176,0.8)] transition-transform hover:scale-[1.03]"
                style={{ background: "var(--gradient-brand)" }}
              >
                Browse Tools
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                to="/compare"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white/50 px-7 py-3.5 text-sm font-semibold text-ink backdrop-blur transition-colors hover:bg-white/80"
              >
                Compare Plans
              </Link>
            </Magnetic>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-10 flex items-center gap-6 text-sm text-ink-soft"
          >
            <div><span className="font-display text-2xl font-semibold text-ink">12+</span><br />AI tools</div>
            <div className="h-8 w-px" style={{ background: "var(--hairline)" }} />
            <div><span className="font-display text-2xl font-semibold text-ink">20k+</span><br />happy users</div>
            <div className="h-8 w-px" style={{ background: "var(--hairline)" }} />
            <div><span className="font-display text-2xl font-semibold text-ink">4.9</span><br />avg rating</div>
          </motion.div>
        </div>

        {/* Real 3D orbit scene */}
        <Orbit3D className="hidden lg:flex" />
      </div>
    </section>
  );
}
