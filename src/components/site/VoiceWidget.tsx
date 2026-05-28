import { Headset, PhoneOff, X } from "lucide-react";
import { useEffect, useState } from "react";
import { startVapi, stopVapi, onVapiEvent, offVapiEvent, VAPI_ASSISTANT_ID } from "@/lib/vapi";

type CallStatus = "idle" | "connecting" | "active";

export function VoiceWidget() {
  const [open, setOpen] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>("idle");

  useEffect(() => {
    const onStart = () => setCallStatus("active");
    const onEnd = () => setCallStatus("idle");
    onVapiEvent("call-start", onStart);
    onVapiEvent("call-end", onEnd);
    return () => {
      offVapiEvent("call-start", onStart);
      offVapiEvent("call-end", onEnd);
    };
  }, []);

  useEffect(() => {
    const handler = () => {
      setOpen(true);
      setCallStatus("connecting");
      startVapi(VAPI_ASSISTANT_ID);
    };
    window.addEventListener("open-voice-widget", handler);
    return () => window.removeEventListener("open-voice-widget", handler);
  }, []);

  function handleStart() {
    setCallStatus("connecting");
    startVapi(VAPI_ASSISTANT_ID);
  }

  const isActive = callStatus === "active";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-72 rounded-2xl bg-white shadow-luxe border border-border p-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-charcoal font-semibold text-sm">AI Assistant</p>
              <p className="text-xs text-muted-foreground">
                {isActive ? "Call in progress" : "Available 24/7"}
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-charcoal">
              <X className="size-4" />
            </button>
          </div>
          <p className="text-sm text-charcoal/80 mb-3">
            "Hi, this is ABC HVAC. How can I help you today?"
          </p>
          {isActive ? (
            <button
              onClick={stopVapi}
              className="w-full bg-red-500 text-white text-sm font-semibold rounded-lg py-2.5 hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              <PhoneOff className="size-4" /> End Call
            </button>
          ) : (
            <button
              onClick={handleStart}
              disabled={callStatus === "connecting"}
              className="w-full bg-turquoise text-white text-sm font-semibold rounded-lg py-2.5 hover:opacity-90 transition disabled:opacity-60"
            >
              {callStatus === "connecting" ? "Connecting..." : "Start Voice Conversation"}
            </button>
          )}
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Talk to AI Assistant"
        className={`pulse-ring relative size-16 rounded-full text-white flex items-center justify-center hover:scale-105 transition ${isActive ? "bg-red-500 shadow-red-300" : "bg-turquoise shadow-turquoise"}`}
      >
        {isActive ? <PhoneOff className="size-7" /> : <Headset className="size-7" />}
      </button>
      {!open && (
        <span className="hidden sm:block text-xs text-charcoal bg-white/95 backdrop-blur px-3 py-1.5 rounded-full shadow border border-border">
          {isActive ? "Call in progress..." : "Speak With A Live Agent Now — 24/7"}
        </span>
      )}
    </div>
  );
}
