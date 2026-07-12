import { MessageCircle } from "lucide-react";

// 👉 Apna WhatsApp number yahan daalein (country code ke saath, bina + ya spaces)
const WHATSAPP_NUMBER = "923001234567";
const PREFILL_MESSAGE = "Hi! I'm interested in your premium AI tools.";

export function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PREFILL_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="group fixed bottom-6 right-6 z-[60] flex items-center gap-3 rounded-full bg-[#25D366] px-4 py-4 text-white shadow-[0_16px_40px_-12px_rgba(37,211,102,0.65)] transition-transform hover:scale-105"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-40" aria-hidden />
      <MessageCircle size={24} className="relative shrink-0" />
      <span className="relative hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-[10rem] md:inline-block">
        Chat on WhatsApp
      </span>
    </a>
  );
}
