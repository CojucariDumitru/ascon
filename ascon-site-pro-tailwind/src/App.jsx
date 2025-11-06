import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ASCON GROUP INC - Polished SPA (Pro Edition)
 * Premium enterprise look with:
 *  - Shipper Quote Wizard (modal)
 *  - Drivers-focused Contact (Recruiting)
 *  - Animated top navigation (tap + sliding underline)
 */

const ASSETS = {
  logoDark: "/assets/ascon-logo-black.png",
  logoGold: "/assets/ascon-logo-gold.jpg",
  heroTruck: "/assets/truck-hero-1.jpg",
  heroTruck2: "/assets/truck-hero-2.jpg",
  mark: "/assets/ascon-mark.png",
  heroVideo: "https://cdn.coverr.co/videos/coverr-driving-down-a-scenic-highway-8326/1080p.mp4",
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

const Button = ({ children, onClick, as = "button", href, variant = "gold", className = "", type, disabled = false }) => {
  const base = cx(
    "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
    variant === "gold" && "bg-[var(--gold)] text-black hover:opacity-90",
    variant === "ghost" && "bg-transparent text-white border border-white/20 hover:bg-white/5",
    variant === "dark" && "bg-black text-white hover:bg-neutral-900",
    variant === "light" && "bg-white text-black hover:bg-neutral-100",
    variant === "glow" &&
      "bg-gradient-to-r from-[var(--gold)] via-[#f5dba7] to-[var(--gold)] text-black shadow-[0_0_22px_rgba(198,166,100,0.55)] hover:shadow-[0_0_32px_rgba(198,166,100,0.75)] focus:ring-[rgba(198,166,100,0.45)] animate-[heroGlow_3.5s_ease-in-out_infinite]",
    className
  );
  const props = { className: base, onClick, type, disabled };
  if (as === "a" && href) {
    const { disabled: _disabled, ...anchorProps } = props;
    return <a {...anchorProps} href={href}>{children}</a>;
  }
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
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => setOpen(false), [route]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <motion.header
      initial={false}
      animate={{ height: scrolled ? 72 : 84, backgroundColor: scrolled ? "rgba(8, 8, 10, 0.85)" : "rgba(11,11,11,0.45)" }}
      transition={{ type: "spring", stiffness: 240, damping: 28 }}
      className={cx(
        "sticky top-0 z-40 border-b border-transparent transition-[border-color,background-color] duration-200",
        scrolled ? "border-white/10 shadow-[0_10px_28px_rgba(0,0,0,0.3)]" : "border-white/0"
      )}
    >
      <Container className="flex h-full items-center justify-between gap-4">
        <a href="#home" onClick={() => setRoute("home")} className="flex items-center gap-3">
          {/* Mark icon with responsive sizing for shrinking header */}
          <img src={ASSETS.mark} alt="ASCON mark" className="h-30 w-30 md:h-32 md:w-32 object-contain transition-all duration-300" />
          <span className="sr-only">ASCON GROUP INC</span>
        </a>
        <nav className="hidden md:flex items-center gap-1 relative">
          {[
            ["Home", "home"],
            ["Services", "services"],
            ["Fleet", "fleet"],
            ["Safety", "safety"],
            ["About", "about"],
            ["Careers", "careers"],
            ["Contact", "contact"],
          ].map(([label, hash]) => (
            <NavLink key={hash} label={label} hash={hash} current={route} setRoute={setRoute} />
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="glow" className="hidden lg:inline-flex shadow-lg" onClick={onOpenQuote}>
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
    </motion.header>
  );
};

const heroStats = [
  { label: "On-time performance", value: "98.6%" },
  { label: "Accident-free miles", value: "2.1M" },
  { label: "Active 24/7 dispatch", value: "365 days" },
  { label: "Average securement score", value: "A+" },
];

const heroUpdates = [
  { title: "Aurora → Houston", detail: "Steel coils | ETA 13:45 | Driver Z. Martinez" },
  { title: "Chicago → Denver", detail: "Machinery | Cleared ice checkpoint | +2 min variance" },
  { title: "Joliet → Charlotte", detail: "Lumber | Check-call logged | No exceptions" },
  { title: "Detroit → Tulsa", detail: "Project freight | Permit escort confirmed" },
];

const recentLoads = [
  {
    lane: "Aurora, IL → Houston, TX",
    commodity: "Placeholder commodity",
    price: "Placeholder rate",
  },
  {
    lane: "Rockford, IL → Salt Lake City, UT",
    commodity: "Placeholder commodity",
    price: "Placeholder rate",
  },
  {
    lane: "Detroit, MI → Tulsa, OK",
    commodity: "Placeholder commodity",
    price: "Placeholder rate",
  },
  {
    lane: "Joliet, IL → Charlotte, NC",
    commodity: "Placeholder commodity",
    price: "Placeholder rate",
  },
];


const Hero = ({ onOpenQuote }) => {
  const [updateIndex, setUpdateIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setUpdateIndex((idx) => (idx + 1) % heroUpdates.length);
    }, 3800);
    return () => clearInterval(id);
  }, []);
  const currentUpdate = heroUpdates[updateIndex];
  return (
    <div className="relative isolate overflow-hidden">
      <div className="absolute inset-0">
        <video
          className="h-full w-full object-cover"
          src={ASSETS.heroVideo}
          poster={ASSETS.heroTruck}
          autoPlay
          playsInline
          muted
          loop
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black/95" />
      </div>
      <Container className="relative z-10 py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <Pill>ASCON GROUP INC | MC# 1077266</Pill>
          <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.05]">
            Elite Flatbed Precision For Critical Freight
          </h1>
          <p className="mt-5 max-w-2xl text-white/85 text-base sm:text-lg">
            We roll securement-first crews, white-glove updates, and coast-to-coast coverage so your high-value freight hits the dock ready. Every move is partner caliber: timelines, communication, and appearance dialed in.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.02, y: -3 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: "tween", duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl"
              style={{ willChange: "transform" }}
            >
              <Button
                onClick={onOpenQuote}
                variant="glow"
                className="group flex items-center gap-3 px-6 py-3 shadow-[0_12px_28px_rgba(198,166,100,0.25)] transition-shadow duration-200 group-hover:shadow-[0_10px_22px_rgba(198,166,100,0.2)]"
              >
                <span>Launch Shipper Quote</span>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/80 text-xs text-[var(--gold)] transition-transform duration-150 group-hover:translate-x-1">
                  →
                </span>
              </Button>
            </motion.div>
            <Button as="a" href="#contact" variant="ghost">
              Talk To Recruiting
            </Button>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentUpdate.title}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex w-full max-w-xl items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur"
              >
                <span className="inline-flex h-3 w-3 animate-ping rounded-full bg-emerald-400/80" />
                <div>
                  <div className="font-semibold uppercase tracking-[0.25em] text-white/60">{currentUpdate.title}</div>
                  <div className="text-xs text-white/70">{currentUpdate.detail}</div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {heroStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.08, duration: 0.45, ease: [0.33, 1, 0.68, 1] }}
              className="rounded-3xl border border-white/15 bg-black/55 p-5 text-white/80"
            >
              <div className="text-xs uppercase tracking-[0.25em] text-white/50">{stat.label}</div>
              <div className="mt-3 text-3xl font-semibold text-white">{stat.value}</div>
            </motion.div>
          ))}
        </div>
      </Container>
      <div className="border-t border-white/15 bg-black/60">
        <Container className="py-4">
          <div className="flex items-center justify-between text-white/65 text-xs sm:text-sm gap-4 overflow-x-auto no-scrollbar">
            {["Steel & Machinery", "Construction Materials", "Energy & Infrastructure", "Project Freight", "Expedite", "Secure Storage"].map(
              (tag) => (
                <motion.div key={tag} whileHover={{ scale: 1.05 }} className="whitespace-nowrap">
                  {tag}
                </motion.div>
              )
            )}
          </div>
        </Container>
      </div>
    </div>
  );
};

