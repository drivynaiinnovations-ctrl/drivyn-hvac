import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { classifyIssue } from "@/lib/classify";
import { startVapi } from "@/lib/vapi";

type Role = "alex" | "user";
type Step = "name" | "phone" | "issue" | "classifying" | "done";

interface Msg { role: Role; text: string }

const ALEX_DELAY = 900; // ms before Alex "responds"

export function AlexChat({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<Step>("name");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset and greet when opened
  useEffect(() => {
    if (!open) return;
    setStep("name");
    setMessages([]);
    setInput("");
    setName("");
    setPhone("");
    setTyping(false);

    const t = setTimeout(() => {
      setMessages([{ role: "alex", text: "Hi! I'm Alex, ABC HVAC's virtual assistant. Let's get you taken care of. What's your name?" }]);
      setTimeout(() => inputRef.current?.focus(), 50);
    }, 300);

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // Scroll to bottom on new message
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  if (!open) return null;

  function addUser(text: string) {
    setMessages((m) => [...m, { role: "user", text }]);
  }

  function alexSay(text: string, then?: () => void) {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { role: "alex", text }]);
      if (then) setTimeout(then, 50);
    }, ALEX_DELAY);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const val = input.trim();
    if (!val) return;
    setInput("");

    if (step === "name") {
      addUser(val);
      setName(val);
      setStep("phone");
      alexSay(`Nice to meet you, ${val.split(" ")[0]}! What's the best phone number to reach you?`);
    } else if (step === "phone") {
      addUser(val);
      setPhone(val);
      setStep("issue");
      alexSay("Got it! What's going on with your HVAC system?");
    } else if (step === "issue") {
      addUser(val);
      setStep("classifying");
      alexSay("Thanks — let me check on that for you…", async () => {
        try {
          const { urgent } = await classifyIssue({ data: { issue: val } });
          if (urgent) {
            alexSay(
              "It sounds like you need to speak with one of our expert technicians right away to discuss the details. I'm connecting you now.",
              () => {
                setStep("done");
                onClose();
                startVapi();
              }
            );
          } else {
            alexSay(
              `Got it! I've noted your information and one of our team members will follow up at ${phone} to schedule your appointment. Is there anything else you need?`,
              () => setStep("done")
            );
          }
        } catch {
          alexSay("Sorry, something went wrong. Please call us directly at (301) 555-1234.");
          setStep("done");
        }
      });
    }
  }

  const isDone = step === "done" || step === "classifying";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-charcoal/70 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Chat with Alex"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-luxe overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-turquoise flex items-center justify-center text-white font-bold text-sm">A</div>
            <div>
              <p className="font-semibold text-charcoal text-sm leading-tight">Alex · ABC HVAC</p>
              <p className="text-xs text-turquoise flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-turquoise animate-pulse inline-block" /> Online now
              </p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="size-8 rounded-full hover:bg-secondary flex items-center justify-center text-charcoal/60 hover:text-charcoal transition">
            <X className="size-4" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="px-4 py-4 space-y-3 max-h-72 overflow-y-auto bg-secondary/20">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === "user" ? "bg-turquoise text-white rounded-br-sm" : "bg-white text-charcoal border border-border rounded-bl-sm shadow-sm"}`}>
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="bg-white border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1 items-center">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="size-1.5 rounded-full bg-charcoal/30 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-border flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isDone || typing}
            placeholder={
              step === "name" ? "Your full name…" :
              step === "phone" ? "Phone number…" :
              step === "issue" ? "Describe the issue…" : ""
            }
            className="flex-1 border border-border rounded-lg px-3 py-2 text-sm text-charcoal placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-turquoise/40 focus:border-turquoise transition disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isDone || typing}
            className="bg-turquoise text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-40"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
