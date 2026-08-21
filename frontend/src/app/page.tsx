"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, BarChart3, CheckCircle2, Menu, ShieldCheck, Sparkles, TrendingUp, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

const featureItems = [
  { title: "Revenue-at-risk monitoring", description: "Find failed payments, abandoned checkouts, and recoverable transactions before they drift out of policy." },
  { title: "AI recovery decisioning", description: "Score recovery opportunities with policy-aware recommendations and confidence signals." },
  { title: "Guardrails and auditability", description: "Every action is tracked for review with clear reasoning and merchant policy compliance." },
  { title: "Operational analytics", description: "Measure recovery wins, funnel performance, and the business impact of every experiment." },
];

const workflow = [
  "Identify at-risk payment attempts",
  "Run AI decisioning on recoverable transactions",
  "Validate against policy guardrails",
  "Recover eligible payments and audit each outcome",
];

const navItems = [
  { label: "Product", href: "#product" },
  { label: "Workflow", href: "#workflow" },
  { label: "Benefits", href: "#benefits" },
];

const heroMetrics = [
  { label: "Recoverable value", value: "₹6.72L", tone: "text-[#4AB58D]" },
  { label: "Recovery rate", value: "59.8%", tone: "text-[#F3C77F]" },
  { label: "Policy-safe actions", value: "128", tone: "text-[#F5F0E6]" },
];

const sectionReveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
} as const;

