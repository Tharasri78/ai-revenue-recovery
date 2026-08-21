"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getDemoAuthSession } from "@/lib/auth";
import { authLogin } from "@/services/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("aarav@northwindstudio.in");
  const [password, setPassword] = useState("demo123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (getDemoAuthSession()?.isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setError("");
      await authLogin({ email, password, rememberMe });
      router.push("/dashboard");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to sign in.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0B0A] px-3 py-8 sm:px-4 sm:py-12">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-[#121210] shadow-[0_0_0_1px_rgba(255,255,255,0.02)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="border-b border-white/10 bg-[#121210] p-6 sm:p-8 md:p-12 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#D7A455] text-sm font-semibold text-[#0B0B0A]">AR</div>
            <div>
              <div className="text-sm font-semibold tracking-[0.2em] text-[#F5F0E6]">AI R</div>
              <div className="text-[10px] uppercase tracking-[0.24em] text-[#B7AEA2]">Revenue Recovery</div>
            </div>
          </div>

          <div className="mt-10 max-w-md sm:mt-12">
            <p className="text-xs uppercase tracking-[0.2em] text-[#D7A455]">Merchant operations</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#F5F0E6] sm:text-4xl">
              Protect revenue before it disappears.
            </h1>
            <p className="mt-4 max-w-sm text-base text-[#B7AEA2]">
              Detect failed payments, recover eligible transactions, and validate every action against merchant policy before execution.
            </p>
          </div>

          <div className="mt-8 space-y-3 sm:mt-10 sm:space-y-4">
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

          <div className="mt-8 flex items-center gap-2 rounded-md border border-[#D7A455]/20 bg-[#D7A455]/10 px-3 py-2 text-sm text-[#F3C77F] sm:mt-10">
            <ShieldCheck size={16} />
            Demo environment · Test Mode
          </div>
        </div>

        <div className="flex items-center justify-center p-4 sm:p-6 md:p-10">
          <Card className="w-full max-w-md border-white/10 bg-[#0F0F0D] p-4 sm:p-6">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.18em] text-[#B7AEA2]">Access</p>
              <h2 className="mt-2 text-2xl font-semibold text-[#F5F0E6]">Merchant login</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm text-[#D5CFC4]">Email</label>
                <input
                  id="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  className="w-full rounded-md border border-white/10 bg-[#121210] px-3 py-2.5 text-[#F5F0E6] outline-none placeholder:text-[#7E786F] focus:border-[#D7A455]/60"
                  placeholder="merchant@company.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm text-[#D5CFC4]">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    className="w-full rounded-md border border-white/10 bg-[#121210] px-3 py-2.5 pr-11 text-[#F5F0E6] outline-none placeholder:text-[#7E786F] focus:border-[#D7A455]/60"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute inset-y-0 right-3 flex items-center text-[#B7AEA2] transition hover:text-[#F5F0E6]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 text-sm text-[#B7AEA2]">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-4 w-4 rounded border-white/10 bg-[#121210] accent-[#D7A455]"
                  />
                  Remember me
                </label>

                <button type="button" className="font-medium text-[#D7A455] hover:text-[#F3C77F]">
                  Forgot password?
                </button>
              </div>

              {error ? (
                <div className="rounded-md border border-[#E26B5B]/30 bg-[#E26B5B]/10 px-3 py-2 text-sm text-[#F7B0A5]">
                  {error}
                </div>
              ) : null}

              <Button type="submit" className="mt-2 w-full" size="lg">
                Sign in <ArrowRight className="ml-2" size={16} />
              </Button>

              {rememberMe ? (
                <p className="text-xs text-[#7E786F]">Session remains active in this browser for the demo environment.</p>
              ) : null}
            </form>

            <div className="mt-6 border-t border-white/10 pt-4">
              <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
                <span className="text-[#B7AEA2]">Demo merchant</span>
                <Link href="/signup" className="font-medium text-[#D7A455]">
                  Don't have an account? Create merchant account
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
