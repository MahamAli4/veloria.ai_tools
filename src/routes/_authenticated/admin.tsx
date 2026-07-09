import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "@/lib/upload";
import { toast } from "sonner";
import {
  Loader2, LogOut, Plus, Pencil, Trash2, Package, MessageSquare, Wrench, ShieldAlert, X,
  Upload, ImageIcon, Link2, Star,
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "PKR", symbol: "₨" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "INR", symbol: "₹" },
  { code: "AED", symbol: "د.إ" },
  { code: "SAR", symbol: "﷼" },
];

const CATEGORY_PRESETS = [
  "Conversational AI", "AI App Builder", "Productivity AI", "AI Search",
  "AI Coding", "Career & Networking", "Design & Creative", "Writing AI",
  "Video AI", "Image AI", "Music AI", "Marketing",
];


export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — AI Vault" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type ToolRow = Tables<"tools">;
type OrderRow = Tables<"orders">;
type MsgRow = Tables<"contact_messages">;
type ReviewRow = Tables<"testimonials">;

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
  const [tab, setTab] = useState<"tools" | "reviews" | "orders" | "messages">("tools");

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
        {([["tools", "Tools", Wrench], ["reviews", "Reviews", Star], ["orders", "Orders", Package], ["messages", "Messages", MessageSquare]] as const).map(([id, label, Icon]) => (
          <button key={id} onClick={() => setTab(id)} className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 font-medium transition-colors ${tab === id ? "bg-white text-ink shadow-sm" : "text-ink-soft"}`}>
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "tools" && <ToolsTab />}
        {tab === "reviews" && <ReviewsTab />}
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

  const setStatus = async (t: ToolRow, status: string) => {
    const { error } = await supabase
      .from("tools")
      .update({ status, is_active: status === "active" } as never)
      .eq("id", t.id);
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
            {(t as { logo_url?: string }).logo_url ? (
              <img src={(t as { logo_url?: string }).logo_url} alt={t.name} className="h-11 w-11 shrink-0 rounded-xl object-cover" />
            ) : (
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl font-semibold text-white" style={{ background: t.gradient }}>{t.mark || t.name[0]}</span>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-display font-semibold text-ink">{t.name}</p>
              <p className="text-xs text-ink-soft">{(Array.isArray((t as { categories?: string[] }).categories) && (t as { categories?: string[] }).categories!.length ? (t as { categories?: string[] }).categories!.join(", ") : t.category)} · {Number(t.our_price)} <span className="line-through opacity-60">{Number(t.original_price)}</span> {(t as { currency?: string }).currency ?? ""}</p>
            </div>

            <select
              value={(t as { status?: string }).status ?? (t.is_active ? "active" : "inactive")}
              onChange={(e) => setStatus(t, e.target.value)}
              className="rounded-full border border-border bg-white/70 px-3 py-1.5 text-xs font-semibold text-ink"
            >
              <option value="active">Active</option>
              <option value="inactive">Non-active</option>
              <option value="coming_soon">Coming soon</option>
            </select>
            <button onClick={() => setEditing(t)} className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-white/60 text-ink-soft hover:text-ink"><Pencil size={15} /></button>
            <button onClick={() => remove(t.id)} className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-white/60 text-ink-soft hover:text-red-500"><Trash2 size={15} /></button>
          </div>
        ))}
      </div>
      {editing && <ToolEditor tool={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); refresh(); }} />}
    </div>
  );
}

/* --- reusable form primitives (module scope so they don't remount on keystroke) --- */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-soft">{children}</span>;
}
function TextInput({ label, value, onChange, ph, type = "text" }: { label: string; value: string; onChange: (v: string) => void; ph?: string; type?: string }) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={ph} className="w-full rounded-lg border border-border bg-white/70 px-3 py-2 text-sm text-ink outline-none focus:border-brand" />
    </label>
  );
}
function TextArea({ label, value, onChange, rows = 3, ph }: { label: string; value: string; onChange: (v: string) => void; rows?: number; ph?: string }) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} placeholder={ph} className="w-full resize-y rounded-lg border border-border bg-white/70 px-3 py-2 text-sm text-ink outline-none focus:border-brand" />
    </label>
  );
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-white/40 p-4">
      <p className="mb-3 font-display text-sm font-semibold text-ink">{title}</p>
      {children}
    </div>
  );
}

function ImageUpload({ label, value, onChange, folder, aspect }: { label: string; value: string; onChange: (url: string) => void; folder: string; aspect: "cover" | "logo" }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const pick = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Sirf image files allowed hain.");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image 5MB se choti honi chahiye.");
    setBusy(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
      toast.success("Image uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };
  const box = aspect === "cover" ? "aspect-[16/9] w-full" : "aspect-square w-full max-w-[9rem]";
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div
        onClick={() => !busy && ref.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files?.[0]); }}
        className={`group relative grid ${box} cursor-pointer place-items-center overflow-hidden rounded-xl border-2 border-dashed bg-white/60 text-ink-soft transition-colors ${drag ? "border-brand bg-brand/5" : "border-border hover:border-brand"}`}
      >
        {value ? (
          <>
            <img src={value} alt={label} className="h-full w-full object-cover" />
            {/* hover overlay with actions */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/45 opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink shadow-sm">
                <Upload size={13} /> Change
              </span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange(""); }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-red-500 shadow-sm hover:bg-white"
              >
                <Trash2 size={13} /> Remove
              </button>
            </div>
          </>
        ) : busy ? (
          <Loader2 size={22} className="animate-spin text-brand-deep" />
        ) : (
          <span className="flex flex-col items-center gap-1.5 px-3 text-center">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/10 text-brand-deep"><ImageIcon size={18} /></span>
            <span className="text-xs font-semibold text-ink">Click ya drag &amp; drop</span>
            <span className="text-[10px] text-ink-soft">PNG, JPG · max 5MB</span>
          </span>
        )}
        {busy && value && <span className="absolute inset-0 grid place-items-center bg-black/40"><Loader2 size={20} className="animate-spin text-white" /></span>}
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ""; }} />
    </div>
  );
}


function CategorySelect({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [custom, setCustom] = useState("");
  const toggle = (c: string) => onChange(value.includes(c) ? value.filter((x) => x !== c) : [...value, c]);
  const addCustom = () => {
    const v = custom.trim();
    if (v && !value.includes(v)) onChange([...value, v]);
    setCustom("");
  };
  const options = Array.from(new Set([...CATEGORY_PRESETS, ...value]));
  return (
    <div>
      <FieldLabel>Categories (select one or more)</FieldLabel>
      <div className="flex flex-wrap gap-2">
        {options.map((c) => (
          <button type="button" key={c} onClick={() => toggle(c)} className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${value.includes(c) ? "border-brand bg-brand/10 text-ink" : "border-border bg-white/60 text-ink-soft"}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input value={custom} onChange={(e) => setCustom(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }} placeholder="Add custom category" className="flex-1 rounded-lg border border-border bg-white/70 px-3 py-2 text-sm text-ink outline-none focus:border-brand" />
        <button type="button" onClick={addCustom} className="rounded-lg border border-border bg-white/70 px-3 py-2 text-xs font-semibold text-ink">Add</button>
      </div>
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
    image_url: (tool as { image_url?: string }).image_url ?? "",
    logo_url: (tool as { logo_url?: string }).logo_url ?? "",
    categories: (Array.isArray((tool as { categories?: unknown }).categories) ? ((tool as { categories?: string[] }).categories as string[]) : (tool.category ? [tool.category] : [])),
    currency: (tool as { currency?: string }).currency ?? "USD",
    post_link: (tool as { post_link?: string }).post_link ?? "",
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

  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!f.name.trim() || !f.slug.trim()) return toast.error("Name aur slug zaroori hain.");
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
      image_url: f.image_url,
      logo_url: f.logo_url,
      categories: f.categories,
      category: f.categories[0] ?? "",
      currency: f.currency,
      post_link: f.post_link.trim(),
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
    } as never;
    const res = tool.id
      ? await supabase.from("tools").update(payload).eq("id", tool.id)
      : await supabase.from("tools").insert(payload);
    setSaving(false);
    if (res.error) return toast.error(res.error.message);
    toast.success("Saved");
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm">
      <div className="my-8 w-full max-w-3xl rounded-[1.6rem] border border-border bg-[#fff7ec] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-[1.6rem] border-b border-border bg-[#fff7ec]/95 px-6 py-4 backdrop-blur">
          <h3 className="font-display text-2xl font-semibold text-ink">{tool.id ? "Edit tool" : "New tool"}</h3>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-white/60"><X size={16} /></button>
        </div>

        <div className="space-y-4 p-6">
          <Section title="Media">
            <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
              <ImageUpload label="Cover image" value={f.image_url} onChange={(v) => set("image_url", v)} folder="covers" aspect="cover" />
              <ImageUpload label="Logo" value={f.logo_url} onChange={(v) => set("logo_url", v)} folder="logos" aspect="logo" />
            </div>
          </Section>

          <Section title="Basic info">
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput label="Tool name" value={f.name} onChange={(v) => set("name", v)} ph="ChatGPT Plus" />
              <TextInput label="Slug (URL)" value={f.slug} onChange={(v) => set("slug", v)} ph="chatgpt-plus" />
            </div>
            <div className="mt-3">
              <CategorySelect value={f.categories} onChange={(v) => set("categories", v)} />
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <TextInput label="Tagline" value={f.tagline} onChange={(v) => set("tagline", v)} />
              <TextInput label="Post / product link" value={f.post_link} onChange={(v) => set("post_link", v)} ph="https://..." />
            </div>
          </Section>

          <Section title="Pricing">
            <div className="grid gap-3 sm:grid-cols-4">
              <label className="block">
                <FieldLabel>Currency</FieldLabel>
                <select value={f.currency} onChange={(e) => set("currency", e.target.value)} className="w-full rounded-lg border border-border bg-white/70 px-3 py-2 text-sm text-ink outline-none focus:border-brand">
                  {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>)}
                </select>
              </label>
              <TextInput label="Original price" value={f.original_price} onChange={(v) => set("original_price", v)} type="number" />
              <TextInput label="Discounted price" value={f.our_price} onChange={(v) => set("our_price", v)} type="number" />
              <TextInput label="Duration" value={f.duration} onChange={(v) => set("duration", v)} ph="per month" />
            </div>
          </Section>

          <Section title="Descriptions">
            <div className="space-y-3">
              <TextArea label="Short description" value={f.description} onChange={(v) => set("description", v)} rows={2} />
              <TextArea label="Overview" value={f.overview} onChange={(v) => set("overview", v)} />
              <div className="grid gap-3 sm:grid-cols-2">
                <TextArea label="What it does" value={f.what_it_does} onChange={(v) => set("what_it_does", v)} rows={2} />
                <TextArea label="Who it's for" value={f.who_for} onChange={(v) => set("who_for", v)} rows={2} />
              </div>
            </div>
          </Section>

          <Section title="Highlights (one per line)">
            <div className="grid gap-3 sm:grid-cols-2">
              <TextArea label="Benefits" value={f.benefits} onChange={(v) => set("benefits", v)} />
              <TextArea label="Features" value={f.features} onChange={(v) => set("features", v)} />
              <TextArea label="Advantages" value={f.advantages} onChange={(v) => set("advantages", v)} />
              <TextArea label="Use cases" value={f.use_cases} onChange={(v) => set("use_cases", v)} />
            </div>
          </Section>

          <Section title="Advanced (optional)">
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput label="Mark (letter fallback)" value={f.mark} onChange={(v) => set("mark", v)} />
              <TextInput label="Gradient (CSS fallback)" value={f.gradient} onChange={(v) => set("gradient", v)} />
            </div>
            <div className="mt-3 space-y-3">
              <TextArea label="Plans (JSON)" value={f.plans} onChange={(v) => set("plans", v)} rows={5} />
              <TextArea label="FAQs (JSON)" value={f.faqs} onChange={(v) => set("faqs", v)} rows={4} />
            </div>
          </Section>

          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" checked={f.is_active} onChange={(e) => set("is_active", e.target.checked)} /> Active (visible on site)
          </label>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 rounded-b-[1.6rem] border-t border-border bg-[#fff7ec]/95 px-6 py-4 backdrop-blur">
          <button onClick={onClose} className="rounded-full border border-border bg-white/60 px-5 py-2.5 text-sm font-semibold text-ink">Cancel</button>
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-70" style={{ background: "var(--gradient-brand)" }}>
            {saving && <Loader2 size={15} className="animate-spin" />} Save tool
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

/* ---------------- Reviews ---------------- */
function ReviewsTab() {
  const qc = useQueryClient();
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase.from("testimonials").select("*").order("sort_order");
      if (error) throw error;
      return data as ReviewRow[];
    },
  });
  const [editing, setEditing] = useState<Partial<ReviewRow> | null>(null);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-reviews"] });
    qc.invalidateQueries({ queryKey: ["testimonials"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Is review ko delete karein?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Review deleted");
    refresh();
  };

  const toggleActive = async (r: ReviewRow) => {
    const { error } = await supabase.from("testimonials").update({ is_active: !r.is_active }).eq("id", r.id);
    if (error) return toast.error(error.message);
    refresh();
  };

  if (isLoading) return <Loader2 className="mx-auto animate-spin text-brand-deep" />;

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={() => setEditing({})} className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white" style={{ background: "var(--gradient-brand)" }}>
          <Plus size={15} /> Add review
        </button>
      </div>
      {!reviews.length ? (
        <p className="py-12 text-center text-ink-soft">Abhi koi review nahi.</p>
      ) : (
        <div className="grid gap-3">
          {reviews.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-white/55 p-4">
              {r.avatar_url ? (
                <img src={r.avatar_url} alt={r.name} className="h-11 w-11 shrink-0 rounded-full object-cover" />
              ) : (
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full font-semibold text-white" style={{ background: "var(--gradient-brand)" }}>{r.name[0]}</span>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-display font-semibold text-ink">{r.name} <span className="text-xs font-normal text-ink-soft">· {r.role}</span></p>
                <p className="truncate text-sm text-ink-soft">"{r.quote}"</p>
                <p className="mt-0.5 text-xs text-brand">{"★".repeat(Math.max(1, Math.min(5, r.rating)))}</p>
              </div>
              <button onClick={() => toggleActive(r)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${r.is_active ? "border-brand bg-brand/10 text-ink" : "border-border bg-white/70 text-ink-soft"}`}>
                {r.is_active ? "Active" : "Hidden"}
              </button>
              <button onClick={() => setEditing(r)} className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-white/60 text-ink-soft hover:text-ink"><Pencil size={15} /></button>
              <button onClick={() => remove(r.id)} className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-white/60 text-ink-soft hover:text-red-500"><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
      )}
      {editing && <ReviewEditor review={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); refresh(); }} />}
    </div>
  );
}

