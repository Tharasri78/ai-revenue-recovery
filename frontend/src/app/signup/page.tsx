"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authRegister } from "@/services/auth";
import { getDemoAuthSession } from "@/lib/auth";
import { Button } from "@/components/ui/Button";

export default function SignupPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("Northwind Studio");
  const [businessEmail, setBusinessEmail] = useState("billing@northwindstudio.in");
  const [password, setPassword] = useState("demo123");
  const [confirmPassword, setConfirmPassword] = useState("demo123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (getDemoAuthSession()?.isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setError("");
      await authRegister({
        businessName,
        businessEmail,
        password,
        confirmPassword,
      });

      router.push("/onboarding");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to create merchant account.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0B0A] px-3 py-8 sm:px-4 sm:py-12">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-[#121210] shadow-[0_0_0_1px_rgba(255,255,255,0.02)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="border-b border-white/10 bg-[#121210] p-6 sm:p-8 md:p-12 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#D7A455] text-sm font-semibold text-[#0B0B0A]">AR</div>
            <div>
              <div className="text-sm font-semibold tracking-[0.2em] text-[#F5F0E6]">AI R</div>
              <div className="text-[10px] uppercase tracking-[0.24em] text-[#B7AEA2]">Revenue Recovery</div>
            </div>
          </div>

          <div className="mt-10 max-w-md sm:mt-12">
            <p className="text-xs uppercase tracking-[0.2em] text-[#D7A455]">Merchant onboarding</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#F5F0E6] sm:text-4xl">
              Recover revenue before it is lost.
            </h1>
            <p className="mt-4 text-base text-[#B7AEA2]">
              Protect checkout revenue, recover failed payments, and keep every recovery action aligned to your policies.
            </p>
          </div>

          <div className="mt-8 space-y-3 sm:space-y-4">
            {[
              "Live revenue-at-risk monitoring",
              "AI decisioning with policy guardrails",
              "Operational audit trail for every recovery attempt",
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
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#0F0F0D] p-4 sm:p-6">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.18em] text-[#B7AEA2]">Create account</p>
              <h2 className="mt-2 text-2xl font-semibold text-[#F5F0E6]">Merchant signup</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="businessName" className="mb-2 block text-sm text-[#D5CFC4]">Business name</label>
                <input
                  id="businessName"
                  value={businessName}
                  onChange={(event) => setBusinessName(event.target.value)}
                  className="w-full rounded-md border border-white/10 bg-[#121210] px-3 py-2.5 text-[#F5F0E6] outline-none placeholder:text-[#7E786F] focus:border-[#D7A455]/60"
                  placeholder="Northwind Studio"
                />
              </div>

              <div>
                <label htmlFor="businessEmail" className="mb-2 block text-sm text-[#D5CFC4]">Business email</label>
                <input
                  id="businessEmail"
                  type="email"
                  value={businessEmail}
                  onChange={(event) => setBusinessEmail(event.target.value)}
                  className="w-full rounded-md border border-white/10 bg-[#121210] px-3 py-2.5 text-[#F5F0E6] outline-none placeholder:text-[#7E786F] focus:border-[#D7A455]/60"
                  placeholder="billing@company.com"
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
                    className="w-full rounded-md border border-white/10 bg-[#121210] px-3 py-2.5 pr-11 text-[#F5F0E6] outline-none placeholder:text-[#7E786F] focus:border-[#D7A455]/60"
                    placeholder="Minimum 8 characters"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute inset-y-0 right-3 flex items-center text-[#B7AEA2]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm text-[#D5CFC4]">Confirm password</label>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full rounded-md border border-white/10 bg-[#121210] px-3 py-2.5 text-[#F5F0E6] outline-none placeholder:text-[#7E786F] focus:border-[#D7A455]/60"
                  placeholder="Re-enter password"
                />
              </div>

              {error ? (
                <div className="rounded-md border border-[#E26B5B]/30 bg-[#E26B5B]/10 px-3 py-2 text-sm text-[#F7B0A5]">
                  {error}
                </div>
              ) : null}

              <Button type="submit" className="w-full" size="lg">
                Create merchant account <ArrowRight className="ml-2" size={16} />
              </Button>
            </form>

            <div className="mt-6 border-t border-white/10 pt-4 text-sm text-[#B7AEA2]">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-[#D7A455] hover:text-[#F3C77F]">
                Merchant login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
