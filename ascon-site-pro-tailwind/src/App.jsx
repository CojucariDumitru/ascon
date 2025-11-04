import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ASCON GROUP INC — Polished SPA (Pro Edition)
 * Premium enterprise look with:
 *  • Shipper Quote Wizard (modal)
 *  • Drivers-focused Contact (Recruiting)
 *  • Animated top navigation (tap + sliding underline)
 */

const ASSETS = {
  logoDark: "/assets/ascon-logo-black.png",
  logoGold: "/assets/ascon-logo-gold.jpg",
  heroTruck: "/assets/truck-hero-1.jpg",
  heroTruck2: "/assets/truck-hero-2.jpg",
  mark: "/assets/ascon-mark.png",
};

const theme = { gold: "#C6A664", black: "#0B0B0B", dark: "#0D0E10", gray: "#6B7280", light: "#F4F6F9" };
const cx = (...c) => c.filter(Boolean).join(" ");
const useHashRoute = () => {
  const [route, setRoute] = useState(() => window.location.hash.replace("#", "") || "home");
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash.replace("#", "") || "home");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return [route, (r) => (window.location.hash = `#${r}`)];
};

const Container = ({ children, className }) => (
  <div className={cx("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>
);

const Pill = ({ children, tone = "gold" }) => (
  <span
    className={cx(
      "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
      tone === "gold" ? "text-[var(--gold)]" : "text-white/80 border-white/30"
    )}
    style={{ borderColor: tone === "gold" ? theme.gold : undefined }}
  >
    {children}
  </span>
);

const Button = ({ children, onClick, as = "button", href, variant = "gold", className = "", type }) => {
  const base = cx(
    "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2",
    variant === "gold" && "bg-[var(--gold)] text-black hover:opacity-90",
    variant === "ghost" && "bg-transparent text-white border border-white/20 hover:bg-white/5",
    variant === "dark" && "bg-black text-white hover:bg-neutral-900",
    variant === "light" && "bg-white text-black hover:bg-neutral-100",
    className
  );
  const props = { className: base, onClick, type };
  if (as === "a" && href) return <a {...props} href={href}>{children}</a>;
  return <button {...props}>{children}</button>;
};

const NavLink = ({ label, hash, current, setRoute }) => {
  const active = current === hash;
  return (
    <motion.a
      href={`#${hash}`}
      onClick={() => setRoute(hash)}
    className={cx(
      "relative rounded-xl px-3 py-2.5 text-[15px] md:text-base font-semibold transition select-none",
      active ? "text-white" : "text-white/80 hover:text-white hover:bg-white/5"
     )}
      aria-current={active ? "page" : undefined}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <span>{label}</span>
      {active && (
        <motion.span
          layoutId="nav-underline"
          className="absolute left-2 right-2 -bottom-1 h-[2px] rounded-full"
          style={{ background: theme.gold }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </motion.a>
  );
};

const Header = ({ route, setRoute, onOpenQuote }) => {
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [route]);
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/40 bg-black/60 border-b border-white/10">
      <Container className="flex items-center justify-between py-3">
        <a href="#home" onClick={() => setRoute("home")} className="flex items-center gap-3">
          {/* Bigger logo (menu PNG) */}
          <img src={ASSETS.mark} alt="ASCON mark" className="h-28 w-22 md:h-30 md:w-30 object-contain" />
          <span className="sr-only">ASCON GROUP INC</span>
        </a>
        <nav className="hidden md:flex items-center gap-1 relative">
          {[
            ["Home", "home"],
            ["Services", "services"],
            ["Fleet", "fleet"],
            ["Safety", "safety"],
            ["About", "about"],
            ["Lanes", "lanes"],
            ["Careers", "careers"],
            ["Contact", "contact"],
          ].map(([label, hash]) => (
            <NavLink key={hash} label={label} hash={hash} current={route} setRoute={setRoute} />
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="gold" className="hidden sm:inline-flex" onClick={onOpenQuote}>
            Get a Quote
          </Button>
          <button
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 text-white/90"
            onClick={() => setOpen((v) => !v)}
            aria-label="Open Menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </Container>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-white/10"
          >
            <Container className="py-2 grid grid-cols-2 gap-2">
              {[
                ["Home", "home"],
                ["Services", "services"],
                ["Fleet", "fleet"],
                ["Safety", "safety"],
                ["About", "about"],
                ["Lanes", "lanes"],
                ["Careers", "careers"],
                ["Contact", "contact"],
              ].map(([label, hash]) => (
                <NavLink key={hash} label={label} hash={hash} current={route} setRoute={setRoute} />
              ))}
              <Button variant="gold" onClick={onOpenQuote}>
                Get a Quote
              </Button>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Hero = ({ onOpenQuote }) => (
  <div className="relative isolate overflow-hidden">
    <img
      src={ASSETS.heroTruck}
      alt="ASCON flatbed freightliner in winter mountains"
      className="absolute inset-0 h-full w-full object-cover opacity-35"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black" />
    <Container className="relative z-10 py-24 sm:py-32">
      <Pill>ASCON GROUP INC · MC# 1077266</Pill>
      <h1 className="mt-6 max-w-4xl text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
        Precision Flatbed & Specialized Freight
      </h1>
      <p className="mt-4 max-w-2xl text-white/80 text-base sm:text-lg">
        Elite driver standards, securement discipline, and 24/7 dispatch. Based in Aurora, IL—operating nationwide.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={onOpenQuote}>Request a Shipper Quote</Button>
        <Button as="a" href="#contact" variant="ghost">
          Drivers: Contact Recruiting
        </Button>
      </div>
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-white/80">
        {["On-Time", "24/7 Dispatch", "Safety First", "GPS Tracked"].map((t) => (
          <div key={t} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-sm">
            {t}
          </div>
        ))}
      </div>
    </Container>
    <div className="border-t border-white/10 bg-black/70">
      <Container className="py-3">
        <div className="flex items-center justify-between text-white/60 text-xs sm:text-sm gap-4 overflow-x-auto no-scrollbar">
          {["Steel & Machinery", "Construction Materials", "Energy & Infrastructure", "Project Freight", "Expedite"].map(
            (tag) => (
              <div key={tag} className="whitespace-nowrap">
                {tag}
              </div>
            )
          )}
        </div>
      </Container>
    </div>
  </div>
);

const SectionTitle = ({ eyebrow, title, desc, right }) => (
  <div className="flex items-end justify-between gap-6">
    <div>
      {eyebrow && <Pill>{eyebrow}</Pill>}
      <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">{title}</h2>
      {desc && <p className="mt-2 text-gray-600 max-w-2xl">{desc}</p>}
    </div>
    {right}
  </div>
);

const Services = () => (
  <section id="services" className="bg-white py-20">
    <Container>
      <SectionTitle
        eyebrow="Capabilities"
        title="Services"
        desc="Time-critical flatbed and specialty moves with meticulous securement and transparent updates."
        right={<Pill>USDOT compliant</Pill>}
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Flatbed & Step-Deck",
            desc: "Steel, machinery, lumber, and O/D freight with best-practice securement.",
            icon: (
              <svg viewBox="0 0 24 24" className="h-6 w-6">
                <path fill="currentColor" d="M3 15h12l5-4h1v6h-2a2 2 0 1 1-4 0H9a2 2 0 1 1-4 0H3v-2Z" />
              </svg>
            ),
          },
          {
          title: "Time-Definite Flatbed",
          desc: "Planned time windows with proactive check-calls.",
          icon: (
           <svg viewBox="0 0 24 24" className="h-6 w-6">
              <path fill="currentColor" d="M12 8v5l4 2"/>
            </svg>),
          },
          {
            title: "Project Freight",
            desc: "Multi-unit, multi-stop coordination under a single point of contact.",
            icon: (
              <svg viewBox="0 0 24 24" className="h-6 w-6">
                <path fill="currentColor" d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z" />
              </svg>
            ),
          },
          {
            title: "Over-Dimension Support",
            desc: "Permits, escorts, and compliant routing.",
            icon: (
              <svg viewBox="0 0 24 24" className="h-6 w-6">
                <path fill="currentColor" d="M12 2 3 6v6c0 5 4 9 9 10 5-1 9-5 9-10V6l-9-4Z" />
              </svg>
            ),
          },
          {
            title: "24/7 After-Hours",
            desc: "Real-time updates and calm problem-solving at any hour.",
            icon: (
              <svg viewBox="0 0 24 24" className="h-6 w-6">
                <path fill="currentColor" d="M12 8v5l4 2" />
              </svg>
            ),
          },
          {
            title: "Broker & Shipper Partners",
            desc: "Transparent ELD data and on-time docs.",
            icon: (
              <svg viewBox="0 0 24 24" className="h-6 w-6">
                <path fill="currentColor" d="M7 4h10v4H7V4Zm0 6h10v10H7V10Z" />
              </svg>
            ),
          },
        ].map((c) => (
          <div key={c.title} className="group rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition border-gray-200">
            <div className="flex items-center gap-3 text-[var(--gold)]" style={{ color: theme.gold }}>
              {c.icon}
              <h3 className="text-lg font-semibold text-black">{c.title}</h3>
            </div>
            <p className="mt-2 text-gray-600 text-sm">{c.desc}</p>
            <div className="mt-4 h-1 w-12 rounded-full" style={{ background: theme.gold }} />
          </div>
        ))}
      </div>
    </Container>
  </section>
);

const Fleet = () => (
  <section id="fleet" className="bg-[var(--light)] py-20" style={{ ["--light"]: theme.light }}>
    <Container>
      <SectionTitle
        eyebrow="Equipment"
        title="Fleet"
        desc="Modern tractors and well-maintained equipment — professional appearance and reliability."
        right={<Pill>GPS + ELD</Pill>}
      />
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <img src={ASSETS.heroTruck} alt="ASCON Freightliner with flatbed" className="h-72 w-full object-cover" />
          <div className="p-6">
            <h3 className="text-xl font-semibold">Freightliner Cascadia · Flatbed</h3>
            <p className="mt-2 text-gray-600 text-sm">Winter-ready, long-haul spec shown in the Rockies. Dedicated to uptime and precision.</p>
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <img src={ASSETS.heroTruck2} alt="ASCON Western Star 57X with flatbed" className="h-72 w-full object-cover" />
          <div className="p-6">
            <h3 className="text-xl font-semibold">Western Star 57X · Flatbed</h3>
            <p className="mt-2 text-gray-600 text-sm">Premium spec for comfort and safety—sharp look, serious work.</p>
          </div>
        </div>
      </div>
      <ul className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-gray-700">
        {["Straps & Chains", "Edge Protectors", "Tarps (4 & 8ft)", "Oversize Banners", "Beacon Lights", "TWIC (upon request)", "Dock & Scale Ready", "Daily DVIRs"].map(
          (item) => (
            <li key={item} className="rounded-xl bg-white border border-gray-200 px-3 py-2 text-center">
              {item}
            </li>
          )
        )}
      </ul>
    </Container>
  </section>
);

const Safety = () => (
  <section id="safety" className="bg-white py-20">
    <Container>
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <SectionTitle title="Safety & Compliance" desc="Pre-trip diligence, correct securement, and calm communication under pressure are our baseline." />
          <ul className="mt-6 space-y-3 text-gray-700">
            {["FMCSA compliance and current filings", "ELD monitoring and HOS discipline", "Securement SOPs and photo-verified tie-downs", "Weather routing and risk-aware planning", "Professional conduct at shipper/receiver"].map(
              (li) => (
                <li key={li} className="flex items-start gap-2">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full" style={{ background: theme.gold }} />
                  {li}
                </li>
              )
            )}
          </ul>
        </div>
        <div className="relative rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-sm">
          <img src={ASSETS.logoGold} alt="ASCON gold logo" className="h-72 w-full object-cover object-center opacity-20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-3xl border border-gray-200 bg-white/85 px-6 py-8 text-center backdrop-blur">
              <p className="text-sm text-gray-600">MC# 1077266</p>
              <p className="text-lg font-semibold">ASCON GROUP INC</p>
              <p className="text-sm text-gray-600">2413 Georgetown Cir, Aurora, IL 60503</p>
              <p className="mt-2 text-sm text-gray-600">Email: dima@shipascon.com · Tel: (815) 669-1400</p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  </section>
);

const Lanes = () => (
  <section id="lanes" className="bg-[var(--dark)] py-20 text-white" style={{ ["--dark"]: theme.dark }}>
    <Container>
      <SectionTitle
        eyebrow="Coverage"
        title="Preferred Lanes"
        desc="Strong performance lane groups. We add new lanes based on partner demand."
        right={<Pill tone="dark">Live ETA updates</Pill>}
      />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
            { name: "Midwest ⇄ Texas", notes: "Steel & machinery. Dallas · Houston · San Antonio." },
            { name: "Midwest ⇄ Southeast", notes: "Carolinas · Georgia · Florida panhandle." },
            { name: "Midwest ⇄ Mountain West", notes: "CO · UT · ID · WY. Winter-experienced." },
            { name: "Great Lakes Regional", notes: "IL · IN · MI · OH · WI." },
            { name: "Illinois ⇄ Ohio Steel Corridor", notes: "Mills and processors with appointment windows." },
            { name: "Dedicated Weekly Midwest", notes: "Recurring schedules for steady plant-to-plant moves." },
          ].map((l) => (
          <div key={l.name} className="rounded-2xl border border-white/15 bg-white/5 p-5">
            <div className="text-[var(--gold)] font-semibold" style={{ color: theme.gold }}>
              {l.name}
            </div>
            <div className="mt-1 text-sm text-white/80">{l.notes}</div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

const About = () => (
  <section id="about" className="bg-[var(--dark)] py-20 text-white" style={{ ["--dark"]: theme.black }}>
    <Container>
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <Pill>Who we are</Pill>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">Small team. Big standards.</h2>
          <p className="mt-3 text-white/80">
            ASCON is a driver-first operation built around reliability and clear communication. We partner with shippers and brokers who value precise updates and professional conduct at the dock.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {[
              { n: "2019", l: "Founded" },
              { n: "48", l: "States" },
              { n: "24/7", l: "Dispatch" },
              { n: "A+", l: "Communication" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="text-2xl font-bold">{s.n}</div>
                <div className="text-sm text-white/70">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 -skew-y-3 rounded-3xl opacity-60" style={{ background: theme.gold }} />
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black">
            <img src={ASSETS.heroTruck2} alt="ASCON Western Star close-up" className="h-96 w-full object-cover" />
          </div>
        </div>
      </div>
    </Container>
  </section>
);

const Careers = () => (
  <section id="careers" className="bg-white py-20">
    <Container>
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <SectionTitle
            title="Careers at ASCON"
            desc="We look for professionals who respect the craft—safe securement, clean equipment, and pride in the job."
          />
          <ul className="mt-6 space-y-3 text-gray-700">
            {[
              "Competitive pay with on-time settlements",
              "Modern tractors and well-maintained trailers",
              "24/7 support and no-nonsense dispatch",
              "Respectful culture—drivers are our reputation",
            ].map((li) => (
              <li key={li} className="flex items-start gap-2">
                <span className="mt-1 h-2.5 w-2.5 rounded-full" style={{ background: theme.gold }} />
                {li}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Open Roles</h3>
          <div className="mt-4 divide-y divide-gray-200">
            {[
              { role: "OTR Flatbed Driver", details: "2+ years verified, clean MVR, securement proficiency" },
              { role: "Owner-Operator (Flatbed)", details: "Safety-minded, reliable communication, ELD compliant" },
            ].map((r) => (
              <div key={r.role} className="py-4">
                <div className="font-medium">{r.role}</div>
                <div className="text-sm text-gray-600">{r.details}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  </section>
);

// DRIVERS — CONTACT RECRUITING
const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");
  const formRef = useRef(null);
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOk(false);
    setErr("");
    const data = Object.fromEntries(new FormData(formRef.current));
    if (data.company_website) {
      setLoading(false);
      return;
    } // honeypot
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "Driver Recruiting" }),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      setOk(true);
      formRef.current?.reset();
    } catch (e) {
      setErr("Message not sent. Please email dima@shipascon.com or call (815) 669-1400.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <section id="contact" className="bg-[var(--dark)] py-20 text-white" style={{ ["--dark"]: theme.black }}>
      <Container>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <Pill>Drivers</Pill>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">Contact Recruiting</h2>
            <p className="mt-3 text-white/80">Tell us about your experience and equipment. We’ll get back quickly.</p>
            <div className="mt-6 space-y-2 text-sm text-white/70">
              <div>
                Phone:{" "}
                <a href="tel:+18156691400" className="underline">
                  (815) 669-1400
                </a>
              </div>
              <div>
                Email:{" "}
                <a href="mailto:dima@shipascon.com" className="underline">
                  dima@shipascon.com
                </a>
              </div>
              <div>Address: 2413 Georgetown Cir, Aurora, IL 60503</div>
              <div>MC# 1077266</div>
            </div>
          </div>
          <form ref={formRef} onSubmit={onSubmit} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <input name="company_website" tabIndex={-1} autoComplete="off" className="hidden" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label className="block text-sm mb-1">Full Name</label>
                <input name="name" required className="w-full rounded-xl bg-black/30 border border-white/20 px-3 py-2" />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-sm mb-1">Phone</label>
                <input name="phone" type="tel" required className="w-full rounded-xl bg-black/30 border border-white/20 px-3 py-2" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm mb-1">Email</label>
                <input name="email" type="email" required className="w-full rounded-xl bg-black/30 border border-white/20 px-3 py-2" />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-sm mb-1">CDL Class</label>
                <select name="cdl" className="w-full rounded-xl bg-black/30 border border-white/20 px-3 py-2">
                  <option>Class A</option>
                  <option>Class B</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="sm:col-span-1">
                <label className="block text-sm mb-1">Flatbed Experience (years)</label>
                <input name="flatbed_exp" type="number" min="0" step="0.5" className="w-full rounded-xl bg-black/30 border border-white/20 px-3 py-2" />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-sm mb-1">Position</label>
                <select name="position" className="w-full rounded-xl bg-black/30 border border-white/20 px-3 py-2">
                  <option>Company Driver</option>
                  <option>Owner-Operator</option>
                </select>
              </div>
              <div className="sm:col-span-1">
                <label className="block text-sm mb-1">TWIC</label>
                <select name="twic" className="w-full rounded-xl bg-black/30 border border-white/20 px-3 py-2">
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm mb-1">Home State</label>
                <input name="home_state" className="w-full rounded-xl bg-black/30 border border-white/20 px-3 py-2" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm mb-1">Notes (equipment, availability)</label>
                <textarea name="notes" rows={5} className="w-full rounded-xl bg-black/30 border border-white/20 px-3 py-2" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Button type="submit" variant="gold">
                {loading ? "Sending…" : "Send to Recruiting"}
              </Button>
              <span className="text-sm text-white/70">
                or email{" "}
                <a href="mailto:dima@shipascon.com" className="underline">
                  dima@shipascon.com
                </a>
              </span>
            </div>
            {ok && <p className="mt-3 text-sm text-emerald-300">Thanks! We received your info.</p>}
            {err && <p className="mt-3 text-sm text-red-300">{err}</p>}
          </form>
        </div>
      </Container>
    </section>
  );
};

const QuoteWizard = ({ open, onClose }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const [sending, setSending] = useState(false);
  const steps = [
    {
      key: "freight",
      label: "Freight Type",
      fields: [
        { name: "commodity", label: "Commodity", required: true },
        { name: "weight", label: "Weight (lbs)" },
        { name: "dims", label: "Dimensions (L×W×H)" },
      ],
    },
    {
      key: "route",
      label: "Route",
      fields: [
        { name: "pickup", label: "Pickup City / State", required: true },
        { name: "delivery", label: "Delivery City / State", required: true },
        { name: "date", label: "Pickup Date" },
      ],
    },
    {
      key: "contact",
      label: "Contact",
      fields: [
        { name: "name", label: "Your Name", required: true },
        { name: "email", label: "Email", required: true, type: "email" },
        { name: "phone", label: "Phone" },
        { name: "notes", label: "Notes", textarea: true },
      ],
    },
  ];
  const submit = async () => {
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "Shipper Quote" }),
      });
      if (!res.ok) throw new Error("send failed");
      onClose(true);
    } catch (e) {
      onClose(false);
    } finally {
      setSending(false);
    }
  };
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70" onClick={() => onClose(false)} />
          <motion.div
            className="relative z-10 w-full max-w-xl rounded-3xl border border-white/10 bg-[var(--dark)] text-white p-6"
            style={{ ["--dark"]: theme.dark }}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
          >
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">Shipper Quote</div>
              <button onClick={() => onClose(false)} className="text-white/70 hover:text-white">
                ✕
              </button>
            </div>
            <div className="mt-2 text-sm text-white/70">
              Step {step + 1} of {steps.length} — {steps[step].label}
            </div>
            <div className="mt-4 grid gap-4">
              {steps[step].fields.map((f) => (
                <div key={f.name}>
                  <label className="block text-sm mb-1">
                    {f.label}
                    {f.required && <span className="text-red-300"> *</span>}
                  </label>
                  {f.textarea ? (
                    <textarea
                      rows={4}
                      value={data[f.name] || ""}
                      onChange={(e) => setData({ ...data, [f.name]: e.target.value })}
                      className="w-full rounded-xl bg-black/30 border border-white/20 px-3 py-2"
                    />
                  ) : (
                    <input
                      type={f.type || "text"}
                      value={data[f.name] || ""}
                      onChange={(e) => setData({ ...data, [f.name]: e.target.value })}
                      className="w-full rounded-xl bg-black/30 border border-white/20 px-3 py-2"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between">
              <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))}>
                Back
              </Button>
              {step < steps.length - 1 ? (
                <Button onClick={() => setStep(step + 1)}>Continue</Button>
              ) : (
                <Button onClick={submit}>{sending ? "Sending…" : "Submit"}</Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Footer = () => (
  <footer className="bg-black text-white">
    <Container className="py-10">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <img src={ASSETS.logoDark} alt="ASCON" className="h-7 w-auto" />
          <p className="mt-3 text-sm text-white/70 max-w-xs">
            ASCON GROUP INC · MC# 1077266
            <br />
            2413 Georgetown Cir, Aurora, IL 60503
          </p>
        </div>
        <div>
          <div className="font-semibold">Company</div>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>
              <a href="#about" className="hover:underline">
                About
              </a>
            </li>
            <li>
              <a href="#services" className="hover:underline">
                Services
              </a>
            </li>
            <li>
              <a href="#fleet" className="hover:underline">
                Fleet
              </a>
            </li>
            <li>
              <a href="#careers" className="hover:underline">
                Careers
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Contact</div>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>
              <a href="mailto:dima@shipascon.com" className="hover:underline">
                dima@shipascon.com
              </a>
            </li>
            <li>
              <a href="tel:+8156691400" className="hover:underline">
                (815) 669-1400
              </a>
            </li>
            <li>Aurora, IL</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Legal</div>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>© {new Date().getFullYear()} ASCON GROUP INC</li>
            <li>All Rights Reserved</li>
          </ul>
        </div>
      </div>
      <div className="mt-8 border-t border-white/10 pt-6 text-xs text-white/60">
        Website by <a href="https://www.fiverr.com/waxent/design-and-build-a-website-for-your-business" className="underline decoration-dotted">Dima</a>
      </div>
    </Container>
  </footer>
);

export default function App() {
  const [route, setRoute] = useHashRoute();
  const [wizardOpen, setWizardOpen] = useState(false);
  useEffect(() => {
    document.documentElement.style.setProperty("--gold", theme.gold);
  }, []);
  useEffect(() => {
    document.title = "ASCON GROUP INC — Flatbed & Specialized Freight";
    const d = document.createElement("meta");
    d.name = "description";
    d.content = "ASCON GROUP INC (MC 1077266) — Flatbed & specialized freight with 24/7 dispatch. Aurora, IL.";
    const v = document.createElement("meta");
    v.name = "viewport";
    v.content = "width=device-width, initial-scale=1";
    document.head.append(d, v);
    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "ASCON GROUP INC",
      url: window.location.href,
      email: "dima@shipascon.com",
      telephone: "+18156691400",
      address: {
        "@type": "PostalAddress",
        streetAddress: "2413 Georgetown Cir",
        addressLocality: "Aurora",
        addressRegion: "IL",
        postalCode: "60503",
      },
      sameAs: [],
    });
    document.head.appendChild(ld);
    return () => {
      d.remove();
      v.remove();
      ld.remove();
    };
  }, []);
  return (
    <div className="min-h-screen bg-black text-white">
      <Header route={route} setRoute={setRoute} onOpenQuote={() => setWizardOpen(true)} />
      <main>
        <Hero onOpenQuote={() => setWizardOpen(true)} />
        <Services />
        <Fleet />
        <Safety />
        <Lanes />
        <About />
        <Careers />
        <Contact />
      </main>
      <Footer />
      <QuoteWizard open={wizardOpen} onClose={() => setWizardOpen(false)} />
      <style>{`
        :root { --gold: ${theme.gold}; }
        html, body, #root { height: 100%; }
        body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Noto Sans, "Apple Color Emoji", "Segoe UI Emoji"; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
