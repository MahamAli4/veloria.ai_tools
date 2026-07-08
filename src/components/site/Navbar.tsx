import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Magnetic } from "./primitives";

const links = [
  { to: "#tools", label: "Tools" },
  { to: "#how", label: "How it works" },
  { to: "#testimonials", label: "Reviews" },
  { to: "#faq", label: "FAQ" },
  { to: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 transition-all duration-500 md:px-6 ${
          scrolled ? "glass shadow-[0_12px_40px_-12px_rgba(137,138,196,0.45)]" : "border border-transparent"
        }`}
      >
        <a href="#top" className="flex items-center gap-2.5">
          <span
            className="grid h-9 w-9 place-items-center rounded-xl font-display text-lg font-semibold text-white"
            style={{ background: "var(--gradient-brand)" }}
          >
            A
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-ink">AI Vault</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.to}
              href={l.to}
              className="rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Magnetic className="hidden md:block">
            <a
              href="#tools"
              className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(109,110,176,0.7)] transition-transform hover:scale-[1.03]"
              style={{ background: "var(--gradient-brand)" }}
            >
              Browse Tools
            </a>
          </Magnetic>
          <button
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-white/50 text-ink md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mx-auto mt-2 max-w-6xl rounded-2xl glass p-3 md:hidden">
          {links.map((l) => (
            <a
              key={l.to}
              href={l.to}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm font-medium text-ink"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