export default function HomePage() {
  const shouldReduceMotion = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navMotion = shouldReduceMotion ? {} : { whileHover: { scale: 1.02 }, transition: { duration: 0.2 } };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0B0B0A] text-[#F5F0E6]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(215,164,85,0.12),_transparent_46%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.03),_transparent_38%)]" />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        animate={shouldReduceMotion ? {} : { backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={shouldReduceMotion ? undefined : { duration: 18, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          maskImage: "radial-gradient(circle at center, black, transparent 80%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <motion.header
          initial={shouldReduceMotion ? false : { opacity: 0, y: -12 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-between gap-4 rounded-full border border-white/10 bg-[#121210]/80 px-4 py-3 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#D7A455] text-sm font-semibold text-[#0B0B0A]">AR</div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#B7AEA2]">AI R</div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-[#F5F0E6]">Revenue Recovery</div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-[#B7AEA2] md:flex">
            {navItems.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                whileHover={shouldReduceMotion ? undefined : { color: "#F5F0E6" }}
                className="relative pb-1 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#D7A455] after:transition-transform after:duration-200 hover:text-[#F5F0E6] hover:after:scale-x-100"
              >
                {item.label}
              </motion.a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <motion.div {...navMotion} className="hidden sm:block">
              <Link href="/login" className="inline-flex items-center justify-center rounded-md border border-white/10 bg-[#171613] px-3 py-2 text-sm text-[#F5F0E6] transition-colors hover:bg-[#1b1a17]">
                Merchant Login
              </Link>
            </motion.div>
            <motion.div {...navMotion}>
              <Link href="/signup">
                <Button size="sm">Start for free</Button>
              </Link>
            </motion.div>

            <button
              type="button"
              aria-label="Toggle navigation"
              onClick={() => setMobileOpen((current) => !current)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-[#171613] text-[#F5F0E6] md:hidden"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </motion.header>

        {mobileOpen ? (
          <motion.nav
            initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            className="mt-3 rounded-2xl border border-white/10 bg-[#121210] p-3 md:hidden"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a key={item.label} href={item.href} onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm text-[#B7AEA2] transition-colors hover:bg-[#171613] hover:text-[#F5F0E6]">
                  {item.label}
                </a>
              ))}
              <Link href="/login" onClick={() => setMobileOpen(false)} className="rounded-md border border-white/10 bg-[#171613] px-3 py-2 text-sm text-[#F5F0E6] transition-colors hover:bg-[#1b1a17]">
                Merchant Login
              </Link>
              <Link href="/signup" onClick={() => setMobileOpen(false)} className="rounded-md bg-[#D7A455] px-3 py-2 text-sm font-medium text-[#0B0B0A]">
                Start for free
              </Link>
            </div>
          </motion.nav>
        ) : null}

        <section className="mt-14 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 rounded-full border border-[#D7A455]/25 bg-[#D7A455]/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-[#F3C77F]"
            >
              <ShieldCheck size={12} />
              Merchant-first recovery platform
            </motion.div>

            <motion.h1
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-xl text-4xl font-semibold tracking-tight text-[#F5F0E6] sm:text-5xl lg:text-6xl"
            >
              Recover revenue before it is lost.
            </motion.h1>

            <motion.p
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 max-w-xl text-lg text-[#B7AEA2]"
            >
              AI Revenue Recovery helps merchants identify revenue at risk, prioritize likely recoveries, and execute policy-safe interventions before revenue disappears.
            </motion.p>

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link href="/signup">
                <motion.div whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}>
                  <Button size="lg" className="w-full sm:w-auto">
                    Start for free <ArrowRight className="ml-2" size={16} />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/login">
                <motion.div whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}>
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Merchant Login
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex flex-wrap gap-5 text-sm text-[#B7AEA2]"
            >
              {[
                "Payment anomaly detection",
                "AI recovery scoring",
                "Policy-aware actions",
              ].map((item, index) => (
                <motion.div
                  key={item}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.42 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-2"
                >
                  <motion.span initial={shouldReduceMotion ? false : { scale: 0.85 }} animate={shouldReduceMotion ? { scale: 1 } : { scale: 1 }} transition={{ duration: 0.25, delay: 0.5 + index * 0.1 }} className="flex items-center justify-center">
                    <CheckCircle2 size={15} className="text-[#4AB58D]" />
                  </motion.span>
                  {item}
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18, scale: 0.96 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-2xl border border-white/10 bg-[#121210] p-4 sm:p-5"
          >
            <motion.div
              aria-hidden="true"
              className="absolute -inset-0.5 rounded-2xl border border-[#D7A455]/20"
              animate={shouldReduceMotion ? {} : { opacity: [0.3, 0.6, 0.3], boxShadow: ["0 0 0 rgba(215,164,85,0.02)", "0 0 18px rgba(215,164,85,0.08)", "0 0 0 rgba(215,164,85,0.02)"] }}
              transition={shouldReduceMotion ? undefined : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative rounded-xl border border-white/10 bg-[#171613] p-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#B7AEA2]">Revenue at risk</p>
                  <motion.p
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-2 text-3xl font-semibold text-[#F5F0E6]"
                  >
                    ₹18.4L
                  </motion.p>
                </div>
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.85 }}
                  animate={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, delay: 0.2 }}
                  className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#D7A455]/10 text-[#F3C77F]"
                >
                  <TrendingUp size={22} />
                </motion.div>
              </div>

              <div className="mt-4 space-y-4">
                {heroMetrics.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.32, delay: 0.26 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center justify-between rounded-md border border-white/10 bg-[#121210] px-3 py-2.5"
                  >
                    <span className="text-sm text-[#B7AEA2]">{item.label}</span>
                    <span className={`text-sm font-medium ${item.tone}`}>{item.value}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <motion.section
          id="product"
          {...sectionReveal}
          className="mt-20"
        >
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-[#D7A455]">Why merchants use it</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#F5F0E6]">Built for revenue recovery operations</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featureItems.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.01 }}
                className="rounded-xl border border-white/10 bg-[#121210] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition-shadow duration-200 hover:border-[#D7A455]/30 hover:shadow-[0_10px_25px_rgba(0,0,0,0.18)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#D7A455]/10 text-[#F3C77F] transition-colors duration-200 group-hover:bg-[#D7A455]/15">
                  {feature.title.includes("AI") ? <Sparkles size={18} /> : feature.title.includes("Analytics") ? <BarChart3 size={18} /> : <ShieldCheck size={18} />}
                </div>
                <h3 className="mt-4 text-lg font-medium text-[#F5F0E6]">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#B7AEA2]">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section id="workflow" {...sectionReveal} className="mt-20 rounded-2xl border border-white/10 bg-[#121210] p-6 sm:p-8">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-[#D7A455]">Simple workflow</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#F5F0E6]">From signal to recovered revenue</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {workflow.map((step, index) => (
              <motion.div
                key={step}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
                whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.42, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="relative rounded-xl border border-white/10 bg-[#171613] p-4"
              >
                {index !== workflow.length - 1 ? <div className="absolute -right-2 top-1/2 hidden h-px w-4 -translate-y-1/2 bg-[#D7A455]/30 xl:block" /> : null}
                <div className="text-xs uppercase tracking-[0.2em] text-[#D7A455]">Step {index + 1}</div>
                <p className="mt-3 text-base font-medium text-[#F5F0E6]">{step}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section id="benefits" {...sectionReveal} className="mt-20">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-white/10 bg-[#121210] p-6"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-[#D7A455]">Merchant benefits</p>
              <h2 className="mt-3 text-3xl font-semibold text-[#F5F0E6]">Protect earnings without adding operational drag</h2>
              <ul className="mt-6 space-y-4 text-[#B7AEA2]">
                {[
                  "Reduce lost revenue from failed or abandoned payment flows.",
                  "Surface the highest-probability recovery cases with clear confidence signals.",
                  "Keep teams aligned with auditable decisions and policy guardrails.",
                ].map((item, index) => (
                  <motion.li
                    key={item}
                    initial={shouldReduceMotion ? false : { opacity: 0, x: -10 }}
                    whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.35, delay: index * 0.08, ease: "easeOut" }}
                    className="flex gap-3"
                  >
                    <motion.span initial={shouldReduceMotion ? false : { scale: 0.8, opacity: 0 }} whileInView={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.25, delay: index * 0.08 }} className="mt-0.5 inline-flex">
                      <CheckCircle2 size={18} className="text-[#4AB58D]" />
                    </motion.span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-white/10 bg-[#171613] p-6"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-[#D7A455]">What the platform includes</p>
              <div className="mt-6 space-y-4 text-[#D5CFC4]">
                {[
                  ["Revenue-at-risk visibility", "for failed and recoverable transactions."],
                  ["AI recommendation engine", "to prioritize recovery actions."],
                  ["Audit-ready reporting", "so every retry and policy evaluation is traceable."],
                ].map(([title, text], index) => (
                  <motion.div
                    key={title}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                    whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.35, delay: index * 0.08, ease: "easeOut" }}
                    className="rounded-md border border-white/10 bg-[#121210] p-4"
                  >
                    <span className="font-medium text-[#F5F0E6]">{title}</span> {text}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 rounded-2xl border border-[#D7A455]/20 bg-[#121210] p-6 sm:p-8"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[#D7A455]">Recover more revenue</p>
          <h2 className="mt-3 text-3xl font-semibold text-[#F5F0E6]">Recover more revenue with intelligent recovery.</h2>
          <p className="mt-4 max-w-2xl text-base text-[#B7AEA2]">
            Connect your payment flow, define your recovery policies, and let AI prioritize the opportunities worth recovering.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/signup">
              <motion.div whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}>
                <Button size="lg" className="w-full sm:w-auto">
                  Start for free <ArrowRight className="ml-2" size={16} />
                </Button>
              </motion.div>
            </Link>
            <Link href="/login">
              <motion.div whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}>
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Merchant Login
                </Button>
              </motion.div>
            </Link>
          </div>
        </motion.section>

        <footer className="mt-16 border-t border-white/10 py-8 text-center text-sm text-[#B7AEA2]">
          AI Revenue Recovery · Demo environment for merchant operations
        </footer>
      </div>
    </main>
  );
}
