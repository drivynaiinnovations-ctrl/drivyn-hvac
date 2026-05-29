import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Phone, Calendar, ShieldCheck, MapPin, Clock, Home, Building2, Landmark,
  Wrench, Siren, Mic, CheckCircle2, ArrowRight, Mail, Menu, X,
  Gauge, ChevronDown, Star, Wind, Flame, Thermometer, AirVent, Filter,
} from "lucide-react";
import heroAcImg from "@/assets/hero-ac.jpg";
import heroHeatImg from "@/assets/hero-heat.jpg";
import heroMaintenanceImg from "@/assets/hero-maintenance.jpg";
import { VoiceWidget } from "@/components/site/VoiceWidget";
import { DemoTab } from "@/components/site/DemoTab";
import { DemoModal } from "@/components/site/DemoModal";
import { AlexChat } from "@/components/site/AlexChat";
import { Reveal } from "@/components/site/Reveal";
import { startVapi, VAPI_ASSISTANT_ID } from "@/lib/vapi";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "ABC HVAC — Fast, Reliable Heating & Cooling | DMV Area" },
      { name: "description", content: "Licensed DMV HVAC technicians available 24/7. AC repair, furnace service, heat pump installation, duct cleaning, and more. Get an instant estimate and book same-day service." },
      { property: "og:title", content: "ABC HVAC — DMV's Trusted Heating & Cooling Experts" },
      { property: "og:description", content: "Fast, transparent, and reliable HVAC for homes, businesses & government facilities across DC, MD & VA." },
      { property: "og:image", content: heroAcImg },
    ],
  }),
});

const PHONE = "(301) 555-5678";
const EMAIL = "service@abchvac.com";
const BOOKING_URL = "#book";

const HERO_SLIDES = [
  {
    img: heroAcImg,
    badge: "Emergency HVAC Technicians Available Now",
    line1: "Don't Sweat",
    line2: "This Summer.",
    sub: "Fast, reliable, and transparent AC repair and installation across the DMV. Get an instant estimate and book before the heat gets unbearable.",
  },
  {
    img: heroHeatImg,
    badge: "24/7 Heating & Furnace Service",
    line1: "No Heat This Winter?",
    line2: "Fixed Same Day.",
    sub: "Furnace out, heat pump down, or no warm air — our licensed technicians are dispatched with the right parts to fix it right the first time.",
  },
  {
    img: heroMaintenanceImg,
    badge: "Preventive Maintenance · Save on Energy Bills",
    line1: "Skip the Breakdown.",
    line2: "Book a Tune-Up.",
    sub: "One seasonal maintenance visit can prevent costly emergency repairs. Upfront pricing, licensed techs, and a satisfaction guarantee every time.",
  },
] as const;

// ── Price calculator data ─────────────────────────────────────────────────────
const CALC_SERVICES = [
  {
    key: "ac_repair",
    label: "AC Repair",
    icon: Wind,
    ranges: [[150, 300], [300, 600], [600, 1500]] as [number, number][],
  },
  {
    key: "ac_install",
    label: "AC Installation",
    icon: AirVent,
    ranges: [[3500, 5500], [5500, 9000], [9000, 15000]] as [number, number][],
  },
  {
    key: "furnace_repair",
    label: "Furnace Repair",
    icon: Flame,
    ranges: [[150, 350], [350, 700], [700, 2000]] as [number, number][],
  },
  {
    key: "furnace_install",
    label: "Furnace Install",
    icon: Flame,
    ranges: [[2500, 4500], [4500, 7500], [7500, 12000]] as [number, number][],
  },
  {
    key: "heat_pump",
    label: "Heat Pump",
    icon: Thermometer,
    ranges: [[3000, 5000], [5000, 8500], [8500, 14000]] as [number, number][],
  },
  {
    key: "duct_cleaning",
    label: "Duct Cleaning",
    icon: Filter,
    ranges: [[300, 500], [500, 800], [800, 1500]] as [number, number][],
  },
  {
    key: "thermostat",
    label: "Thermostat",
    icon: Gauge,
    ranges: [[150, 250], [250, 450], [450, 700]] as [number, number][],
  },
  {
    key: "air_quality",
    label: "Air Quality",
    icon: Wind,
    ranges: [[200, 400], [400, 700], [700, 1200]] as [number, number][],
  },
] as const;

