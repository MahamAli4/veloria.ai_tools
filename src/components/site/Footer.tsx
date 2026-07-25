import { useState } from "react";
import { Facebook, Linkedin, Instagram, Twitter, ArrowUpRight, Mail, ShieldCheck, Zap } from "lucide-react";
import veloriaLogoLight from "@/assets/veloria-logo-light.png.asset.json";

export function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <footer className="relative mt-24 overflow-hidden px-4 pb-6 pt-10" style={{ background: "#153179" }}>
      {/* soft ambient glows */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        {/* Newsletter */}
        <div
          className="relative overflow-hidden rounded-[2rem] p-6 md:p-8"
          style={{ background: "var(--gradient-brand)" }}
        >

          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/20 blur-2xl" />
          <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90">
                <Mail size={13} /> Newsletter
              </div>
              <h3 className="font-display text-3xl font-semibold text-white md:text-4xl">
                Get smart subscription tips.
              </h3>
              <p className="mt-3 max-w-md text-white/80">
                New guides and money-saving tips for AI & digital tools, straight to your inbox. No spam, ever.
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setDone(true);
              }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full rounded-full border border-white/30 bg-white/15 px-5 py-3.5 text-white placeholder:text-white/60 outline-none focus:border-white/60"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-brand-deep transition-transform hover:scale-[1.03]"
              >
                {done ? "Subscribed ✓" : "Subscribe"}
              </button>
            </form>
          </div>
        </div>

        {/* Main grid: brand + links */}
        <div className="mt-10 grid items-center gap-8 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <a href="#top" className="flex items-center gap-0">
              <img
                src="/favicon.png"
                alt="AI Vault logo"
                className="h-10 w-auto object-contain md:h-12"
              />
              <img
                src="/favicon-text.png"
                alt="Veloria.AI"
                className="h-6 w-auto object-contain md:h-8"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </a>

            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/70">
              We help you get AI & digital tool subscriptions the smart way — with honest tips, ideas and full guidance to save money.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/80">
                <ShieldCheck size={13} /> Trusted guidance
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/80">
                <Zap size={13} /> Fast support
              </span>
            </div>
          </div>

          <FooterCol title="Explore" items={[["Tools", "/#tools"], ["Playbook", "/guide"], ["How it works", "/#how"], ["FAQ", "/#faq"]]} />
          <FooterCol title="Company" items={[["Reviews", "/#testimonials"], ["Contact", "/#contact"]]} />
          <FooterCol title="Legal" items={[["Terms", "/terms"], ["Privacy", "/privacy"], ["Refunds", "/refund"]]} />

        </div>

        <div className="my-6 h-px w-full bg-white/15" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="text-sm text-white/60">© {new Date().getFullYear()} Veloria.AI. All rights reserved.</p>
            <p className="mt-1 text-xs text-white/40">Support: <a href="mailto:support@veloria-ai.com" className="hover:text-white transition-colors">support@veloria-ai.com</a></p>
          </div>
          <div className="flex items-center gap-2">
            {[
              { Icon: Linkedin, href: "https://www.linkedin.com/company/135236497/", label: "LinkedIn" },
              { Icon: Facebook, href: "https://www.facebook.com/profile.php?id=61592557285546", label: "Facebook" },
              { Icon: Instagram, href: "https://www.instagram.com/veloriaai30/", label: "Instagram" },
              { Icon: Twitter, href: "https://x.com/Veloriaai", label: "Twitter" },
              { Icon: Mail, href: "mailto:veloriaai30@gmail.com", label: "Email" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white/80 transition-all hover:scale-110 hover:bg-white/20 hover:text-white"
                aria-label={label}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-6 border-t border-white/10 pt-4 text-center">
          <p className="text-[11px] leading-relaxed text-white/40 max-w-3xl mx-auto">
            Disclaimer: Veloria.AI is not affiliated with, associated with, or endorsed by OpenAI, Canva, Midjourney, or any other trademark owners. All product names, logos, and brands are property of their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {items.map(([label, to]) => (
          <li key={label}>
            <a
              href={to}
              className="group inline-flex items-center gap-1 text-sm text-white/70 transition-colors hover:text-white"
            >
              {label}
              <ArrowUpRight size={13} className="opacity-0 transition-opacity group-hover:opacity-100" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
