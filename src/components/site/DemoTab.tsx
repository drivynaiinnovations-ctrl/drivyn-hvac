import { MessageSquare, X } from "lucide-react";
import { useEffect, useState } from "react";
import { startVapi, VAPI_ASSISTANT_ID } from "@/lib/vapi";

export function DemoTab() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden lg:flex fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-turquoise text-white px-3 py-5 rounded-r-xl shadow-turquoise items-center gap-2 [writing-mode:vertical-rl] rotate-180 font-semibold tracking-wide text-sm hover:px-4 transition-all"
      >
        See How Our AI Works — Try Demo
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-luxe">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="size-5 text-turquoise" />
                <h3 className="font-display text-xl text-charcoal">AI Assistant Demo</h3>
              </div>
              <button onClick={() => setOpen(false)}><X className="size-5 text-muted-foreground" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <Bubble who="AI">Hi, this is ABC HVAC. How can I help you today?</Bubble>
              <Bubble who="You">My heat just stopped working and it's freezing.</Bubble>
              <Bubble who="AI">I'm sorry to hear that. I'm marking this as an emergency. Can I confirm your address and dispatch a technician now?</Bubble>
              <Bubble who="You">Yes — 123 Elm St, Bethesda.</Bubble>
              <Bubble who="AI">Done. Technician Marcus will arrive within 45 minutes. You'll get an SMS confirmation in a moment.</Bubble>
            </div>
            <button
              onClick={() => { startVapi(VAPI_ASSISTANT_ID); setOpen(false); }}
              className="mt-5 w-full bg-turquoise text-white font-semibold rounded-lg py-3 hover:opacity-90 transition"
            >
              Try It Live
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Bubble({ who, children }: { who: "AI" | "You"; children: React.ReactNode }) {
  const isAI = who === "AI";
  return (
    <div className={`flex ${isAI ? "justify-start" : "justify-end"}`}>
      <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${isAI ? "bg-secondary text-charcoal rounded-bl-sm" : "bg-turquoise text-white rounded-br-sm"}`}>
        {children}
      </div>
    </div>
  );
}
