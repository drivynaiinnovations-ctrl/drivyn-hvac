import { useEffect, useRef, useState } from "react";
import { X, Phone } from "lucide-react";
import { startVapi, VAPI_ASSISTANT_ID } from "@/lib/vapi";

type Line = { who: "AI" | "You"; text: string };

const SCRIPT: Line[] = [
  { who: "AI", text: "Hi, this is ABC HVAC. How can I help you today?" },
  { who: "You", text: "My heat just stopped working and it's freezing." },
  { who: "AI", text: "I'm sorry to hear that. I'm marking this as an emergency. Can I confirm your address and dispatch a technician now?" },
  { who: "You", text: "Yes — 123 Elm St, Bethesda." },
  { who: "AI", text: "Done. Technician Marcus will arrive within 45 minutes. You'll get an SMS confirmation in a moment." },
];

const TYPE_SPEED = 22;        // ms per character
const PAUSE_BETWEEN = 450;    // ms between lines

export function DemoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [lines, setLines] = useState<{ who: "AI" | "You"; text: string; done: boolean }[]>([]);
  const [finished, setFinished] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef(false);

  useEffect(() => {
    if (!open) return;
    cancelRef.current = false;
    setLines([]);
    setFinished(false);

    (async () => {
      for (let i = 0; i < SCRIPT.length; i++) {
        if (cancelRef.current) return;
        const line = SCRIPT[i];
        setLines((prev) => [...prev, { ...line, text: "", done: false }]);
        for (let c = 1; c <= line.text.length; c++) {
          if (cancelRef.current) return;
          await new Promise((r) => setTimeout(r, TYPE_SPEED));
          setLines((prev) => {
            const next = [...prev];
            next[next.length - 1] = { ...next[next.length - 1], text: line.text.slice(0, c) };
            return next;
          });
          scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
        }
        setLines((prev) => {
          const next = [...prev];
          next[next.length - 1] = { ...next[next.length - 1], done: true };
          return next;
        });
        await new Promise((r) => setTimeout(r, PAUSE_BETWEEN));
      }
      if (!cancelRef.current) setFinished(true);
    })();

    return () => {
      cancelRef.current = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="ABC HVAC AI Assistant demo"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl w-full max-w-lg shadow-luxe overflow-hidden animate-in zoom-in-95 fade-in"
      >
        <button
          onClick={onClose}
          aria-label="Close demo"
          className="absolute top-3 right-3 z-10 size-9 rounded-full bg-white hover:bg-secondary border border-border flex items-center justify-center text-charcoal/70 hover:text-charcoal transition"
        >
          <X className="size-4" />
        </button>

        <div className="px-6 pt-6 pb-3 border-b border-border">
          <div className="flex items-center gap-3">
            <span className="size-2.5 rounded-full bg-turquoise animate-pulse" />
            <div>
              <p className="font-display text-lg font-semibold text-charcoal leading-tight">ABC HVAC — AI Assistant Demo</p>
              <p className="text-xs text-muted-foreground">Live conversation simulation</p>
            </div>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="px-5 py-5 space-y-3 max-h-[55vh] overflow-y-auto bg-secondary/30"
        >
          {lines.map((l, i) => {
            const isAI = l.who === "AI";
            const showCaret = !l.done;
            return (
              <div key={i} className={`flex ${isAI ? "justify-start" : "justify-end"} animate-in fade-in slide-in-from-bottom-2`}>
                <div className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isAI ? "bg-white text-charcoal rounded-bl-sm border border-border" : "bg-turquoise text-white rounded-br-sm"}`}>
                  {l.text}
                  {showCaret && (
                    <span className={`inline-block w-[2px] h-4 align-middle ml-0.5 ${isAI ? "bg-charcoal" : "bg-white"} animate-pulse`} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className={`px-6 py-5 border-t border-border transition-opacity duration-500 ${finished ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
          <p className="text-center text-xs font-semibold tracking-[0.18em] uppercase text-turquoise mb-3">
            This is a demo — experience the real thing
          </p>
          <button
            onClick={() => {
              startVapi(VAPI_ASSISTANT_ID);
              onClose();
            }}
            className="w-full bg-turquoise text-white font-semibold rounded-xl py-4 text-base inline-flex items-center justify-center gap-2 hover:opacity-90 shadow-turquoise transition"
          >
            <Phone className="size-5" /> Talk to Alex Now — Try the Live AI
          </button>
        </div>
      </div>
    </div>
  );
}
