import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Login — AI Vault" },
      { name: "description", content: "Sign in to manage AI Vault tools, orders and messages." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        toast.success("Account ban gaya! Ab aap admin ho.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        toast.success("Welcome back!");
      }
      navigate({ to: "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kuch ghalat ho gaya.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-28">
      <div className="rounded-[2rem] border border-border bg-white/60 p-8 backdrop-blur-xl">
        <div className="grid h-12 w-12 place-items-center rounded-xl text-white" style={{ background: "var(--gradient-brand)" }}>
          <ShieldCheck size={22} />
        </div>
        <h1 className="mt-5 font-display text-3xl font-semibold text-ink">
          {mode === "login" ? "Admin sign in" : "Create admin account"}
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Manage your tools, orders and messages from one place.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-1 rounded-full border border-border bg-white/50 p-1 text-sm">
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-full py-2 font-medium transition-colors ${mode === m ? "bg-white text-ink shadow-sm" : "text-ink-soft"}`}
            >
              {m === "login" ? "Sign in" : "Sign up"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-xl border border-border bg-white/70 px-4 py-3 text-sm text-ink outline-none focus:border-brand" />
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} placeholder="Password" className="w-full rounded-xl border border-border bg-white/70 px-4 py-3 text-sm text-ink outline-none focus:border-brand" />
          <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-70" style={{ background: "var(--gradient-brand)" }}>
            {loading && <Loader2 size={15} className="animate-spin" />}
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
        <p className="mt-4 text-xs text-ink-soft">
          Note: Sab se pehle sign up karne wala account automatically admin ban jata hai.
        </p>
      </div>
    </section>
  );
}