const RecentLoads = () => {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setActive((idx) => (idx + 1) % recentLoads.length);
    }, 4200);
    return () => clearInterval(id);
  }, []);
  return (
    <section className="bg-black py-16 text-white">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <Pill tone="gold">Recent Loads</Pill>
            <h2 className="mt-4 text-3xl font-bold tracking-tight lg:text-4xl">Best hauls & marquee runs</h2>
            <p className="mt-3 text-white/70">
              High-impact moves that capture ASCON standards. Update lane + rate details as new wins land.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {recentLoads.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActive(idx)}
                className={cx(
                  "h-2 rounded-full transition-all",
                  idx === active ? "w-8 bg-[var(--gold)]" : "w-3 bg-white/30 hover:bg-white/60"
                )}
                aria-label={`Show load ${idx + 1}`}
              />
            ))}
          </div>
        </div>
        <div className="mt-10 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={recentLoads[active].lane}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur md:grid-cols-[1.4fr_1fr]"
            >
              <div>
                <div className="text-sm uppercase tracking-[0.25em] text-white/50">Lane</div>
                <div className="mt-2 text-2xl font-semibold">{recentLoads[active].lane}</div>
                <div className="mt-4 text-sm text-white/80">
                  <span className="font-medium text-white/90">Commodity: </span>
                  {recentLoads[active].commodity}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/50 p-6 text-sm text-white/80">
                <div className="text-xs uppercase tracking-[0.25em] text-white/50">Lane pricing</div>
                <div className="mt-3 text-2xl font-semibold text-white">{recentLoads[active].price}</div>
                <div className="mt-4 text-xs text-white/60">
                  Replace with actual payout / rate when updating weekly showcase.
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
};
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