function ReviewEditor({ review, onClose, onSaved }: { review: Partial<ReviewRow>; onClose: () => void; onSaved: () => void }) {
  const [saving, setSaving] = useState(false);
  const [f, setF] = useState({
    name: review.name ?? "",
    role: review.role ?? "",
    quote: review.quote ?? "",
    avatar_url: review.avatar_url ?? "",
    rating: String(review.rating ?? 5),
    sort_order: String(review.sort_order ?? 0),
    is_active: review.is_active ?? true,
  });
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!f.name.trim() || !f.quote.trim()) return toast.error("Name aur quote zaroori hain.");
    setSaving(true);
    const payload = {
      name: f.name.trim(),
      role: f.role.trim(),
      quote: f.quote.trim(),
      avatar_url: f.avatar_url,
      rating: Math.max(1, Math.min(5, Number(f.rating) || 5)),
      sort_order: Number(f.sort_order) || 0,
      is_active: f.is_active,
    } as never;
    const res = review.id
      ? await supabase.from("testimonials").update(payload).eq("id", review.id)
      : await supabase.from("testimonials").insert(payload);
    setSaving(false);
    if (res.error) return toast.error(res.error.message);
    toast.success("Saved");
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm">
      <div className="my-8 w-full max-w-lg rounded-[1.6rem] border border-border bg-[#fff7ec] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-[1.6rem] border-b border-border bg-[#fff7ec]/95 px-6 py-4 backdrop-blur">
          <p className="font-display text-lg font-semibold text-ink">{review.id ? "Edit review" : "Add review"}</p>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-ink-soft hover:text-ink"><X size={18} /></button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <TextInput label="Name" value={f.name} onChange={(v) => set("name", v)} ph="Sarah Chen" />
            <TextInput label="Role" value={f.role} onChange={(v) => set("role", v)} ph="Product Designer" />
          </div>
          <TextArea label="Quote" value={f.quote} onChange={(v) => set("quote", v)} rows={4} ph="Loved the experience..." />
          <ImageUpload label="Avatar (optional)" value={f.avatar_url} onChange={(url) => set("avatar_url", url)} folder="testimonials" aspect="logo" />
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <FieldLabel>Rating (1-5)</FieldLabel>
              <select value={f.rating} onChange={(e) => set("rating", e.target.value)} className="w-full rounded-lg border border-border bg-white/70 px-3 py-2 text-sm text-ink outline-none focus:border-brand">
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
              </select>
            </label>
            <TextInput label="Sort order" value={f.sort_order} onChange={(v) => set("sort_order", v)} type="number" />
          </div>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" checked={f.is_active} onChange={(e) => set("is_active", e.target.checked)} /> Active (visible on site)
          </label>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 rounded-b-[1.6rem] border-t border-border bg-[#fff7ec]/95 px-6 py-4 backdrop-blur">
          <button onClick={onClose} className="rounded-full border border-border bg-white/60 px-5 py-2.5 text-sm font-semibold text-ink">Cancel</button>
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-70" style={{ background: "var(--gradient-brand)" }}>
            {saving && <Loader2 size={15} className="animate-spin" />} Save review
          </button>
        </div>
      </div>
    </div>
  );
}
