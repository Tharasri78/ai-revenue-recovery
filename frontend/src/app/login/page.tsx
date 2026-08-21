import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0B0A] px-4 py-12">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-[#121210] shadow-[0_0_0_1px_rgba(255,255,255,0.02)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="border-b border-white/10 bg-[#121210] p-8 md:p-12 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#D7A455] text-sm font-semibold text-[#0B0B0A]">AR</div>
            <div>
              <div className="text-sm font-semibold tracking-[0.2em] text-[#F5F0E6]">AI R</div>
              <div className="text-[10px] uppercase tracking-[0.24em] text-[#B7AEA2]">Revenue Recovery</div>
            </div>
          </div>

          <div className="mt-12 max-w-md">
            <p className="text-xs uppercase tracking-[0.2em] text-[#D7A455]">Merchant operations</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#F5F0E6]">
              Protect revenue before it disappears.
            </h1>
            <p className="mt-4 max-w-sm text-base text-[#B7AEA2]">
              Detect failed payments, recover eligible transactions, and validate every action against merchant policy before execution.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {[
              "Revenue at risk surveillance",
              "AI decisioning with policy checks",
              "Operational recovery tracking",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-md border border-white/10 bg-[#171613] px-3 py-2.5 text-sm text-[#F5F0E6]">
                <CheckCircle2 size={16} className="text-[#4AB58D]" />
                {item}
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-2 rounded-md border border-[#D7A455]/20 bg-[#D7A455]/10 px-3 py-2 text-sm text-[#F3C77F]">
            <ShieldCheck size={16} />
            Demo environment · Test Mode
          </div>
        </div>

        <div className="flex items-center justify-center p-6 md:p-10">
          <Card className="w-full max-w-md border-white/10 bg-[#0F0F0D] p-6">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.18em] text-[#B7AEA2]">Access</p>
              <h2 className="mt-2 text-2xl font-semibold text-[#F5F0E6]">Merchant login</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-[#D5CFC4]">Email</label>
                <input
                  className="w-full rounded-md border border-white/10 bg-[#121210] px-3 py-2.5 text-[#F5F0E6] outline-none placeholder:text-[#7E786F]"
                  defaultValue="aarav@northwindstudio.in"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-[#D5CFC4]">Password</label>
                <input
                  type="password"
                  className="w-full rounded-md border border-white/10 bg-[#121210] px-3 py-2.5 text-[#F5F0E6] outline-none placeholder:text-[#7E786F]"
                  defaultValue="demo123"
                />
              </div>

              <Link href="/dashboard">
                <Button className="mt-2 w-full" size="lg">
                  Sign in <ArrowRight className="ml-2" size={16} />
                </Button>
              </Link>
            </div>

            <div className="mt-6 border-t border-white/10 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#B7AEA2]">Demo merchant</span>
                <Link href="/dashboard" className="text-sm font-medium text-[#D7A455]">
                  Open demo environment
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