const services = [
  {
    title: "Flatbed & Step-Deck",
    desc: "Steel, machinery, lumber, and O/D freight with best-practice securement.",
    highlights: ["53' & 48' mix", "Chains, binders, tarps", "Daily photo check-ins"],
    badge: "Core Fleet",
  },
  {
    title: "Time-Definite Flatbed",
    desc: "Planned time windows with proactive check-calls.",
    highlights: ["Milestone tracking", "Live ETA adjustments", "Night dispatch coverage"],
    badge: "Precision Timing",
  },
  {
    title: "Project Freight",
    desc: "Multi-unit, multi-stop coordination under a single point of contact.",
    highlights: ["Sequenced deliveries", "On-site SOP briefings", "Dedicated project chat"],
    badge: "Rollouts",
  },
  {
    title: "Over-Dimension Support",
    desc: "Permits, escorts, and compliant routing.",
    highlights: ["Route surveys", "Permit management", "Escort coordination"],
    badge: "OD Expertise",
  },
  {
    title: "24/7 After-Hours",
    desc: "Real-time updates and calm problem-solving at any hour.",
    highlights: ["War-room escalation", "Ops leadership on-call", "Issue resolution scripts"],
    badge: "Always On",
  },
  {
    title: "Broker & Shipper Partners",
    desc: "Transparent ELD data and on-time docs.",
    highlights: ["Shared ELD visibility", "Doc turn-in < 2 hrs", "Dedicated Slack or email"],
    badge: "Partner Mode",
  },
];

const Services = () => (
  <section id="services" className="bg-white py-20 text-black">
    <Container>
      <SectionTitle
        eyebrow="Capabilities"
        title="Services"
        desc="Time-critical flatbed and specialty moves with meticulous securement and transparent updates."
        right={<Pill>USDOT compliant</Pill>}
      />
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6, scale: 1.01 }}
            whileTap={{ scale: 0.995 }}
            transition={{ delay: i * 0.03, duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, amount: 0.4 }}
            className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition-colors duration-150 hover:border-gray-300 hover:shadow-lg"
            style={{ willChange: "transform" }}
          >
            <div className="pointer-events-none absolute -top-28 right-0 h-40 w-40 rounded-full bg-[var(--gold)]/12 opacity-70 transition-all duration-400 group-hover:-top-16 group-hover:opacity-100" />
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center rounded-full border border-gray-200/70 bg-gray-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-500">
                {service.badge}
              </span>
              <span className="text-xs font-semibold text-gray-300">0{i + 1}</span>
            </div>
            <div className="mt-5 space-y-3">
              <h3 className="text-xl font-semibold text-black">{service.title}</h3>
              <p className="text-sm text-gray-600">{service.desc}</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-xs text-gray-600">
              {service.highlights.map((highlight) => (
                <span
                  key={highlight}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200/70 bg-gray-50 px-3 py-1 font-medium"
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: theme.gold }} />
                  {highlight}
                </span>
              ))}
            </div>
            <div className="mt-6 h-[3px] w-16 rounded-full transition-all duration-200 group-hover:w-20" style={{ background: theme.gold }} />
          </motion.div>
        ))}
      </div>
    </Container>
  </section>
);

