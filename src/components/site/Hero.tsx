import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Magnetic } from "./primitives";
import { AIUniverse } from "./AIUniverse";

const headline = ["Enter", "the", "AI", "Universe."];

export function Hero() {
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef(0);
  const sectionRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => setMounted(true), []);

  // scroll progress through the hero -> drives the camera dolly into the core
  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const h = el.offsetHeight - window.innerHeight;
      const p = h > 0 ? Math.min(Math.max(-el.getBoundingClientRect().top / h, 0), 1) : 0;
      scrollRef.current = p;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // custom glow cursor
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[190vh]"
    >
      {/* custom cursor */}
      <div ref={cursorRef} className="hero-cursor hidden md:block" aria-hidden />

      {/* sticky cinematic stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* luxury gradient + fog backdrop */}
        <div className="hero-backdrop" aria-hidden />
        <div className="hero-noise" aria-hidden />
        <div className="hero-rays" aria-hidden />

        {/* 3D universe */}
        <div className="absolute inset-0">
          {mounted && (
            <AIUniverse
              scrollRef={scrollRef}
              onSelect={(slug) => navigate({ to: "/tools/$slug", params: { slug } })}
            />
          )}
        </div>

        {/* overlay copy */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur"
          >
            <Sparkles size={13} className="text-white" />
            Premium AI subscriptions, up to 60% off
          </motion.div>

          <h1 className="mt-7 font-display text-[3.4rem] font-semibold leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl">
            {headline.map((w, i) => (
              <span key={i} className="mx-2 inline-block overflow-hidden align-top">
                <motion.span
                  className="inline-block"
                  initial={{ y: "115%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.9, delay: 0.2 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  {w === "Universe." ? (
                    <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(120deg,#e7e2ff,#b9a7ff,#ff9a8b)" }}>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-6 max-w-md text-lg text-white/70"
          >
            Every premium AI tool, orbiting one core. Original accounts, delivered in minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.05 }}
            className="pointer-events-auto mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <Magnetic>
              <Link
                to="/tools"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#241f45] shadow-[0_16px_50px_-12px_rgba(185,167,255,0.8)] transition-transform hover:scale-[1.03]"
              >
                Browse Tools
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                to="/compare"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
              >
                Compare Plans
              </Link>
            </Magnetic>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="absolute bottom-10 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/50"
          >
            Scroll to enter
            <span className="hero-scroll-dot" />
          </motion.div>
        </div>

        {/* bottom fade blends the universe into the cream sections below */}
        <div className="hero-fade" aria-hidden />
      </div>
    </section>
  );
}
