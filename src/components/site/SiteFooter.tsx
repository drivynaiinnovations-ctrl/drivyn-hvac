import { Link } from "@tanstack/react-router";
import { Phone, Mail, AirVent } from "lucide-react";
import { SERVICE_NAV } from "./SiteHeader";

const PHONE = "(301) 555-5678";
const EMAIL = "service@abchvac.com";

export function SiteFooter() {
  return (
    <footer className="bg-charcoal border-t border-white/10 text-white/80">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-14 grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="size-9 rounded-lg bg-turquoise flex items-center justify-center text-white font-bold">
              <AirVent className="size-5" />
            </div>
            <span className="font-display text-xl font-semibold text-white">ABC HVAC</span>
          </div>
          <p className="italic text-white/70">"Comfort Done Right. Every Time."</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm tracking-wider uppercase">Services</h4>
          <ul className="space-y-2 text-sm grid grid-cols-2 gap-x-4">
            {SERVICE_NAV.map((s) => (
              <li key={s.href}>
                <Link to={s.href} className="hover:text-turquoise transition">{s.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm tracking-wider uppercase">Contact</h4>
          <a href={`tel:${PHONE}`} className="text-sm flex items-center gap-2 mb-2 hover:text-turquoise transition">
            <Phone className="size-4 text-turquoise" /> {PHONE}
          </a>
          <a href={`mailto:${EMAIL}`} className="text-sm flex items-center gap-2 hover:text-turquoise transition">
            <Mail className="size-4 text-turquoise" /> {EMAIL}
          </a>
          <p className="text-xs text-white/40 mt-4">Licensed & Insured · DC · MD · VA</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © 2026 ABC HVAC. All rights reserved. Licensed & Insured. Serving the DMV.
      </div>
    </footer>
  );
}