const fleetUnits = [
  {
    title: "Freightliner Cascadia",
    tagline: "53' flatbed | Company tractor",
    image: ASSETS.heroTruck,
    description: "Winter-ready spec dialed for long-haul precision and uptime in harsh climates.",
    highlights: [
      "Detroit DD15 power with 12-speed automatic",
      "TriPac APU, bunk heater, forward + driver cams",
      "Full securement kit staged and inspected daily",
    ],
  },
  {
    title: "Western Star 57X",
    tagline: "Premium flatbed | Owner-operator lead",
    image: ASSETS.heroTruck2,
    description: "Showcase-ready finish with safety technology and driver comfort for high-visibility moves.",
    highlights: [
      "Adaptive cruise with collision mitigation suite",
      "Heated leather seats + ambient lighting package",
      "ELD, dash cams, and remote diagnostics onboard",
    ],
  },
];

const Fleet = () => (
  <section id="fleet" className="bg-[var(--light)] py-20 text-black" style={{ ["--light"]: theme.light }}>
    <Container>
      <SectionTitle
        eyebrow="Equipment"
        title="Fleet"
        desc="Modern tractors and well-maintained equipment - professional appearance and reliability."
        right={<Pill>GPS + ELD</Pill>}
      />
      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {fleetUnits.map((unit, i) => (
          <motion.article
            key={unit.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            whileHover={{ y: -10 }}
            transition={{ delay: i * 0.1, duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-xl"
          >
            <div className="relative h-72 overflow-hidden">
              <img src={unit.image} alt={unit.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-4 flex flex-col gap-1 rounded-2xl bg-black/55 px-4 py-3 text-white shadow-lg backdrop-blur">
                <span className="text-xs uppercase tracking-[0.25em] text-white/70">{unit.tagline}</span>
                <span className="text-lg font-semibold">{unit.title}</span>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600">{unit.description}</p>
              <ul className="mt-5 space-y-3 text-sm text-gray-700">
                {unit.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: theme.gold }} />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.article>
        ))}
      </div>
      <motion.ul
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        className="mt-12 grid grid-cols-2 gap-3 text-sm text-gray-700 sm:grid-cols-4"
      >
        {["Straps & Chains", "Edge Protectors", "Tarps (4 & 8ft)", "Oversize Banners", "Beacon Lights", "TWIC (upon request)", "Dock & Scale Ready", "Daily DVIRs"].map((item) => (
          <motion.li
            key={item}
            whileHover={{ scale: 1.05 }}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-center shadow-sm"
          >
            {item}
          </motion.li>
        ))}
      </motion.ul>
    </Container>
  </section>
);

const safetyPhases = [
  {
    title: "Pre-trip intelligence",
    lead: "Forecast risk and securement plan 48 hours before pickup.",
    stat: "48 hr lead",
    details: [
      "Route modeling with weather and permit constraints",
      "Load diagrams with securement counts verified",
      "Driver briefing with photo checklist assignments",
    ],
  },
  {
    title: "Securement discipline",
    lead: "Every strap, chain, and edge protector documented before roll.",
    stat: "12 point check",
    details: [
      "TWIC, PPE, and dock protocol confirmed per site",
      "High-tension straps torque checked and logged",
      "Oversize banners, beacons, and flags staged",
    ],
  },
  {
    title: "Live dispatch oversight",
    lead: "24/7 operations layer with automated alerting and human escalation.",
    stat: "5 min response",
    details: [
      "Telematics feeds into dispatch wallboards",
      "Geo-fenced check calls and dwell-time triggers",
      "Exception playbooks for weather, detention, and re-power",
    ],
  },
  {
    title: "Post-trip audit",
    lead: "Paperwork turn-in and safety review completed same day.",
    stat: "< 2 hr docs",
    details: [
      "Signed BOL and scale tickets uploaded from cab",
      "DVIR findings routed to maintenance in under an hour",
      "Shipper scorecards updated for partner transparency",
    ],
  },
];

const Safety = () => {
  const [activePhase, setActivePhase] = useState(0);
  const phase = safetyPhases[activePhase];
  return (
    <section id="safety" className="bg-white py-20 text-black">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <SectionTitle
              title="Safety & Compliance"
              desc="Pre-trip diligence, real-time oversight, and disciplined securement keep every load audit-ready."
            />
            <div className="mt-8 space-y-3">
              {safetyPhases.map((item, idx) => {
                const selected = idx === activePhase;
                return (
                  <button
                    type="button"
                    key={item.title}
                    onMouseEnter={() => setActivePhase(idx)}
                    onFocus={() => setActivePhase(idx)}
                    className={cx(
                      "w-full rounded-2xl border px-4 py-3 text-left transition",
                      selected
                        ? "border-black bg-black text-white shadow-lg"
                        : "border-gray-200 bg-gray-50 hover:border-black/40 hover:bg-white"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={cx(
                          "mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl text-xs font-semibold",
                          selected ? "bg-white/15 text-white" : "bg-white text-black"
                        )}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <div className={cx("text-sm font-semibold", selected ? "text-white" : "text-black")}>{item.title}</div>
                        <div className={cx("mt-1 text-sm", selected ? "text-white/80" : "text-gray-600")}>{item.lead}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={phase.title}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-lg"
            >
              <div className="absolute -top-20 -right-10 h-40 w-40 rounded-full bg-[var(--gold)]/20 blur-3xl" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/50 bg-[var(--gold)]/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-gray-700">
                  <span className="inline-flex h-2 w-2 rounded-full" style={{ background: theme.gold }} />
                  {phase.stat}
                </div>
                <h3 className="mt-4 text-xl font-semibold">{phase.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{phase.lead}</p>
                <ul className="mt-5 space-y-3 text-sm text-gray-700">
                  {phase.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: theme.gold }} />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
};





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

const careerHighlights = [
  "Competitive pay with on-time settlements",
  "Modern tractors and well-maintained trailers",
  "24/7 support and no-nonsense dispatch",
  "Culture that puts drivers in the spotlight",
];

const hiringSteps = [
  { title: "Intro call", detail: "15-minute call to confirm experience, equipment, and home base.", duration: "Day 0" },
  { title: "Securement review", detail: "Share securement photos or walk-through to align on standards.", duration: "Day 1" },
  { title: "Compliance packet", detail: "We handle onboarding paperwork, drug screen, and ELD setup fast.", duration: "Day 1-2" },
  { title: "Dispatch launch", detail: "Meet your dispatcher, go over preferred lanes, load the first trip.", duration: "Day 3" },
];

const openRoles = [
  { role: "OTR Flatbed Driver", details: "2+ years verified, clean MVR, securement proficiency", tag: "Company Driver" },
  { role: "Owner-Operator (Flatbed)", details: "Safety-minded, reliable communication, ELD compliant", tag: "Revenue Share" },
];

const driverTestimonial = {
  quote: "They back what they promise - clean freight, respectful shippers, and ops that answer overnight.",
  name: "Sergey, ASCON driver",
  tenure: "2 years with the fleet",
};

const payProfiles = {
  company: { label: "Company Driver", percent: 0.3 },
  owner: { label: "Owner-Operator", percent: 0.88 },
};

const Careers = () => {
  const [calcType, setCalcType] = useState("company");
  const [calcRevenue, setCalcRevenue] = useState(6500);
  const profile = payProfiles[calcType];
  return (
    <section id="careers" className="bg-white py-20 text-black">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <SectionTitle
              title="Careers at ASCON"
              desc="We hire professionals who take pride in securement, equipment care, and calm communication at the dock."
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {careerHighlights.map((item) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700"
                >
                  <div className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-2 w-2 flex-shrink-0 rounded-full" style={{ background: theme.gold }} />
                    <span>{item}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-10">
              <div className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">Hiring process</div>
              <div className="mt-4 space-y-4">
                {hiringSteps.map((step, idx) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--gold)]/15 text-sm font-semibold text-gray-700">
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm font-semibold text-black">{step.title}</span>
                        <span className="text-xs uppercase tracking-[0.3em] text-gray-500">{step.duration}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{step.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-br from-black via-gray-900 to-gray-800 p-6 text-white shadow-xl"
            >
              <div className="absolute -top-10 right-0 h-32 w-32 rounded-full bg-[var(--gold)]/30 blur-3xl" />
              <div className="relative z-10 space-y-4">
                <div className="text-xs uppercase tracking-[0.3em] text-white/60">Driver voice</div>
                <blockquote className="text-lg font-medium leading-relaxed">"{driverTestimonial.quote}"</blockquote>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                  <span className="inline-flex h-2 w-2 rounded-full bg-[var(--gold)]" />
                  <div>
                    {driverTestimonial.name}
                    <span className="ml-2 text-white/40">{driverTestimonial.tenure}</span>
                  </div>
                </div>
                <p className="text-sm text-white/60">
                  Want to compare notes driver-to-driver? Call <a href="tel:+18156691400" className="underline decoration-dotted">(815) 669-1400</a> and ask for recruiting.
                </p>
              </div>
              <div className="absolute bottom-0 right-0 h-24 w-32 overflow-hidden opacity-60">
                <img src={ASSETS.heroTruck} alt="Driver highlight" className="h-full w-full rounded-tl-3xl object-cover" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

// DRIVERS - CONTACT RECRUITING
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
            <p className="mt-3 text-white/80">Tell us about your experience and equipment. We'll get back quickly.</p>
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
            <div className="mt-8 grid gap-3 text-xs text-white/70 sm:grid-cols-3">
              {[
                ["2.1M+", "Accident-free miles"],
                ["90 min", "Average paperwork turn-in"],
                ["24/7", "Dispatch + maintenance coverage"],
              ].map(([stat, label]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="text-sm font-semibold text-white">{stat}</div>
                  <div className="mt-1 text-white/60">{label}</div>
                </div>
              ))}
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
                {loading ? "Sending..." : "Send to Recruiting"}
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
        { name: "dims", label: "Dimensions (L x W x H)" },
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
  const trustSignals = [
    "FMCSA MC# 1077266 | 2.1M accident-free miles",
    "Same-day COI and lane references on request",
    "Dedicated ops pod with 5 minute response time",
  ];
  const progress = ((step + 1) / steps.length) * 100;
  const isLastStep = step === steps.length - 1;
  const currentFields = steps[step].fields;
  const isCurrentStepValid = currentFields.every((f) => {
    if (!f.required) return true;
    const value = data[f.name];
    if (value === undefined || value === null) return false;
    return String(value).trim().length > 0;
  });
  const submit = async () => {
    if (!isCurrentStepValid) return;
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
              <div>
                <div className="text-lg font-semibold">Shipper Quote</div>
                <p className="mt-1 text-xs uppercase tracking-[0.35em] text-white/40">Flatbed + specialized | response in 15 minutes</p>
              </div>
              <button
                onClick={() => onClose(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-white/60 transition hover:border-white/30 hover:text-white"
                aria-label="Close quote wizard"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
                </svg>
              </button>
            </div>
            <div className="mt-5">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.35em] text-white/50">
                <span>Step {step + 1} of {steps.length}</span>
                <span>{steps[step].label}</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: theme.gold }}
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                />
              </div>
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
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                variant="ghost"
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
              >
              Back
            </Button>
            <div className="flex flex-col items-stretch gap-2 text-center sm:flex-row sm:items-center sm:gap-3 sm:text-left">
              {!isLastStep ? (
                <Button variant="glow" onClick={() => setStep(step + 1)} disabled={!isCurrentStepValid}>
                  Continue
                </Button>
              ) : (
                <Button variant="glow" onClick={submit} disabled={sending || !isCurrentStepValid}>
                  {sending ? "Sending..." : "Submit Quote"}
                </Button>
              )}
              <span className="text-xs text-white/60">
                We reply with rate options and capacity confirmation within 15 minutes.
                </span>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4 text-xs text-white/70">
              <div className="grid gap-3 sm:grid-cols-3">
                {trustSignals.map((signal) => (
                  <div key={signal} className="flex items-center gap-2">
                    <span className="inline-flex h-1.5 w-1.5 rounded-full" style={{ background: theme.gold }} />
                    <span>{signal}</span>
                  </div>
                ))}
              </div>
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
            ASCON GROUP INC | MC# 1077266
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
            <li>(c) {new Date().getFullYear()} ASCON GROUP INC</li>
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
    document.title = "ASCON GROUP INC - Flatbed & Specialized Freight";
    const d = document.createElement("meta");
    d.name = "description";
    d.content = "ASCON GROUP INC (MC 1077266) - Flatbed & specialized freight with 24/7 dispatch. Aurora, IL.";
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
        <RecentLoads />
        <Services />
        <Fleet />
        <Safety />
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
        @keyframes heroGlow {
          0%, 100% { box-shadow: 0 0 22px rgba(198,166,100,0.45); transform: translateY(0); }
          50% { box-shadow: 0 0 32px rgba(198,166,100,0.75); transform: translateY(-1px); }
        }
      `}</style>
    </div>
  );
}





























