import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0B0B0A] text-[#F5F0E6]">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 rounded-full border border-white/10 bg-[#121210]/80 px-4 py-3 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#D7A455] text-sm font-semibold text-[#0B0B0A]">AR</div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#B7AEA2]">AI R</div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-[#F5F0E6]">Revenue Recovery</div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-[#B7AEA2] md:flex">
            <a href="#product" className="hover:text-[#F5F0E6]">Product</a>
            <a href="#workflow" className="hover:text-[#F5F0E6]">Workflow</a>
            <a href="#benefits" className="hover:text-[#F5F0E6]">Benefits</a>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden rounded-md border border-white/10 bg-[#171613] px-3 py-2 text-sm text-[#F5F0E6] hover:bg-[#1b1a17] sm:inline-flex">
              Merchant Login
            </Link>
            <Link href="/signup">
              <Button size="sm">Start for free</Button>
            </Link>
          </div>
        </header>

        <section className="mt-14 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D7A455]/25 bg-[#D7A455]/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-[#F3C77F]">
              <ShieldCheck size={12} />
              Merchant-first recovery platform
            </div>

            <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight text-[#F5F0E6] sm:text-5xl lg:text-6xl">
              Recover revenue before it is lost.
            </h1>

            <p className="mt-5 max-w-xl text-lg text-[#B7AEA2]">
              AI Revenue Recovery helps merchants identify revenue at risk, prioritize likely recoveries, and execute policy-safe interventions before revenue disappears.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start for free <ArrowRight className="ml-2" size={16} />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Merchant Login
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-5 text-sm text-[#B7AEA2]">
              <div className="flex items-center gap-2"><CheckCircle2 size={15} className="text-[#4AB58D]" /> Payment anomaly detection</div>
              <div className="flex items-center gap-2"><CheckCircle2 size={15} className="text-[#4AB58D]" /> AI recovery scoring</div>
              <div className="flex items-center gap-2"><CheckCircle2 size={15} className="text-[#4AB58D]" /> Policy-aware actions</div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#121210] p-4 sm:p-5">
            <div className="rounded-xl border border-white/10 bg-[#171613] p-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#B7AEA2]">Revenue at risk</p>
                  <p className="mt-2 text-3xl font-semibold text-[#F5F0E6]">₹18.4L</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#D7A455]/10 text-[#F3C77F]">
                  <TrendingUp size={22} />
                </div>
              </div>

              <div className="mt-4 space-y-4">
                {[
                  { label: "Recoverable value", value: "₹6.72L", tone: "text-[#4AB58D]" },
                  { label: "Recovery rate", value: "59.8%", tone: "text-[#F3C77F]" },
                  { label: "Policy-safe actions", value: "128", tone: "text-[#F5F0E6]" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-md border border-white/10 bg-[#121210] px-3 py-2.5">
                    <span className="text-sm text-[#B7AEA2]">{item.label}</span>
                    <span className={`text-sm font-medium ${item.tone}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="product" className="mt-20">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-[#D7A455]">Why merchants use it</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#F5F0E6]">Built for revenue recovery operations</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featureItems.map((feature) => (
              <div key={feature.title} className="rounded-xl border border-white/10 bg-[#121210] p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#D7A455]/10 text-[#F3C77F]">
                  {feature.title.includes("AI") ? <Sparkles size={18} /> : feature.title.includes("Analytics") ? <BarChart3 size={18} /> : <ShieldCheck size={18} />}
                </div>
                <h3 className="mt-4 text-lg font-medium text-[#F5F0E6]">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#B7AEA2]">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="workflow" className="mt-20 rounded-2xl border border-white/10 bg-[#121210] p-6 sm:p-8">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-[#D7A455]">Simple workflow</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#F5F0E6]">From signal to recovered revenue</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {workflow.map((step, index) => (
              <div key={step} className="rounded-xl border border-white/10 bg-[#171613] p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-[#D7A455]">Step {index + 1}</div>
                <p className="mt-3 text-base font-medium text-[#F5F0E6]">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="benefits" className="mt-20">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-2xl border border-white/10 bg-[#121210] p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-[#D7A455]">Merchant benefits</p>
              <h2 className="mt-3 text-3xl font-semibold text-[#F5F0E6]">Protect earnings without adding operational drag</h2>
              <ul className="mt-6 space-y-4 text-[#B7AEA2]">
                <li className="flex gap-3"><CheckCircle2 size={18} className="mt-0.5 text-[#4AB58D]" /> Reduce lost revenue from failed or abandoned payment flows.</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="mt-0.5 text-[#4AB58D]" /> Surface the highest-probability recovery cases with clear confidence signals.</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="mt-0.5 text-[#4AB58D]" /> Keep teams aligned with auditable decisions and policy guardrails.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#171613] p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-[#D7A455]">What the platform includes</p>
              <div className="mt-6 space-y-4 text-[#D5CFC4]">
                <div className="rounded-md border border-white/10 bg-[#121210] p-4"><span className="font-medium text-[#F5F0E6]">Revenue-at-risk visibility</span> for failed and recoverable transactions.</div>
                <div className="rounded-md border border-white/10 bg-[#121210] p-4"><span className="font-medium text-[#F5F0E6]">AI recommendation engine</span> to prioritize recovery actions.</div>
                <div className="rounded-md border border-white/10 bg-[#121210] p-4"><span className="font-medium text-[#F5F0E6]">Audit-ready reporting</span> so every retry and policy evaluation is traceable.</div>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-16 border-t border-white/10 py-8 text-center text-sm text-[#B7AEA2]">
          AI Revenue Recovery · Demo environment for merchant operations
        </footer>
      </div>
    </main>
  );
}
