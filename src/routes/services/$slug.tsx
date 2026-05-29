import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  Phone, Calendar, CheckCircle2, ArrowRight, ChevronDown, ChevronUp,
  MapPin, Wind, AirVent, Flame, Thermometer, Filter, Gauge, ShieldCheck, Siren, AlertTriangle,
} from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Reveal } from "@/components/site/Reveal";
import { VoiceWidget } from "@/components/site/VoiceWidget";

const PHONE = "(301) 555-5678";
const AREA = "Washington DC, Maryland & Virginia";

const SERVICES_DATA = {
  "ac-repair": {
    name: "AC Repair",
    icon: Wind,
    title: "AC Repair in DC, MD & VA | ABC HVAC — Same-Day Service",
    description: "Fast AC repair in Washington DC, Maryland & Virginia. Diagnose and fix air conditioner problems same day. Licensed HVAC techs — call (301) 555-5678.",
    badge: "AC Repair Specialists · Same-Day Service",
    heroLine1: "AC Not Cooling?",
    heroLine2: "Fixed Same Day.",
    heroSub: "When your AC fails on the hottest day of the year, ABC HVAC responds fast across the DMV — diagnosing and repairing all makes and models.",
    intro: "A malfunctioning air conditioner in summer heat is more than uncomfortable — it's a health risk for families and a productivity killer for businesses. ABC HVAC's certified technicians diagnose and repair all AC makes and models, carrying the most common parts on every truck to resolve most repairs in a single visit. We serve Washington DC, Maryland, and Virginia with same-day response.",
    offers: [
      "AC not cooling diagnosis & refrigerant recharge",
      "Compressor, capacitor & contactor replacement",
      "Fan motor & blower repair",
      "AC unit not turning on — electrical diagnosis",
      "Thermostat calibration & control board repair",
      "Ductless mini-split repair & service",
    ],
    signs: [
      "AC runs but doesn't cool the home effectively",
      "Warm air blowing from supply vents",
      "AC unit cycling on and off rapidly (short cycling)",
      "Unusual sounds — grinding, squealing, or banging",
      "Ice buildup on refrigerant lines or coils",
    ],
    process: [
      { n: "01", title: "Diagnose the System", body: "We test refrigerant levels, electrical components, airflow, and controls to pinpoint the exact failure point." },
      { n: "02", title: "Upfront Quote", body: "You get a clear repair quote before any work starts — no surprises on your invoice." },
      { n: "03", title: "Repair on the Spot", body: "Most repairs are completed same day. We carry common parts so you're not waiting for a second visit." },
      { n: "04", title: "Test & Confirm Cool Air", body: "We run the system through a full cooling cycle and confirm proper temperature drop before leaving." },
    ],
    faq: [
      { q: "Why is my AC running but not cooling?", a: "Common causes include low refrigerant (leak), a dirty evaporator coil, a failing compressor, or a faulty capacitor. Our tech will diagnose the exact cause on the first visit." },
      { q: "Can you repair AC same day?", a: "Yes — ABC HVAC offers same-day AC repair throughout the DMV. Call (301) 555-5678 for fast dispatch." },
      { q: "How much does AC repair cost?", a: "Minor repairs (capacitor, thermostat) run $150–$350. Refrigerant recharge is $200–$500. Major component replacements vary by part and unit. We give an upfront quote before starting." },
      { q: "Should I repair or replace my AC?", a: "If the unit is under 10 years old and the repair is under $1,000, repair usually makes sense. Over 10–12 years with a major failure, replacement often has better long-term economics." },
      { q: "Do you service all AC brands?", a: "Yes — Carrier, Trane, Lennox, Rheem, Goodman, Daikin, and all other major brands. We service both central AC and ductless mini-split systems." },
    ],
  },

  "ac-installation": {
    name: "AC Installation",
    icon: AirVent,
    title: "AC Installation in DC, MD & VA | ABC HVAC — Certified Install",
    description: "New air conditioner installation in Washington DC, Maryland & Virginia. All brands, proper sizing, certified install. Free estimates — call (301) 555-5678.",
    badge: "AC Installation · All Brands · Free Estimates",
    heroLine1: "New AC System.",
    heroLine2: "Installed Right.",
    heroSub: "Proper AC installation affects efficiency, longevity, and comfort. ABC HVAC sizes, supplies, and installs new systems across the DMV with certified technicians.",
    intro: "An AC system is only as good as its installation. Incorrect sizing, improper refrigerant charge, or poor ductwork connections create comfort problems and efficiency losses that follow a system for its entire life. ABC HVAC's certified installers size your system correctly using Manual J load calculations, source equipment from top manufacturers, and complete every installation to manufacturer specifications and local code.",
    offers: [
      "New central AC system installation (all brands)",
      "Ductless mini-split installation (single & multi-zone)",
      "AC replacement for aging or failed systems",
      "Proper Manual J sizing for your home or business",
      "Electrical upgrade & disconnect service for new equipment",
      "Refrigerant line set installation & pressure testing",
    ],
    signs: [
      "AC system over 12–15 years old and losing efficiency",
      "Repair costs approaching 50% of replacement value",
      "Home is never consistently comfortable despite a running AC",
      "Energy bills increasing year over year",
      "New construction or addition requiring fresh HVAC installation",
    ],
    process: [
      { n: "01", title: "Free In-Home Estimate", body: "We assess your home's square footage, insulation, windows, and layout to calculate the correct system size." },
      { n: "02", title: "Equipment Selection", body: "We recommend the best efficiency tier for your budget and usage — with honest payback period guidance." },
      { n: "03", title: "Professional Installation", body: "Certified installers complete the job to code — refrigerant charge verified, airflow balanced, thermostat programmed." },
      { n: "04", title: "Commissioning & Walkthrough", body: "We test the full system, verify performance, and walk you through operation and maintenance." },
    ],
    faq: [
      { q: "What size AC do I need?", a: "Sizing depends on square footage, ceiling height, insulation, window area, and climate. ABC HVAC performs a Manual J load calculation to size your system correctly — oversizing wastes money and causes humidity problems." },
      { q: "How long does AC installation take?", a: "A standard replacement installation takes 4–8 hours. New installations with new electrical and line sets may require a second day." },
      { q: "What SEER rating should I choose?", a: "SEER 16–18 is the sweet spot for most DMV homeowners — high enough efficiency for significant utility savings, without the premium cost of very high SEER units." },
      { q: "Do you offer financing?", a: "Yes — ABC HVAC offers flexible financing options for new AC systems. Ask during your free estimate." },
      { q: "How long will a new AC last?", a: "A properly installed and maintained AC system lasts 15–20 years. Annual tune-ups are the single best investment to maximize that lifespan." },
    ],
  },

  "furnace-repair": {
    name: "Furnace Repair",
    icon: Flame,
    title: "Furnace Repair in DC, MD & VA | ABC HVAC — Fast Response",
    description: "Emergency furnace repair in Washington DC, Maryland & Virginia. No heat? We dispatch same day. Licensed HVAC techs — call (301) 555-5678.",
    badge: "Furnace Repair · Emergency Response",
    heroLine1: "No Heat?",
    heroLine2: "We Fix It Fast.",
    heroSub: "A furnace failure in winter is an emergency. ABC HVAC dispatches certified techs across the DMV same day — carrying common parts to resolve most repairs in one visit.",
    intro: "When your furnace stops working in the middle of winter, every hour matters. ABC HVAC provides emergency furnace repair throughout Washington DC, Maryland, and Virginia. Our certified technicians diagnose gas, electric, and oil furnace failures quickly, carry common replacement parts on every truck, and resolve most repairs the same day you call.",
    offers: [
      "Gas furnace diagnosis & repair (all brands)",
      "Electric furnace heating element & control repair",
      "Ignitor, flame sensor & heat exchanger service",
      "Blower motor & inducer fan replacement",
      "Limit switch, pressure switch & control board repair",
      "Carbon monoxide safety inspection with every furnace call",
    ],
    signs: [
      "Furnace turns on but no warm air comes through vents",
      "Furnace repeatedly cycling on and off (short cycling)",
      "Unusual smell — burning dust, gas odor, or electrical smell",
      "Loud banging, rattling, or squealing when furnace runs",
      "Pilot light out or ignition failure",
    ],
    process: [
      { n: "01", title: "Safety Check First", body: "We inspect the heat exchanger for cracks and test CO levels before diagnosing other components — safety comes first on every furnace call." },
      { n: "02", title: "Diagnose the Failure", body: "We test ignition, fuel supply, electrical components, and controls to find the exact cause of the failure." },
      { n: "03", title: "Clear Repair Quote", body: "You receive an honest, upfront repair quote before we touch anything. No pressure, no upsells." },
      { n: "04", title: "Repair & Restore Heat", body: "Most furnace repairs are completed same day. We test through multiple heat cycles before leaving." },
    ],
    faq: [
      { q: "What should I do if my furnace stops working?", a: "Check the thermostat settings, replace the filter if it's clogged, and check your circuit breaker. If none of those fix it, call ABC HVAC at (301) 555-5678 for same-day service." },
      { q: "Is a cracked heat exchanger dangerous?", a: "Yes — a cracked heat exchanger can leak carbon monoxide into your home. If we find one, we'll recommend immediate repair or replacement depending on the severity." },
      { q: "How much does furnace repair cost?", a: "Minor repairs (ignitor, flame sensor, capacitor) run $150–$400. Major component replacements (heat exchanger, control board) range from $400–$1,200+. We quote before starting." },
      { q: "Can you repair a furnace in the same day?", a: "Yes — for most common failures, same-day furnace repair is available throughout the DMV. Call early for the fastest response time." },
      { q: "How long do furnaces last?", a: "Gas furnaces last 15–20 years with annual maintenance. If yours is over 15 years old and facing a major repair, replacement may be the better investment." },
    ],
  },

  "furnace-install": {
    name: "Furnace Installation",
    icon: Flame,
    title: "Furnace Installation in DC, MD & VA | ABC HVAC — Licensed Install",
    description: "New furnace installation & replacement in Washington DC, Maryland & Virginia. All brands, proper sizing, certified install. Free estimates — call (301) 555-5678.",
    badge: "Furnace Installation · All Brands",
    heroLine1: "New Furnace.",
    heroLine2: "Installed Right.",
    heroSub: "Proper furnace installation is the foundation of reliable home heating. ABC HVAC sizes, supplies, and installs new furnaces across the DMV with certified technicians.",
    intro: "Furnace installation is not a DIY project — proper gas line connections, venting, electrical wiring, and airflow balance require certified expertise. ABC HVAC's licensed installers size furnaces correctly for your home, install to local code and manufacturer specifications, and ensure every system is commissioned for peak efficiency and safety before leaving your property.",
    offers: [
      "Gas furnace installation & replacement (all brands)",
      "High-efficiency furnace installation (90%+ AFUE)",
      "Propane & oil furnace installation",
      "Furnace replacement for failed or aging systems",
      "New construction furnace installation",
      "Zone system integration & thermostat programming",
    ],
    signs: [
      "Furnace over 15–20 years old with declining efficiency",
      "Repair estimate exceeds 50% of replacement cost",
      "Rising heating bills despite similar usage",
      "Home never reaches comfortable temperature",
      "Frequent repair calls in recent years",
    ],
    process: [
      { n: "01", title: "Free Estimate & Sizing", body: "We calculate your heating load correctly — avoiding an undersized system that can't heat your home or an oversized one that short-cycles." },
      { n: "02", title: "Equipment Recommendation", body: "We recommend the right efficiency tier (80% vs 96% AFUE) with honest payback period math for your specific situation." },
      { n: "03", title: "Licensed Installation", body: "Gas lines, venting, electrical, and airflow — all installed to code with proper permits where required." },
      { n: "04", title: "Commission & Test", body: "We verify heat output, check all safeties, and run the system through multiple cycles before sign-off." },
    ],
    faq: [
      { q: "What AFUE rating should I choose?", a: "80% AFUE is the minimum for new installations. 96%+ AFUE units cost more upfront but can save significantly on gas bills — especially in the DMV's cold winters. We'll show you the math." },
      { q: "How long does furnace installation take?", a: "Standard replacements take 4–8 hours. New gas line runs or complex venting situations may require an additional day." },
      { q: "Do I need a permit for a new furnace?", a: "In most DC, Maryland, and Virginia jurisdictions, yes. ABC HVAC handles permit filing where required as part of the installation." },
      { q: "Can I upgrade from an 80% to a 96% furnace?", a: "Yes, though 96% furnaces require PVC exhaust venting instead of metal flue, which adds installation time and cost. We'll assess your situation during the estimate." },
      { q: "What brands do you install?", a: "Carrier, Trane, Lennox, Rheem, Goodman, Daikin, and Bryant — we work with all major brands and can source the right unit for your home and budget." },
    ],
  },

  "heat-pump": {
    name: "Heat Pump Service",
    icon: Thermometer,
    title: "Heat Pump Installation & Repair in DC, MD & VA | ABC HVAC",
    description: "Heat pump installation, repair & service in Washington DC, Maryland & Virginia. All brands, same-day service available. Licensed HVAC techs — call (301) 555-5678.",
    badge: "Heat Pump Specialists · Installation & Repair",
    heroLine1: "Heat Pump Issues?",
    heroLine2: "Expert Fix.",
    heroSub: "From emergency repairs to new heat pump installations, ABC HVAC's certified technicians handle all heat pump systems across the DMV.",
    intro: "Heat pumps are the most efficient heating and cooling solution for the DMV's climate — providing both heating and cooling from a single system. ABC HVAC installs, services, and repairs all heat pump types: traditional split systems, ductless mini-splits, and dual-fuel systems that pair a heat pump with a gas furnace backup. We carry parts for all major brands and offer same-day repair service.",
    offers: [
      "Heat pump installation (split, mini-split, dual-fuel)",
      "Heat pump repair for all brands and models",
      "Refrigerant recharge & leak repair",
      "Reversing valve & defrost board replacement",
      "Auxiliary heat troubleshooting",
      "Cold-climate heat pump installation",
    ],
    signs: [
      "Heat pump blowing cold air in heat mode",
      "System running constantly without reaching set temperature",
      "Ice buildup on outdoor unit in non-defrost conditions",
      "Unusual noises from indoor or outdoor unit",
      "Emergency (auxiliary) heat running all the time",
    ],
    process: [
      { n: "01", title: "Diagnose Heating & Cooling Modes", body: "We test the system in both modes — refrigerant pressure, reversing valve, defrost cycle, and airflow." },
      { n: "02", title: "Identify the Root Cause", body: "Heat pump problems often mimic other HVAC issues. We find the actual failure point before recommending repairs." },
      { n: "03", title: "Repair or Replace Components", body: "Common repairs are done on-site. If the system is beyond repair, we'll recommend the best replacement option." },
      { n: "04", title: "Verify Performance", body: "We test heating and cooling output, verify defrost operation, and confirm proper efficiency before leaving." },
    ],
    faq: [
      { q: "Why is my heat pump blowing cold air in heat mode?", a: "Common causes include low refrigerant, a faulty reversing valve, or a defrost cycle issue. ABC HVAC will diagnose the exact cause on the first visit." },
      { q: "Are heat pumps efficient in cold DMV winters?", a: "Modern cold-climate heat pumps (like Mitsubishi Hyper Heat or Bosch) work efficiently down to -13°F. For older systems, a dual-fuel setup with a gas furnace backup handles extreme cold well." },
      { q: "What's the difference between a heat pump and a mini-split?", a: "A mini-split is a type of heat pump — it's ductless, serving individual zones. Both heat and cool using refrigerant. Mini-splits are ideal for additions, garages, or zoned comfort control." },
      { q: "How long do heat pumps last?", a: "With annual maintenance, 15–20 years. Ductless mini-splits often last longer due to simpler operation." },
      { q: "Is a heat pump more efficient than a gas furnace?", a: "In mild to moderate winters, yes — a heat pump moves heat rather than generating it, achieving efficiency ratios of 2–4x. In very cold weather, a gas furnace backup may be more cost-effective depending on gas vs electricity prices in your area." },
    ],
  },

  "duct-cleaning": {
    name: "Duct Cleaning",
    icon: Filter,
    title: "Air Duct Cleaning in DC, MD & VA | ABC HVAC — Professional Service",
    description: "Professional air duct cleaning in Washington DC, Maryland & Virginia. Remove dust, allergens & mold from HVAC ducts. Licensed technicians — call (301) 555-5678.",
    badge: "Air Duct Cleaning · Allergen Removal",
    heroLine1: "Dusty Ducts.",
    heroLine2: "Cleaner Air.",
    heroSub: "Dirty ducts circulate dust, allergens, and mold through your home every time the HVAC runs. ABC HVAC cleans them properly across the DMV.",
    intro: "Your ductwork is the delivery system for every cubic foot of air your HVAC system moves. Over time, dust, allergens, pet dander, mold spores, and even vermin debris accumulate in ducts — and your HVAC system distributes them through your home every time it runs. ABC HVAC performs professional duct cleaning using truck-mounted vacuum systems and rotary brush equipment to thoroughly clean your duct system, improving air quality and HVAC efficiency.",
    offers: [
      "Full supply and return duct vacuuming",
      "Rotary brush cleaning for stubborn buildup",
      "Mold and mildew treatment in duct systems",
      "Air handler and evaporator coil cleaning",
      "Duct sealing for leaks found during cleaning",
      "Dryer vent cleaning (fire hazard prevention)",
    ],
    signs: [
      "Visible dust blowing from supply vents when HVAC runs",
      "Increased allergy or asthma symptoms indoors",
      "Musty or stale odor when the HVAC is running",
      "Ducts not cleaned in more than 3–5 years",
      "Recent home renovation generating drywall or construction dust",
    ],
    process: [
      { n: "01", title: "Inspection & Assessment", body: "We inspect your ductwork with a camera before cleaning — so you see exactly what's in there before we start." },
      { n: "02", title: "Create Negative Pressure", body: "Our truck-mounted vacuum creates negative pressure throughout the duct system, pulling contaminated air toward the collection unit." },
      { n: "03", title: "Agitate & Extract", body: "Rotary brushes loosen stuck debris while the vacuum extracts everything — including dust, allergens, and mold spores." },
      { n: "04", title: "Verify & Seal", body: "Post-cleaning camera inspection confirms clean ducts. Any leaks found are sealed to prevent re-contamination." },
    ],
    faq: [
      { q: "How often should ducts be cleaned?", a: "Every 3–5 years for most homes. More frequently if you have pets, allergies, recent renovations, or visible mold in the system." },
      { q: "Does duct cleaning actually improve air quality?", a: "Yes — when done properly with negative pressure and agitation equipment. Avoid companies offering very low flat rates without truck-mounted equipment." },
      { q: "How long does duct cleaning take?", a: "A typical home takes 3–5 hours. Larger homes or heavily contaminated systems may take longer." },
      { q: "Can you clean ducts with mold in them?", a: "Yes — we treat mold-contaminated ducts with EPA-approved antimicrobial treatments after mechanical cleaning. However, the source of moisture causing mold must also be addressed to prevent recurrence." },
      { q: "Should I replace my filter after duct cleaning?", a: "Absolutely. We recommend installing a fresh filter immediately after duct cleaning to capture any remaining fine particles the cleaning process may have disturbed." },
    ],
  },

  "thermostat": {
    name: "Thermostat Service",
    icon: Gauge,
    title: "Thermostat Installation & Repair in DC, MD & VA | ABC HVAC",
    description: "Smart thermostat installation, thermostat repair & replacement in Washington DC, Maryland & Virginia. All brands — call (301) 555-5678.",
    badge: "Thermostat Installation & Repair",
    heroLine1: "Wrong Temperature?",
    heroLine2: "Thermostat Fixed.",
    heroSub: "A faulty thermostat wastes energy and leaves your home uncomfortable. ABC HVAC installs and repairs all thermostat types across the DMV.",
    intro: "Your thermostat is the brain of your HVAC system — when it malfunctions, your comfort and energy bills suffer. ABC HVAC installs, programs, and repairs all thermostat types across the DMV: traditional mercury thermostats, programmable models, WiFi-enabled smart thermostats, and multi-stage systems for heat pumps. A properly installed smart thermostat can reduce HVAC energy consumption by 10–23% annually.",
    offers: [
      "Smart thermostat installation (Nest, Ecobee, Honeywell)",
      "Programmable thermostat installation & programming",
      "Thermostat wiring diagnosis & repair",
      "Multi-stage thermostat for heat pump systems",
      "Zoning system thermostat installation",
      "Old thermostat replacement & system compatibility check",
    ],
    signs: [
      "HVAC runs when thermostat is already at target temperature",
      "Temperature in home consistently differs from thermostat reading",
      "HVAC won't turn on despite correct thermostat setting",
      "Thermostat display blank or unresponsive",
      "HVAC short cycling (turning on/off every few minutes)",
    ],
    process: [
      { n: "01", title: "Diagnose the Thermostat", body: "We test wiring, check voltage, and verify signal communication between the thermostat and HVAC equipment." },
      { n: "02", title: "Confirm Compatibility", body: "We verify that any new thermostat is compatible with your specific HVAC system — especially important for heat pumps and multi-stage systems." },
      { n: "03", title: "Install & Wire Correctly", body: "We connect all wires to spec, install the C-wire adapter if needed, and secure the unit level." },
      { n: "04", title: "Program & Test", body: "We program your schedule, connect to WiFi if applicable, and test heating and cooling response before leaving." },
    ],
    faq: [
      { q: "Can I install a Nest or Ecobee myself?", a: "Technically yes, but wiring errors can damage HVAC equipment — especially heat pumps. If your system has more than 5 wires or uses multi-stage heating, professional installation is strongly recommended." },
      { q: "Why is my thermostat not responding?", a: "Common causes include dead batteries, tripped circuit breaker, blown fuse on the control board, or a loose/corroded wire connection." },
      { q: "Do smart thermostats work with heat pumps?", a: "Yes — but only compatible models. Not all smart thermostats support the O/B reversing valve wire required by heat pumps. We'll confirm compatibility before installation." },
      { q: "How much can a smart thermostat save?", a: "Studies show 10–23% savings on heating and cooling bills. With average DMV HVAC costs, that typically means $100–$250/year in savings." },
      { q: "What's the C-wire and do I need one?", a: "The C-wire (common wire) provides continuous 24V power to the thermostat — required by most smart thermostats. ABC HVAC can install a C-wire adapter if your system doesn't have one." },
    ],
  },

  "air-quality": {
    name: "Air Quality Systems",
    icon: Filter,
    title: "Indoor Air Quality Systems in DC, MD & VA | ABC HVAC",
    description: "Whole-home air purifiers, UV lights, humidifiers & dehumidifiers in Washington DC, Maryland & Virginia. Breathe cleaner air — call (301) 555-5678.",
    badge: "Indoor Air Quality · Whole-Home Solutions",
    heroLine1: "Breathe Better",
    heroLine2: "At Home.",
    heroSub: "Allergens, mold spores, VOCs, and humidity imbalance affect your family's health. ABC HVAC installs whole-home air quality systems across the DMV.",
    intro: "The air inside your home can be 2–5 times more polluted than outdoor air. Allergens, dust mites, mold spores, VOCs from building materials, and humidity imbalances contribute to respiratory issues, poor sleep, and discomfort. ABC HVAC installs whole-home air quality systems that integrate directly into your HVAC — improving air quality throughout every room, automatically.",
    offers: [
      "Whole-home HEPA and media air cleaners",
      "UV air purifier installation (kills bacteria, mold, viruses)",
      "Whole-home humidifier installation & service",
      "Whole-home dehumidifier installation",
      "Energy recovery ventilator (ERV) installation",
      "Air quality testing & assessment",
    ],
    signs: [
      "Family members with allergies, asthma, or frequent respiratory illness",
      "Visible dust on furniture shortly after cleaning",
      "Excessive static electricity in winter (low humidity)",
      "Condensation on windows or musty smells (high humidity)",
      "Chemical or stale odors present despite clean home",
    ],
    process: [
      { n: "01", title: "Air Quality Assessment", body: "We test your indoor air for particulates, humidity, and VOC levels to understand what your home specifically needs." },
      { n: "02", title: "Recommend the Right Solution", body: "We recommend integrated solutions based on your actual air quality data — not a generic product upsell." },
      { n: "03", title: "Install & Integrate", body: "All systems are installed directly into your existing HVAC, treating air from every room automatically." },
      { n: "04", title: "Verify Performance", body: "Post-installation testing confirms improved particulate levels and correct humidity range." },
    ],
    faq: [
      { q: "What's the best air purifier for allergies?", a: "For allergy sufferers, a whole-home media air cleaner with a MERV 11–13 filter combined with a UV purifier provides the most comprehensive protection against allergens, mold, and bacteria." },
      { q: "Do I need a humidifier in the DMV?", a: "Yes — in winter, forced-air heating drops indoor humidity below 30%, causing dry skin, static electricity, and making you feel colder than the thermostat reading. A whole-home humidifier maintains 35–50% RH automatically." },
      { q: "Do UV lights in HVAC systems actually work?", a: "Yes — UV-C lights installed at the coil and air handler kill mold, bacteria, and certain viruses. Combined with a good filter, they significantly reduce biological contamination." },
      { q: "What's an ERV and do I need one?", a: "An Energy Recovery Ventilator brings fresh outdoor air in while capturing the energy from outgoing stale air. It's ideal for tightly sealed modern homes that need ventilation without energy loss." },
      { q: "How often do whole-home air cleaner filters need replacement?", a: "High-efficiency media filters in whole-home systems typically last 6–12 months, versus 1–3 months for standard 1-inch filters — making them more cost-effective long-term." },
    ],
  },

  "emergency-hvac": {
    name: "Emergency HVAC",
    icon: Siren,
    title: "24/7 Emergency HVAC Repair in DC, MD & VA | ABC HVAC",
    description: "24/7 emergency HVAC repair in Washington DC, Maryland & Virginia. No heat, no AC, furnace failure — fast dispatch. Licensed technicians — call (301) 555-5678.",
    badge: "24/7 Emergency HVAC · Fast Dispatch",
    heroLine1: "HVAC Emergency?",
    heroLine2: "We Come to You.",
    heroSub: "No AC in summer heat or no heat in winter cold — ABC HVAC dispatches certified technicians 24 hours a day across Washington DC, Maryland & Virginia.",
    intro: "HVAC emergencies don't follow business hours. A furnace failure on a January night or an AC breakdown during a July heat wave demands immediate response. ABC HVAC provides 24/7 emergency HVAC service throughout the DMV — dispatching certified technicians with well-stocked trucks to diagnose and resolve your emergency as quickly as possible.",
    offers: [
      "24/7 emergency AC failure response",
      "After-hours furnace repair & no-heat calls",
      "Emergency heat pump failure service",
      "Carbon monoxide alarm triggered — emergency inspection",
      "Refrigerant leak emergency response",
      "Frozen pipe prevention HVAC support in extreme cold",
    ],
    signs: [
      "Complete loss of heating in below-freezing temperatures",
      "AC failure during extreme heat (health risk for elderly/children)",
      "Carbon monoxide alarm triggered — evacuate first, then call",
      "Gas odor near furnace — evacuate first, then call",
      "HVAC system causing electrical breaker trips repeatedly",
    ],
    process: [
      { n: "01", title: "Call Anytime", body: "Call (301) 555-5678 — our emergency line is staffed 24/7. Tell us your situation and we'll dispatch immediately." },
      { n: "02", title: "Fast Dispatch", body: "A certified HVAC technician is dispatched with a fully stocked truck. We give you an honest ETA based on your location." },
      { n: "03", title: "Diagnose & Repair", body: "We diagnose and fix the emergency on-site wherever possible. If parts are needed that aren't on the truck, we'll advise on interim safety measures." },
      { n: "04", title: "Safe Before We Leave", body: "We don't leave your home until the emergency is resolved or your system is safely shut down with clear next steps provided." },
    ],
    faq: [
      { q: "What counts as an HVAC emergency?", a: "No heat below 35°F, no AC above 95°F for vulnerable occupants, carbon monoxide alarms, gas smell near furnace (evacuate first), and electrical issues causing repeated breaker trips." },
      { q: "Is there an extra charge for emergency service?", a: "Yes — after-hours and weekend emergency calls carry a premium rate. We're transparent about this when you call, before any work begins." },
      { q: "What should I do if I smell gas near my furnace?", a: "Leave the building immediately without touching any switches. Call 911 and your gas utility from outside or a neighbor's phone. Call ABC HVAC only after the gas company has cleared the property." },
      { q: "What should I do if my carbon monoxide alarm goes off?", a: "Evacuate everyone including pets immediately. Call 911 from outside. Don't re-enter until cleared by emergency services. Then call ABC HVAC for an emergency inspection." },
      { q: "How quickly can ABC HVAC respond?", a: "Response times vary by location and current call volume. We give an honest ETA when you call — typically 1–3 hours for the DMV area." },
    ],
  },

  "preventive-maintenance": {
    name: "Preventive Maintenance",
    icon: ShieldCheck,
    title: "HVAC Preventive Maintenance in DC, MD & VA | ABC HVAC Tune-Up",
    description: "HVAC preventive maintenance & tune-up in Washington DC, Maryland & Virginia. Annual AC and furnace maintenance. Licensed technicians — call (301) 555-5678.",
    badge: "HVAC Tune-Up & Preventive Maintenance",
    heroLine1: "Skip the Breakdown.",
    heroLine2: "Book a Tune-Up.",
    heroSub: "One annual maintenance visit prevents costly emergency repairs, extends equipment life, and keeps your HVAC running at peak efficiency across the DMV.",
    intro: "HVAC systems that receive annual maintenance last longer, run more efficiently, and break down far less often than neglected systems. ABC HVAC's preventive maintenance visits cover all critical components of your heating and cooling system — cleaning coils, checking refrigerant, testing electrical connections, lubricating moving parts, and identifying small problems before they become expensive emergencies.",
    offers: [
      "Annual AC tune-up (spring) — full system inspection & cleaning",
      "Annual furnace tune-up (fall) — heat exchanger, ignition, controls",
      "Refrigerant level check & leak test",
      "Electrical component testing & tightening",
      "Coil cleaning (evaporator & condenser)",
      "Priority scheduling for maintenance plan members",
    ],
    signs: [
      "HVAC system not serviced in the past 12 months",
      "Higher energy bills compared to previous years",
      "System requires frequent repairs",
      "Unusual sounds that weren't present last season",
      "Purchasing a home with unknown HVAC maintenance history",
    ],
    process: [
      { n: "01", title: "Schedule Before the Season", body: "Spring for AC, fall for furnace — scheduling ahead ensures you get the appointment before demand peaks." },
      { n: "02", title: "Full System Inspection", body: "We inspect every component: refrigerant, coils, electrical, controls, drainage, filters, and safety limits." },
      { n: "03", title: "Clean & Tune", body: "Coils are cleaned, moving parts lubricated, drain lines flushed, and the system tuned for maximum efficiency." },
      { n: "04", title: "Report & Recommendations", body: "You receive a written report of system condition and any items we recommend addressing — with no pressure to act immediately." },
    ],
    faq: [
      { q: "How often should I have my HVAC maintained?", a: "Twice yearly is ideal — once for the AC before summer and once for the furnace before winter. At minimum, one annual visit is far better than none." },
      { q: "Does maintenance actually prevent breakdowns?", a: "Yes — studies show properly maintained HVAC systems experience 95% fewer breakdowns than unmaintained systems. The cost of a tune-up is a fraction of a single emergency call." },
      { q: "What's included in an ABC HVAC maintenance visit?", a: "A full 20+ point inspection covering refrigerant, coils, electrical connections, controls, drainage, filters, motors, and safety components — for both heating and cooling modes." },
      { q: "Do you offer maintenance plans?", a: "Yes — ABC HVAC's maintenance plan includes priority scheduling, discounted repairs, and annual tune-ups for a flat annual fee. Ask about plan pricing when you call." },
      { q: "What if problems are found during maintenance?", a: "We document findings and provide a clear quote for any recommended repairs. You decide what to address and when — we never pressure you into same-day repairs." },
    ],
  },
} as const;

