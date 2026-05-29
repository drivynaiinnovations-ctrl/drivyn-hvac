import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Phone, Menu, X, ChevronDown, Wind, AirVent, Flame, Thermometer, Filter, Gauge, ShieldCheck, Siren, Wrench, Star } from "lucide-react";

const PHONE = "(301) 555-5678";

export const SERVICE_NAV = [
  { label: "AC Repair",              href: "/services/ac-repair",             icon: Wind },
  { label: "AC Installation",        href: "/services/ac-installation",       icon: AirVent },
  { label: "Furnace Repair",         href: "/services/furnace-repair",        icon: Flame },
  { label: "Furnace Installation",   href: "/services/furnace-install",       icon: Flame },
  { label: "Heat Pump",              href: "/services/heat-pump",             icon: Thermometer },
  { label: "Duct Cleaning",          href: "/services/duct-cleaning",         icon: Filter },
  { label: "Thermostat Service",     href: "/services/thermostat",            icon: Gauge },
  { label: "Air Quality",            href: "/services/air-quality",           icon: Wind },
  { label: "Emergency HVAC",         href: "/services/emergency-hvac",        icon: Siren },
  { label: "Preventive Maintenance", href: "/services/preventive-maintenance",icon: ShieldCheck },
] as const;

export function SiteHeader({ bookHref = "/#estimate" }: { bookHref?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const close = () => { setMenuOpen(false); setMobileServicesOpen(false); };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-9 rounded-lg bg-turquoise flex items-center justify-center text-white font-bold">
            <AirVent className="size-5" />
          </div>
          <span className="font-display text-xl font-semibold text-charcoal">ABC HVAC</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-charcoal/80">
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setServicesOpen((v) => !v)}
              onMouseEnter={() => setServicesOpen(true)}
              className="flex items-center gap-1 hover:text-turquoise transition"
            >
              Services <ChevronDown className={`size-3.5 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
            </button>
            {servicesOpen && (
              <div
                onMouseLeave={() => setServicesOpen(false)}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[420px] bg-white rounded-2xl border border-border shadow-luxe p-3 grid grid-cols-2 gap-1 z-50"
              >
                {SERVICE_NAV.map((s) => {
                  const Icon = s.icon;
                  return (
                    <Link key={s.href} to={s.href} onClick={() => setServicesOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-turquoise/8 hover:text-turquoise text-charcoal/80 transition">
                      <Icon className="size-4 text-turquoise shrink-0" />
                      <span className="text-sm font-medium">{s.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
          <Link to="/#estimate" className="hover:text-turquoise transition">Get Estimate</Link>
          <Link to="/#who" className="hover:text-turquoise transition">Who We Serve</Link>
          <Link to="/#area" className="hover:text-turquoise transition">Service Area</Link>
          <button onClick={() => window.dispatchEvent(new Event("open-voice-widget"))} className="hover:text-turquoise transition">
            AI Assistant
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <a href={`tel:${PHONE}`} className="hidden md:flex items-center gap-2 text-sm font-semibold text-charcoal hover:text-turquoise transition">
            <Phone className="size-4 text-turquoise" /> {PHONE}
          </a>
          <a href={bookHref} className="bg-turquoise text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition shadow-turquoise">
            Book Service
          </a>
          <button onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu"
            className="md:hidden flex items-center justify-center size-9 rounded-lg border border-border text-charcoal hover:bg-secondary transition">
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-border px-5 py-4 flex flex-col gap-2 text-sm font-medium text-charcoal/80">
          <button onClick={() => setMobileServicesOpen((v) => !v)}
            className="flex items-center justify-between w-full py-2 hover:text-turquoise transition">
            <span>Services</span>
            <ChevronDown className={`size-4 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`} />
          </button>
          {mobileServicesOpen && (
            <div className="pl-3 flex flex-col gap-1 mb-2">
              {SERVICE_NAV.map((s) => (
                <Link key={s.href} to={s.href} onClick={close} className="py-1.5 text-sm text-charcoal/70 hover:text-turquoise transition">
                  {s.label}
                </Link>
              ))}
            </div>
          )}
          <Link to="/#estimate" onClick={close} className="py-2 hover:text-turquoise transition">Get Estimate</Link>
          <Link to="/#who" onClick={close} className="py-2 hover:text-turquoise transition">Who We Serve</Link>
          <Link to="/#area" onClick={close} className="py-2 hover:text-turquoise transition">Service Area</Link>
          <a href={`tel:${PHONE}`} onClick={close} className="py-2 hover:text-turquoise transition">{PHONE}</a>
        </div>
      )}
    </header>
  );
}
