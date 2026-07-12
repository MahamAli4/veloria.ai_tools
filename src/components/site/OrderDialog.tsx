import { useState } from "react";
import { Loader2, Check, MessageCircle } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tool } from "@/data/tools";

export function OrderDialog({ tool, children }: { tool: Tool; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const plans = tool.plans?.length ? tool.plans : [{ name: "Standard", price: tool.ourPrice, duration: tool.duration, features: [] }];
  const [planName, setPlanName] = useState(plans[0].name);
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "", note: "" });

  const selectedPlan = plans.find((p) => p.name === planName) ?? plans[0];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("orders").insert({
      tool_slug: tool.slug,
      tool_name: tool.name,
      plan_name: selectedPlan.name,
      price: selectedPlan.price,
      customer_name: form.name.trim(),
      customer_email: form.email.trim(),
      whatsapp: form.whatsapp.trim(),
      note: form.note.trim(),
    });
    setLoading(false);
    if (error) {
      toast.error("Order place nahi hua. Dobara koshish karein.");
      return;
    }
    setDone(true);
    toast.success("Order mil gaya! Hum aap se jald raabta karenge.");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) {
          setDone(false);
          setForm({ name: "", email: "", whatsapp: "", note: "" });
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">{done ? "Request received" : `Get ${tool.name}`}</DialogTitle>
          <DialogDescription>
            {done
              ? "Shukriya! Aap ki request mil gayi — hum aap ko guide karenge ke ye subscription kam paison mein kaise milegi."
              : "Apni details bharein — hum aap ko guide karenge ke ye subscription kam paison mein kaise le sakte hain."}
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <span className="grid h-14 w-14 place-items-center rounded-full text-white" style={{ background: "var(--gradient-brand)" }}>
              <Check size={26} />
            </span>
            <button
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full border border-border bg-white/60 px-6 py-2.5 text-sm font-semibold text-ink"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-soft">Plan</label>
              <div className="grid gap-2">
                {plans.map((p) => (
                  <button
                    type="button"
                    key={p.name}
                    onClick={() => setPlanName(p.name)}
                    className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-left text-sm transition-colors ${
                      planName === p.name ? "border-brand bg-brand/10" : "border-border bg-white/60"
                    }`}
                  >
                    <span className="font-medium text-ink">{p.name} <span className="text-ink-soft">· {p.duration}</span></span>
                  </button>
                ))}
              </div>
            </div>
            <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} maxLength={100} placeholder="Your name" className="w-full rounded-xl border border-border bg-white/70 px-4 py-3 text-sm text-ink outline-none focus:border-brand" />
            <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} maxLength={255} placeholder="Email address" className="w-full rounded-xl border border-border bg-white/70 px-4 py-3 text-sm text-ink outline-none focus:border-brand" />
            <input required value={form.whatsapp} onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))} maxLength={30} placeholder="WhatsApp number" className="w-full rounded-xl border border-border bg-white/70 px-4 py-3 text-sm text-ink outline-none focus:border-brand" />
            <textarea value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} maxLength={500} rows={2} placeholder="Note (optional)" className="w-full resize-none rounded-xl border border-border bg-white/70 px-4 py-3 text-sm text-ink outline-none focus:border-brand" />
            <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-70" style={{ background: "var(--gradient-brand)" }}>
              {loading && <Loader2 size={15} className="animate-spin" />}
              Request guidance
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