type ServiceSlug = keyof typeof SERVICES_DATA;

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const svc = SERVICES_DATA[params.slug as ServiceSlug] ?? null;
    if (!svc) throw notFound();
    return { svc, slug: params.slug as ServiceSlug };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.svc) return {};
    const { svc } = loaderData;
    return {
      meta: [
        { title: svc.title },
        { name: "description", content: svc.description },
        { property: "og:title", content: svc.title },
        { property: "og:description", content: svc.description },
        { property: "og:type", content: "website" },
        { name: "robots", content: "index, follow" },
      ],
    };
  },
  component: ServicePage,
});

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-charcoal hover:bg-secondary/50 transition">
        <span>{q}</span>
        {open ? <ChevronUp className="size-4 text-turquoise shrink-0" /> : <ChevronDown className="size-4 text-turquoise shrink-0" />}
      </button>
      {open && <div className="px-5 pb-4 text-charcoal/80 text-sm leading-relaxed">{a}</div>}
    </div>
  );
}

function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

function buildSchemas(svc: (typeof SERVICES_DATA)[ServiceSlug]) {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "HVACBusiness",
    name: "ABC HVAC",
    telephone: "+13015555678",
    email: "service@abchvac.com",
    openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], opens: "00:00", closes: "23:59" }],
    priceRange: "$$",
    areaServed: ["Washington DC", "Maryland", "Virginia"],
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: svc.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: svc.name,
    provider: { "@type": "HVACBusiness", name: "ABC HVAC" },
    areaServed: { "@type": "State", name: "Maryland" },
    description: svc.description,
  };
  return { localBusiness, faqSchema, serviceSchema };
}

