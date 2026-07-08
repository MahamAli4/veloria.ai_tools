import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Loader2, LogOut, Plus, Pencil, Trash2, Package, MessageSquare, Wrench, ShieldAlert, X,
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — AI Vault" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type ToolRow = Tables<"tools">;
type OrderRow = Tables<"orders">;
type MsgRow = Tables<"contact_messages">;

const linesToArr = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);
const arrToLines = (v: unknown) => (Array.isArray(v) ? (v as unknown[]).map(String).join("\n") : "");

function useIsAdmin() {
  return useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const uid = userRes.user?.id;
      if (!uid) return false;
      const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", uid).eq("role", "admin").maybeSingle();
      if (error) return false;
      return !!data;
    },
  });
}

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: isAdmin, isLoading: checking } = useIsAdmin();
  const [tab, setTab] = useState<"tools" | "orders" | "messages">("tools");

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  if (checking) {
    return <div className="flex min-h-screen items-center justify-center"><Loader2 className="animate-spin text-brand-deep" /></div>;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
        <ShieldAlert className="text-brand-deep" size={40} />
        <h1 className="font-display text-2xl font-semibold text-ink">Access denied</h1>
        <p className="text-sm text-ink-soft">Ye account admin nahi hai.</p>
        <button onClick={signOut} className="rounded-full border border-border bg-white/60 px-6 py-2.5 text-sm font-semibold text-ink">Sign out</button>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 pt-28">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold text-ink">Admin</h1>
          <p className="mt-1 text-sm text-ink-soft">Manage tools, orders and messages.</p>
        </div>
        <button onClick={signOut} className="inline-flex items-center gap-2 rounded-full border border-border bg-white/60 px-5 py-2.5 text-sm font-semibold text-ink hover:bg-white">
          <LogOut size={15} /> Sign out
        </button>
      </div>

      <div className="mt-8 flex gap-1 rounded-full border border-border bg-white/50 p-1 text-sm">
        {([["tools", "Tools", Wrench], ["orders", "Orders", Package], ["messages", "Messages", MessageSquare]] as const).map(([id, label, Icon]) => (
          <button key={id} onClick={() => setTab(id)} className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 font-medium transition-colors ${tab === id ? "bg-white text-ink shadow-sm" : "text-ink-soft"}`}>
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "tools" && <ToolsTab />}
        {tab === "orders" && <OrdersTab />}
        {tab === "messages" && <MessagesTab />}
      </div>
    </section>
  );
}

/* ---------------- Tools ---------------- */
function ToolsTab() {
  const qc = useQueryClient();
  const { data: tools = [], isLoading } = useQuery({
    queryKey: ["admin-tools"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tools").select("*").order("sort_order");
      if (error) throw error;
      return data as ToolRow[];
    },
  });
  const [editing, setEditing] = useState<Partial<ToolRow> | null>(null);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-tools"] });
    qc.invalidateQueries({ queryKey: ["tools"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Is tool ko delete karein?")) return;
    const { error } = await supabase.from("tools").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Tool deleted");
    refresh();
  };

  const toggleActive = async (t: ToolRow) => {
    const { error } = await supabase.from("tools").update({ is_active: !t.is_active }).eq("id", t.id);
    if (error) return toast.error(error.message);
    refresh();
  };

  if (isLoading) return <Loader2 className="mx-auto animate-spin text-brand-deep" />;

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={() => setEditing({})} className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white" style={{ background: "var(--gradient-brand)" }}>
          <Plus size={15} /> Add tool
        </button>
      </div>
      <div className="grid gap-3">
        {tools.map((t) => (
          <div key={t.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-white/55 p-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl font-semibold text-white" style={{ background: t.gradient }}>{t.mark || t.name[0]}</span>
            <div className="min-w-0 flex-1">
              <p className="font-display font-semibold text-ink">{t.name}</p>
              <p className="text-xs text-ink-soft">{t.category} · ${Number(t.our_price)} <span className="line-through opacity-60">${Number(t.original_price)}</span></p>
            </div>
            <button onClick={() => toggleActive(t)} className={`rounded-full px-3 py-1 text-xs font-semibold ${t.is_active ? "bg-brand/15 text-brand-deep" : "bg-black/5 text-ink-soft"}`}>
              {t.is_active ? "Active" : "Hidden"}
            </button>
            <button onClick={() => setEditing(t)} className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-white/60 text-ink-soft hover:text-ink"><Pencil size={15} /></button>
            <button onClick={() => remove(t.id)} className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-white/60 text-ink-soft hover:text-red-500"><Trash2 size={15} /></button>
          </div>
        ))}
      </div>
      {editing && <ToolEditor tool={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); refresh(); }} />}
    </div>
  );
}

function ToolEditor({ tool, onClose, onSaved }: { tool: Partial<ToolRow>; onClose: () => void; onSaved: () => void }) {
  const [saving, setSaving] = useState(false);
  const [f, setF] = useState({
    slug: tool.slug ?? "",
    name: tool.name ?? "",
    mark: tool.mark ?? "",
    gradient: tool.gradient ?? "linear-gradient(135deg,#6d6eb0,#a5a6dc)",
    category: tool.category ?? "",
    tagline: tool.tagline ?? "",
    description: tool.description ?? "",
    overview: tool.overview ?? "",
    what_it_does: tool.what_it_does ?? "",
    who_for: tool.who_for ?? "",
    original_price: String(tool.original_price ?? ""),
    our_price: String(tool.our_price ?? ""),
    duration: tool.duration ?? "per month",
    benefits: arrToLines(tool.benefits),
    features: arrToLines(tool.features),
    advantages: arrToLines(tool.advantages),
    use_cases: arrToLines(tool.use_cases),
    plans: tool.plans ? JSON.stringify(tool.plans, null, 2) : "[]",
    faqs: tool.faqs ? JSON.stringify(tool.faqs, null, 2) : "[]",
    is_active: tool.is_active ?? true,
  });

  const set = (k: keyof typeof f, v: string | boolean) => setF((p) => ({ ...p, [k]: v }));

  const save = async () => {
    setSaving(true);
    let plans, faqs;
    try {
      plans = JSON.parse(f.plans || "[]");
      faqs = JSON.parse(f.faqs || "[]");
    } catch {
      setSaving(false);
      return toast.error("Plans/FAQs ka JSON valid nahi hai.");
    }
    const payload = {
      slug: f.slug.trim(),
      name: f.name.trim(),
      mark: f.mark,
      gradient: f.gradient,
      category: f.category,
      tagline: f.tagline,
      description: f.description,
      overview: f.overview,
      what_it_does: f.what_it_does,
      who_for: f.who_for,
      original_price: Number(f.original_price) || 0,
      our_price: Number(f.our_price) || 0,
      duration: f.duration,
      benefits: linesToArr(f.benefits),
      features: linesToArr(f.features),
      advantages: linesToArr(f.advantages),
      use_cases: linesToArr(f.use_cases),
      plans,
      faqs,
      is_active: f.is_active,
    };
    const res = tool.id
      ? await supabase.from("tools").update(payload).eq("id", tool.id)
      : await supabase.from("tools").insert(payload);
    setSaving(false);
    if (res.error) return toast.error(res.error.message);
    toast.success("Saved");
    onSaved();
  };

  const Input = ({ label, k, ph }: { label: string; k: keyof typeof f; ph?: string }) => (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-ink-soft">{label}</span>
      <input value={f[k] as string} onChange={(e) => set(k, e.target.value)} placeholder={ph} className="w-full rounded-lg border border-border bg-white/70 px-3 py-2 text-sm text-ink outline-none focus:border-brand" />
    </label>
  );
  const Area = ({ label, k, rows = 3 }: { label: string; k: keyof typeof f; rows?: number }) => (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-ink-soft">{label}</span>
      <textarea value={f[k] as string} onChange={(e) => set(k, e.target.value)} rows={rows} className="w-full resize-y rounded-lg border border-border bg-white/70 px-3 py-2 text-sm text-ink outline-none focus:border-brand" />
    </label>
  );

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm">
      <div className="my-8 w-full max-w-2xl rounded-[1.6rem] border border-border bg-[#fff7ec] p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl font-semibold text-ink">{tool.id ? "Edit tool" : "New tool"}</h3>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-white/60"><X size={16} /></button>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Input label="Name" k="name" />
          <Input label="Slug" k="slug" ph="chatgpt-plus" />
          <Input label="Mark (letter/icon)" k="mark" />
          <Input label="Category" k="category" />
          <Input label="Original price" k="original_price" />
          <Input label="Our price" k="our_price" />
          <Input label="Duration" k="duration" />
          <Input label="Gradient (CSS)" k="gradient" />
        </div>
        <div className="mt-3 space-y-3">
          <Input label="Tagline" k="tagline" />
          <Area label="Short description" k="description" rows={2} />
          <Area label="Overview" k="overview" />
          <Area label="What it does" k="what_it_does" rows={2} />
          <Area label="Who it's for" k="who_for" rows={2} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Area label="Benefits (one per line)" k="benefits" />
            <Area label="Features (one per line)" k="features" />
            <Area label="Advantages (one per line)" k="advantages" />
            <Area label="Use cases (one per line)" k="use_cases" />
          </div>
          <Area label="Plans (JSON)" k="plans" rows={5} />
          <Area label="FAQs (JSON)" k="faqs" rows={4} />
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" checked={f.is_active} onChange={(e) => set("is_active", e.target.checked)} /> Active (visible on site)
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-full border border-border bg-white/60 px-5 py-2.5 text-sm font-semibold text-ink">Cancel</button>
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-70" style={{ background: "var(--gradient-brand)" }}>
            {saving && <Loader2 size={15} className="animate-spin" />} Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Orders ---------------- */
const ORDER_STATUSES = ["pending", "processing", "delivered", "cancelled"];

function OrdersTab() {
  const qc = useQueryClient();
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as OrderRow[];
    },
  });

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
  };
  const remove = async (id: string) => {
    if (!confirm("Order delete karein?")) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
  };

  if (isLoading) return <Loader2 className="mx-auto animate-spin text-brand-deep" />;
  if (!orders.length) return <p className="py-12 text-center text-ink-soft">Abhi koi order nahi.</p>;

  return (
    <div className="grid gap-3">
      {orders.map((o) => (
        <div key={o.id} className="rounded-2xl border border-border bg-white/55 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-display font-semibold text-ink">{o.tool_name} <span className="text-ink-soft">· {o.plan_name}</span></p>
              <p className="text-sm text-ink-soft">{o.customer_name} · {o.customer_email}</p>
              {o.whatsapp && <p className="text-sm text-ink-soft">WhatsApp: {o.whatsapp}</p>}
              {o.note && <p className="mt-1 text-sm text-ink">"{o.note}"</p>}
              <p className="mt-1 text-xs text-ink-soft">{new Date(o.created_at).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="font-display text-xl font-semibold text-ink">${Number(o.price)}</p>
              <div className="mt-2 flex items-center gap-2">
                <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value)} className="rounded-lg border border-border bg-white/70 px-2 py-1.5 text-xs text-ink">
                  {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={() => remove(o.id)} className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-white/60 text-ink-soft hover:text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Messages ---------------- */
function MessagesTab() {
  const qc = useQueryClient();
  const { data: msgs = [], isLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as MsgRow[];
    },
  });

  const toggleRead = async (m: MsgRow) => {
    const { error } = await supabase.from("contact_messages").update({ is_read: !m.is_read }).eq("id", m.id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-messages"] });
  };
  const remove = async (id: string) => {
    if (!confirm("Message delete karein?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-messages"] });
  };

  const unread = useMemo(() => msgs.filter((m) => !m.is_read).length, [msgs]);

  if (isLoading) return <Loader2 className="mx-auto animate-spin text-brand-deep" />;
  if (!msgs.length) return <p className="py-12 text-center text-ink-soft">Abhi koi message nahi.</p>;

  return (
    <div>
      <p className="mb-4 text-sm text-ink-soft">{unread} unread</p>
      <div className="grid gap-3">
        {msgs.map((m) => (
          <div key={m.id} className={`rounded-2xl border p-4 ${m.is_read ? "border-border bg-white/40" : "border-brand/40 bg-white/70"}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-ink">{m.name} <span className="font-normal text-ink-soft">· {m.email}</span></p>
                <p className="mt-1 text-sm text-ink">{m.message}</p>
                <p className="mt-1 text-xs text-ink-soft">{new Date(m.created_at).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleRead(m)} className="rounded-full border border-border bg-white/60 px-3 py-1.5 text-xs font-semibold text-ink">
                  {m.is_read ? "Mark unread" : "Mark read"}
                </button>
                <button onClick={() => remove(m.id)} className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-white/60 text-ink-soft hover:text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