const URGENCY_OPTIONS = [
  { value: "standard", label: "Standard (8am – 6pm)", surcharge: 0 },
  { value: "evening", label: "Evening / Night (+$150)", surcharge: 150 },
  { value: "weekend", label: "Weekend / Holiday (+$200)", surcharge: 200 },
  { value: "emergency", label: "Same-Day Emergency (+$350)", surcharge: 350 },
];

function PriceCalculator({ onBook }: { onBook: () => void }) {
  const [serviceKey, setServiceKey] = useState<string>("ac_repair");
  const [complexity, setComplexity] = useState(1);
  const [urgency, setUrgency] = useState("standard");

  const service = CALC_SERVICES.find((s) => s.key === serviceKey)!;
  const [low, high] = service.ranges[complexity];
  const surcharge = URGENCY_OPTIONS.find((u) => u.value === urgency)?.surcharge ?? 0;
  const estLow = low + surcharge;
  const estHigh = high + surcharge;

  const fmt = (n: number) => "$" + n.toLocaleString();

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
        <div className="size-10 rounded-xl bg-turquoise/10 flex items-center justify-center">
          <Calendar className="size-5 text-turquoise" />
        </div>
        <div>
          <p className="font-semibold text-charcoal text-sm">Instant Project Estimate</p>
          <p className="text-xs text-muted-foreground">Get a rough idea of your HVAC costs</p>
        </div>
      </div>

      <p className="text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-3">Select Service Type</p>
      <div className="grid grid-cols-2 gap-2 mb-5">
        {CALC_SERVICES.slice(0, 4).map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.key}
              onClick={() => setServiceKey(s.key)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition ${
                serviceKey === s.key
                  ? "border-turquoise bg-turquoise/10 text-turquoise"
                  : "border-gray-200 text-charcoal hover:border-turquoise/50 hover:bg-turquoise/5"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              <span className="text-left leading-tight">{s.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-4 gap-1.5 mb-5">
        {CALC_SERVICES.slice(4).map((s) => (
          <button
            key={s.key}
            onClick={() => setServiceKey(s.key)}
            className={`px-2 py-1.5 rounded-lg border text-xs font-medium transition text-center leading-tight ${
              serviceKey === s.key
                ? "border-turquoise bg-turquoise/10 text-turquoise"
                : "border-gray-200 text-charcoal/70 hover:border-turquoise/50"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <p className="text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-2">Job Complexity / Size</p>
      <div className="mb-1">
        <input
          type="range" min={0} max={2} step={1} value={complexity}
          onChange={(e) => setComplexity(Number(e.target.value))}
          className="w-full accent-teal-400 cursor-pointer"
        />
      </div>
      <div className="flex justify-between text-xs text-charcoal/50 mb-5">
        <span>Simple / Small</span>
        <span>Average</span>
        <span>Complex / Large</span>
      </div>

      <p className="text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-2">Timeline & Urgency</p>
      <div className="relative mb-5">
        <select
          value={urgency}
          onChange={(e) => setUrgency(e.target.value)}
          className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-charcoal font-medium focus:outline-none focus:border-turquoise cursor-pointer"
        >
          {URGENCY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-charcoal/40 pointer-events-none" />
      </div>

      <div className="bg-turquoise/8 border border-turquoise/20 rounded-xl px-4 py-3 flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-charcoal/60 uppercase tracking-wider">Estimated Cost Range</span>
        <span className="font-display text-xl font-bold text-charcoal">{fmt(estLow)} – {fmt(estHigh)}</span>
      </div>

      <p className="text-[10px] text-charcoal/40 text-center mb-4">Estimates are rough ranges. Final price depends on your specific job. No obligation.</p>

      <button
        onClick={onBook}
        className="w-full bg-turquoise hover:opacity-90 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-turquoise"
      >
        Book This Service <ArrowRight className="size-4" />
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
function Index() {
  const [bookingOpen, setBookingOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background text-charcoal">
      <SiteHeader bookHref="#estimate" />
      <Hero onBook={() => setBookingOpen(true)} />
      <TrustBar />
      <EstimatorSection onBook={() => setBookingOpen(true)} />
      <WhoWeServe />
      <Services />
      <HowItWorks />
      <AISection />
      <ServiceArea />
      <FoundingBanner />
      <EmergencyBanner />
      <FinalCTA onBook={() => setBookingOpen(true)} />
      <SiteFooter />
      <VoiceWidget />
      <DemoTab />
      <AlexChat open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}


function Hero({ onBook }: { onBook: () => void }) {
  const [slide, setSlide] = useState(0);
  const total = HERO_SLIDES.length;

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % total), 5500);
    return () => clearInterval(t);
  }, [total]);

  const current = HERO_SLIDES[slide];

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {HERO_SLIDES.map((s, i) => (
        <img
          key={i}
          src={s.img}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === slide ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/95 via-charcoal/80 to-charcoal/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 py-24 w-full">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-turquoise text-xs font-semibold tracking-[0.2em] uppercase mb-6">
            <span className="size-1.5 rounded-full bg-turquoise animate-pulse" />
            {current.badge}
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-semibold text-white leading-[1.05] mb-6">
            {current.line1} <span className="text-turquoise">{current.line2}</span>
          </h1>
          <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-lg">
            {current.sub}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button onClick={onBook} className="group bg-turquoise text-white font-semibold px-7 py-4 rounded-xl text-base flex items-center justify-center gap-2 hover:opacity-90 shadow-turquoise transition">
              <Calendar className="size-5" /> Book Service Now
              <ArrowRight className="size-4 group-hover:translate-x-1 transition" />
            </button>
            <button onClick={() => startVapi(VAPI_ASSISTANT_ID)} className="pulse-ring relative bg-transparent border-2 border-white text-white font-semibold px-7 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white hover:text-charcoal transition">
              <Phone className="size-5 text-turquoise" /> Speak With Us Now
            </button>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-turquoise" /> Arrives in under 45 mins</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-turquoise" /> Upfront pricing</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-turquoise" /> Licensed & insured</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            className={`rounded-full transition-all duration-300 ${i === slide ? "w-8 h-2.5 bg-turquoise" : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"}`}
          />
        ))}
      </div>
    </section>
  );
}

function TrustBar() {
  const items = [
    { icon: ShieldCheck, label: "Licensed & Insured" },
    { icon: MapPin, label: "DMV Area Specialists" },
    { icon: Clock, label: "24/7 Emergency Service" },
    { icon: Star, label: "4.9★ — 500+ Reviews" },
    { icon: CheckCircle2, label: "Upfront Flat-Rate Pricing" },
  ];
  return (
    <section className="bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-6 grid grid-cols-2 md:grid-cols-5 gap-5">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-2.5 text-sm">
            <it.icon className="size-5 text-turquoise shrink-0" />
            <span className="text-charcoal font-medium">{it.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function EstimatorSection({ onBook }: { onBook: () => void }) {
  return (
    <section id="estimate" className="py-20 bg-secondary/40 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <p className="text-turquoise text-xs font-semibold tracking-[0.2em] uppercase mb-3">Transparent Pricing</p>
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-charcoal mb-5 leading-tight">
                Know Your Cost <br />Before We Arrive.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                No surprises, no runaround. Use our instant estimator to get a rough price range for your HVAC project — then book with confidence.
              </p>
              <ul className="space-y-3">
                {[
                  "Estimates based on real 2026 DMV contractor pricing",
                  "Select service type, job size, and timing",
                  "Emergency & after-hours rates shown upfront",
                  "Book directly from the calculator",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-charcoal/85">
                    <CheckCircle2 className="size-4 text-turquoise shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <PriceCalculator onBook={onBook} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ kicker, title, sub, titleClassName }: { kicker?: string; title: string; sub?: string; titleClassName?: string }) {
  return (
    <Reveal>
      <div className="text-center max-w-3xl mx-auto mb-14">
        {kicker && <p className="text-turquoise text-xs font-semibold tracking-[0.2em] uppercase mb-3">{kicker}</p>}
        <h2 className={`font-display text-4xl md:text-5xl font-semibold text-charcoal mb-4 ${titleClassName || ""}`}>{title}</h2>
        {sub && <p className="text-lg text-muted-foreground leading-relaxed">{sub}</p>}
      </div>
    </Reveal>
  );
}

function WhoWeServe() {
  const cards = [
    {
      icon: Home, title: "Residential", tag: "Your home. Your comfort. Our priority.",
      items: ["Emergency AC & heating repair", "New system installation", "Seasonal tune-ups & maintenance", "Thermostat & control upgrades", "Indoor air quality solutions", "Preventive maintenance plans"],
    },
    {
      icon: Building2, title: "Commercial", tag: "Keeping your business comfortable without interruption.",
      items: ["Commercial HVAC service & repair", "Multi-unit & rooftop systems", "Chiller & boiler maintenance", "Building automation integration", "Energy efficiency audits", "Code-compliant commercial work"],
    },
    {
      icon: Landmark, title: "Government", tag: "Meeting the highest standards for public facilities.",
      items: ["Government facility HVAC", "Compliance documentation", "Scheduled maintenance programs", "Priority emergency response", "Vetted & background-checked techs", "Long-term service contracts"],
    },
  ];
  return (
    <section id="who" className="py-24 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <SectionHeader kicker="Built for Every Customer" title="One company. Every HVAC need." sub="Residential, commercial, and government — one team, one standard of excellence across the entire DMV." />
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 100}>
              <div className="group h-full bg-white rounded-2xl border-t-4 border-turquoise p-8 shadow-sm hover:shadow-luxe transition-all hover:-translate-y-1">
                <c.icon className="size-10 text-turquoise mb-5" />
                <h3 className="font-display text-2xl font-semibold text-charcoal mb-1">{c.title}</h3>
                <p className="text-sm text-muted-foreground italic mb-5">{c.tag}</p>
                <ul className="space-y-2.5">
                  {c.items.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-charcoal/85">
                      <CheckCircle2 className="size-4 text-turquoise shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  const groups = [
    { icon: Wind, title: "AC & Cooling", items: ["Central AC repair & replacement", "Ductless mini-split install", "Refrigerant recharge & leak fix", "Capacitor & compressor repair", "Emergency same-day AC service", "AC tune-up & seasonal prep"] },
    { icon: Flame, title: "Heating & Furnace", items: ["Gas & electric furnace repair", "Furnace installation & replacement", "Heat pump install & service", "Ignitor & heat exchanger repair", "Emergency no-heat service", "Carbon monoxide safety checks"] },
    { icon: AirVent, title: "Duct Work", items: ["Duct cleaning & sanitizing", "Duct sealing & insulation", "Duct repair & replacement", "New ductwork design & install", "Static pressure balancing", "Flex duct replacement"] },
    { icon: Filter, title: "Air Quality", items: ["HEPA & media filter upgrades", "UV germicidal light install", "Whole-home humidifiers", "Dehumidifier installation", "IAQ testing & monitoring", "Ventilation improvements"] },
    { icon: Siren, title: "Emergency Service", items: ["24/7 emergency dispatch", "No-AC response in summer heat", "No-heat response in winter", "Refrigerant leak emergency", "No after-hours surcharge for members", "Government & commercial priority"] },
    { icon: ShieldCheck, title: "Maintenance Plans", items: ["Spring AC tune-up", "Fall heating tune-up", "Priority scheduling year-round", "Discounts on parts & labor", "Filter replacement reminders", "Energy efficiency reports"] },
  ];
  return (
    <section id="services" className="py-24 bg-secondary/40 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <SectionHeader kicker="Everything HVAC. All In One Place." title="A complete comfort service." sub="We handle everything — from a tripped breaker to a full system replacement. No subcontracting, no runaround." />
        <div className="grid md:grid-cols-2 gap-6">
          {groups.map((g, i) => (
            <Reveal key={g.title} delay={(i % 2) * 80}>
              <div className="h-full p-8 rounded-2xl border border-border hover:border-turquoise/50 transition bg-white hover:shadow-luxe">
                <div className="flex items-center gap-3 mb-5">
                  <div className="size-12 rounded-xl bg-turquoise/10 flex items-center justify-center">
                    <g.icon className="size-6 text-turquoise" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-charcoal">{g.title}</h3>
                </div>
                <ul className="space-y-2.5">
                  {g.items.map((item) => (
                    <li key={item} className="flex gap-2 text-charcoal/85">
                      <CheckCircle2 className="size-4 text-turquoise shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "Get Your Estimate", body: "Use our instant calculator to see a price range for your job. No obligation — just transparency before anyone shows up." },
    { n: "02", title: "Book & We Dispatch", body: "Book online, by phone, or via AI in seconds. A licensed ABC HVAC technician is dispatched with the right parts to fix it right the first time." },
    { n: "03", title: "Problem Solved. Guaranteed.", body: "We complete the work, walk you through what was done, and back it with a satisfaction guarantee. Follow-up is automated — no chasing required." },
  ];
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <SectionHeader kicker="How It Works" title="From Hot to Fixed in 3 Steps" />
        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-px bg-gradient-to-r from-turquoise/20 via-turquoise to-turquoise/20" />
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 150}>
              <div className="relative bg-secondary/40 rounded-2xl p-8 border border-border text-center">
                <div className="size-20 mx-auto rounded-full bg-white border-2 border-turquoise flex items-center justify-center font-display text-2xl font-bold text-turquoise mb-5 relative z-10 shadow-sm">
                  {s.n}
                </div>
                <h3 className="font-display text-xl font-semibold text-charcoal mb-3">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function AISection() {
  const [demoOpen, setDemoOpen] = useState(false);
  const features = [
    { icon: Mic, title: "AI Voice Agent", body: "Answers every call in under 1 second. Handles FAQs, books appointments, and routes emergencies to a live HVAC tech immediately." },
    { icon: Calendar, title: "Instant Scheduling", body: "Book online or by phone any time. Our system confirms your appointment automatically and sends reminders." },
    { icon: CheckCircle2, title: "Automated Follow-Up", body: "After every job, we follow up automatically to make sure you're satisfied — and make it easy to leave a review." },
  ];
  return (
    <section id="ai" className="py-24 bg-secondary/40 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <SectionHeader kicker="Always On. Always Ready." title="You shouldn't wait on hold for an HVAC tech." sub="ABC HVAC uses AI to make sure every call is answered, every appointment is booked, and every emergency is routed — instantly, day or night." />

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 100}>
              <div className="p-7 rounded-2xl bg-white hover:border-turquoise/40 border border-transparent hover:border transition">
                <f.icon className="size-9 text-turquoise mb-4" />
                <h3 className="font-display text-xl font-semibold text-charcoal mb-2">{f.title}</h3>
                <p className="text-muted-foreground">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="rounded-3xl bg-gradient-to-br from-charcoal to-charcoal-soft p-1 shadow-luxe">
            <div className="bg-charcoal rounded-[22px] p-8 md:p-12 grid md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-turquoise text-xs font-semibold tracking-[0.2em] uppercase mb-3">Live Demo</p>
                <h3 className="font-display text-3xl md:text-4xl font-semibold text-white mb-4">Try the Demo — See Our AI HVAC Assistant</h3>
                <p className="text-white/70 mb-6">Sample: customer reports AC failure → AI qualifies urgency → books emergency slot → confirms via SMS within 60 seconds.</p>
                <button
                  onClick={() => setDemoOpen(true)}
                  className="bg-turquoise text-white font-semibold px-6 py-3.5 rounded-xl inline-flex items-center gap-2 hover:opacity-90 transition shadow-turquoise"
                >
                  <Mic className="size-5" /> Launch Interactive Demo
                </button>
              </div>
              <div className="bg-white rounded-2xl p-5 space-y-3 text-sm shadow-luxe">
                <DemoBubble who="AI">Hi, this is ABC HVAC. What's the issue today?</DemoBubble>
                <DemoBubble who="You">My AC stopped working and it's 95 degrees outside.</DemoBubble>
                <DemoBubble who="AI">That's an emergency — I'm dispatching a tech now. Can I confirm your address?</DemoBubble>
                <DemoBubble who="You">456 Oak Ave, Silver Spring.</DemoBubble>
                <DemoBubble who="AI">Technician James is en route — arrives within 45 minutes. SMS confirmation sent.</DemoBubble>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </section>
  );
}

function DemoBubble({ who, children }: { who: "AI" | "You"; children: React.ReactNode }) {
  const isAI = who === "AI";
  return (
    <div className={`flex ${isAI ? "justify-start" : "justify-end"}`}>
      <div className={`max-w-[85%] px-4 py-2 rounded-2xl ${isAI ? "bg-secondary text-charcoal rounded-bl-sm" : "bg-turquoise text-white rounded-br-sm"}`}>
        {children}
      </div>
    </div>
  );
}

function ServiceArea() {
  const areas = ["Washington DC", "Montgomery County MD", "Prince George's County MD", "Northern Virginia", "Arlington", "Alexandria", "Fairfax", "Bethesda", "Silver Spring", "Rockville", "Gaithersburg", "Annapolis"];
  return (
    <section id="area" className="py-24 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <SectionHeader kicker="DMV Service Area" title="Proudly Serving the Entire DMV" sub="From DC to Annapolis, Silver Spring to Alexandria — we're your local HVAC experts." />
        <Reveal>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {areas.map((a) => (
              <span key={a} className="bg-secondary/60 border border-border hover:border-turquoise px-5 py-2.5 rounded-full text-sm font-medium text-charcoal flex items-center gap-2 transition hover:shadow-sm">
                <MapPin className="size-4 text-turquoise" /> {a}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FoundingBanner() {
  return (
    <section className="py-12 bg-secondary/40">
      <div className="max-w-5xl mx-auto px-5 lg:px-8">
        <Reveal>
          <div className="rounded-2xl bg-turquoise/10 border border-turquoise/30 p-8 text-center">
            <span className="inline-block bg-turquoise text-white text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-full mb-4">
              ● Founding Customer Spots Available — Limited
            </span>
            <p className="text-charcoal text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
              <strong>ABC HVAC is now serving the DMV</strong> — be one of our founding customers and receive priority scheduling and a free system inspection with your first service call.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function EmergencyBanner() {
  return (
    <section className="bg-charcoal py-16">
      <div className="max-w-6xl mx-auto px-5 lg:px-8 grid md:grid-cols-[1fr_auto] gap-8 items-center">
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-3">
            HVAC Emergency? <span className="text-turquoise">We're Ready Right Now.</span>
          </h2>
          <p className="text-white/75 text-lg">No AC in summer heat, no heat in winter — 24/7 dispatch across the DMV. Talk to our AI agent or call directly. We'll have a tech on the way.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => startVapi(VAPI_ASSISTANT_ID)} className="pulse-ring relative bg-turquoise text-white font-semibold px-6 py-3.5 rounded-xl inline-flex items-center justify-center gap-2 hover:opacity-90 transition">
            <Phone className="size-5" /> Speak With Someone Now
          </button>
          <a href={`tel:${PHONE}`} className="bg-transparent border-2 border-white text-white font-semibold px-6 py-3.5 rounded-xl inline-flex items-center justify-center gap-2 hover:bg-white hover:text-charcoal transition">
            <Phone className="size-5" /> Call {PHONE}
          </a>
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ onBook }: { onBook: () => void }) {
  return (
    <section id="book" className="bg-charcoal py-24 relative overflow-hidden scroll-mt-16">
      <div className="absolute inset-0 bg-gradient-to-br from-turquoise/10 via-transparent to-transparent" />
      <div className="relative max-w-4xl mx-auto px-5 lg:px-8 text-center">
        <Reveal>
          <h2 className="font-display text-4xl md:text-6xl font-semibold text-white mb-5 leading-tight">
            Your Comfort Won't Fix Itself. <span className="text-turquoise">We Will.</span>
          </h2>
          <p className="text-white/75 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Book your appointment now or talk to our AI assistant instantly — ABC HVAC is ready for your home, business, or facility across the entire DMV.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button onClick={onBook} className="bg-turquoise text-white font-semibold px-8 py-4 rounded-xl inline-flex items-center justify-center gap-2 hover:opacity-90 shadow-turquoise transition animate-float">
              <Calendar className="size-5" /> Book My Appointment
            </button>
            <button onClick={() => startVapi(VAPI_ASSISTANT_ID)} className="pulse-ring relative bg-transparent border-2 border-white text-white font-semibold px-8 py-4 rounded-xl inline-flex items-center justify-center gap-2 hover:bg-white hover:text-charcoal transition">
              <Phone className="size-5" /> Speak With Someone Now
            </button>
          </div>
          <div className="text-white/80 space-y-1">
            <p><a href={`mailto:${EMAIL}`} className="hover:text-turquoise inline-flex items-center gap-2"><Mail className="size-4" /> {EMAIL}</a></p>
            <p><a href={`tel:${PHONE}`} className="hover:text-turquoise inline-flex items-center gap-2"><Phone className="size-4" /> {PHONE}</a></p>
          </div>
          <p className="text-white/50 text-sm mt-6">Licensed. Insured. Available 24/7. Serving DC · Maryland · Virginia</p>
        </Reveal>
      </div>
    </section>
  );
}