function ServicePage() {
  const { svc } = Route.useLoaderData();
  const Icon = svc.icon;
  const schemas = buildSchemas(svc);

  return (
    <div className="min-h-screen bg-background text-charcoal">
      <JsonLd data={schemas.localBusiness} />
      <JsonLd data={schemas.faqSchema} />
      <JsonLd data={schemas.serviceSchema} />

      <SiteHeader bookHref="/#estimate" />

      <section className="bg-charcoal py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-turquoise/10 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-turquoise text-xs font-semibold tracking-[0.2em] uppercase mb-5">
              <Icon className="size-4" /> {svc.badge}
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-white leading-[1.05] mb-5">
              {svc.heroLine1} <span className="text-turquoise">{svc.heroLine2}</span>
            </h1>
            <p className="text-xl text-white/75 leading-relaxed mb-8 max-w-2xl">{svc.heroSub}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/#estimate" className="group bg-turquoise text-white font-semibold px-7 py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 shadow-turquoise transition">
                <Calendar className="size-5" /> Get Free Estimate
                <ArrowRight className="size-4 group-hover:translate-x-1 transition" />
              </a>
              <a href={`tel:${PHONE}`} className="bg-transparent border-2 border-white text-white font-semibold px-7 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white hover:text-charcoal transition">
                <Phone className="size-5 text-turquoise" /> {PHONE}
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-4 flex flex-wrap gap-6">
          {["Licensed & Insured", "DC · MD · VA", "Available 24/7", "Same-Day Service", "Free Estimates"].map((t) => (
            <span key={t} className="flex items-center gap-2 text-sm text-charcoal/80 font-medium">
              <CheckCircle2 className="size-4 text-turquoise" /> {t}
            </span>
          ))}
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-2 gap-14 items-start">
          <Reveal>
            <div>
              <p className="text-turquoise text-xs font-semibold tracking-[0.2em] uppercase mb-3">About This Service</p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-charcoal mb-5">{svc.name} by ABC HVAC</h2>
              <p className="text-lg text-charcoal/75 leading-relaxed">{svc.intro}</p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="bg-secondary/40 rounded-2xl p-7 border border-border">
              <p className="text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-4">What's Included</p>
              <ul className="space-y-3">
                {svc.offers.map((o) => (
                  <li key={o} className="flex items-start gap-3 text-charcoal/85">
                    <CheckCircle2 className="size-4 text-turquoise shrink-0 mt-0.5" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 bg-secondary/40">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-turquoise text-xs font-semibold tracking-[0.2em] uppercase mb-3">Warning Signs</p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-charcoal">Do You Need {svc.name}?</h2>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {svc.signs.map((sign, i) => (
              <Reveal key={sign} delay={i * 60}>
                <div className="bg-white rounded-xl border border-border p-5 flex items-start gap-3">
                  <AlertTriangle className="size-5 text-turquoise shrink-0 mt-0.5" />
                  <span className="text-sm text-charcoal/85">{sign}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-10 text-center">
              <p className="text-muted-foreground mb-4">Recognizing any of these? Call ABC HVAC now.</p>
              <a href={`tel:${PHONE}`} className="bg-turquoise text-white font-semibold px-7 py-3.5 rounded-xl inline-flex items-center gap-2 hover:opacity-90 shadow-turquoise transition">
                <Phone className="size-4" /> Call {PHONE}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-turquoise text-xs font-semibold tracking-[0.2em] uppercase mb-3">Our Process</p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-charcoal">How ABC HVAC Gets It Done</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-4 gap-6">
            {svc.process.map((s, i) => (
              <Reveal key={s.n} delay={i * 100}>
                <div className="text-center bg-secondary/40 rounded-2xl p-7 border border-border">
                  <div className="size-16 mx-auto rounded-full bg-white border-2 border-turquoise flex items-center justify-center font-display text-xl font-bold text-turquoise mb-4 shadow-sm">
                    {s.n}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-charcoal mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-charcoal">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <p className="text-turquoise text-xs font-semibold tracking-[0.2em] uppercase mb-3">Why ABC HVAC</p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-5">The DMV's Trusted HVAC Team</h2>
              <p className="text-white/70 leading-relaxed mb-6">
                ABC HVAC serves Washington DC, Maryland, and Virginia with licensed, insured technicians available 24 hours a day. We carry stocked trucks, quote upfront, and stand behind every job with a satisfaction guarantee.
              </p>
              <ul className="space-y-3">
                {["Licensed & fully insured in DC, MD & VA", "Same-day and emergency service available", "Upfront pricing — no surprise invoices", "Free estimates on all installations", "All major brands serviced & installed"].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/80 text-sm">
                    <CheckCircle2 className="size-4 text-turquoise shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "24/7", sub: "Emergency Service" },
                { label: "5★", sub: "Customer Rating" },
                { label: "DC·MD·VA", sub: "Service Area" },
                { label: "Same Day", sub: "Appointments" },
              ].map((stat) => (
                <div key={stat.label} className="bg-turquoise/10 border border-turquoise/30 rounded-2xl p-6 text-center">
                  <p className="font-display text-3xl font-bold text-turquoise mb-1">{stat.label}</p>
                  <p className="text-white/70 text-sm">{stat.sub}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-5 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-turquoise text-xs font-semibold tracking-[0.2em] uppercase mb-3">Common Questions</p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-charcoal">{svc.name} FAQ</h2>
            </div>
          </Reveal>
          <div className="space-y-3">
            {svc.faq.map((item) => (
              <Reveal key={item.q}><FaqItem q={item.q} a={item.a} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary/40">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 text-center">
          <Reveal>
            <p className="text-turquoise text-xs font-semibold tracking-[0.2em] uppercase mb-3">Service Area</p>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-charcoal mb-4">
              {svc.name} — Washington DC, Maryland & Virginia
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              ABC HVAC provides {svc.name.toLowerCase()} services throughout the DMV — Washington DC, Maryland suburbs, and Northern Virginia.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Washington DC", "Bethesda", "Silver Spring", "Rockville", "Gaithersburg", "Annapolis", "Bowie", "Alexandria", "Arlington", "Fairfax"].map((city) => (
                <span key={city} className="inline-flex items-center gap-1.5 bg-white border border-border px-4 py-2 rounded-full text-sm text-charcoal font-medium">
                  <MapPin className="size-3 text-turquoise" /> {city}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-turquoise/10 via-transparent to-transparent" />
        <div className="relative max-w-3xl mx-auto px-5 lg:px-8 text-center">
          <Reveal>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-white mb-4 leading-tight">
              Ready to Book Your <span className="text-turquoise">{svc.name}?</span>
            </h2>
            <p className="text-white/75 text-lg mb-8">Get a free estimate or schedule service — same-day available across the DMV.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <a href="/#estimate" className="bg-turquoise text-white font-semibold px-8 py-4 rounded-xl inline-flex items-center justify-center gap-2 hover:opacity-90 shadow-turquoise transition">
                <Calendar className="size-5" /> Get Free Estimate
              </a>
              <a href={`tel:${PHONE}`} className="bg-transparent border-2 border-white text-white font-semibold px-8 py-4 rounded-xl inline-flex items-center justify-center gap-2 hover:bg-white hover:text-charcoal transition">
                <Phone className="size-5" /> {PHONE}
              </a>
            </div>
            <p className="text-white/50 text-sm">Licensed. Insured. Available 24/7. Serving DC · MD · VA.</p>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
      <VoiceWidget />
    </div>
  );
}
