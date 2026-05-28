import { X, Calendar, CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Field = { name: string; phone: string; service: string; date: string; notes: string };
const EMPTY: Field = { name: "", phone: "", service: "", date: "", notes: "" };

const SERVICES = [
  "Heating Repair / Replacement",
  "Cooling Repair / Replacement",
  "Air Quality / Filtration",
  "Maintenance Plan",
  "Emergency Service",
  "Smart / Energy Solutions",
  "Other",
];

export function BookingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [fields, setFields] = useState<Field>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setFields(EMPTY);
    setSubmitted(false);
    setTimeout(() => firstRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  function set(k: keyof Field) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setFields((f) => ({ ...f, [k]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Book an appointment"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl w-full max-w-lg shadow-luxe overflow-hidden animate-in zoom-in-95 fade-in"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 size-9 rounded-full bg-white hover:bg-secondary border border-border flex items-center justify-center text-charcoal/70 hover:text-charcoal transition"
        >
          <X className="size-4" />
        </button>

        <div className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Calendar className="size-5 text-turquoise" />
            <div>
              <p className="font-display text-lg font-semibold text-charcoal leading-tight">Book an Appointment</p>
              <p className="text-xs text-muted-foreground">We'll confirm within 1 hour</p>
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="px-6 py-10 text-center">
            <CheckCircle2 className="size-12 text-turquoise mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold text-charcoal mb-2">You're on the schedule!</h3>
            <p className="text-muted-foreground text-sm mb-6">
              We'll reach out to confirm your appointment details shortly. Check your phone for a text from ABC HVAC.
            </p>
            <button
              onClick={onClose}
              className="bg-turquoise text-white font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 transition"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-semibold text-charcoal mb-1.5">Full Name *</label>
                <input
                  ref={firstRef}
                  required
                  value={fields.name}
                  onChange={set("name")}
                  placeholder="Jane Smith"
                  className="w-full border border-border rounded-lg px-3 py-2.5 text-sm text-charcoal placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-turquoise/40 focus:border-turquoise transition"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-semibold text-charcoal mb-1.5">Phone Number *</label>
                <input
                  required
                  type="tel"
                  value={fields.phone}
                  onChange={set("phone")}
                  placeholder="(301) 555-0000"
                  className="w-full border border-border rounded-lg px-3 py-2.5 text-sm text-charcoal placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-turquoise/40 focus:border-turquoise transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5">Service Needed *</label>
              <select
                required
                value={fields.service}
                onChange={set("service")}
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-turquoise/40 focus:border-turquoise transition bg-white"
              >
                <option value="" disabled>Select a service…</option>
                {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5">Preferred Date</label>
              <input
                type="date"
                value={fields.date}
                onChange={set("date")}
                min={new Date().toISOString().split("T")[0]}
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-turquoise/40 focus:border-turquoise transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5">Additional Notes</label>
              <textarea
                value={fields.notes}
                onChange={set("notes")}
                placeholder="Describe the issue or any access instructions…"
                rows={3}
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm text-charcoal placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-turquoise/40 focus:border-turquoise transition resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-turquoise text-white font-semibold rounded-xl py-3.5 text-base inline-flex items-center justify-center gap-2 hover:opacity-90 shadow-turquoise transition"
            >
              <Calendar className="size-5" /> Confirm Appointment
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
