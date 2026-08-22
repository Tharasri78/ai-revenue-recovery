"use client";

import { ArrowRight, CheckCircle2, PlugZap, ShieldCheck, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { authGetCurrentUser, merchantCompleteOnboarding } from "@/services/auth";
import { updatePolicy } from "@/services/policies";

const steps = [
  "Business information",
  "Payment gateway connection",
  "Recovery preferences",
  "Complete setup",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [businessName, setBusinessName] = useState("Northwind Studio");
  const [businessEmail, setBusinessEmail] = useState("billing@northwindstudio.in");
  const [category, setCategory] = useState("Digital lifestyle");
  const [gatewayConnected, setGatewayConnected] = useState(false);

  useEffect(() => {
    authGetCurrentUser().then((current) => {
      if (!current || !["MERCHANT_ADMIN", "MERCHANT_OPERATOR"].includes(current.role)) {
        router.replace("/login");
      }
    });
  }, [router]);

  async function handleFinish() {
    try {
      // Create/update real RecoveryPolicy in database
      await updatePolicy({
        mode: "ASSISTED",
        name: "Initial Recovery Policy",
        description: `Recovery policy created during onboarding for ${businessName}`,
      });
    } catch (err) {
      console.warn("Could not save initial policy during onboarding:", err);
    }

    await merchantCompleteOnboarding({
      businessName,
      category,
      businessEmail,
      gatewayConnected,
      recoveryMode: "Assisted",
      maxRetryAttempts: 2,
      recoveryWindowHours: 48,
      maxAutoRecoveryAmount: 25000,
    });

    router.push("/dashboard");
  }

  function nextStep() {
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0B0A] px-3 py-8 sm:px-4">
      <div className="w-full max-w-4xl rounded-2xl border border-white/10 bg-[#121210] p-4 sm:p-6 md:p-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#B7AEA2]">Setup</p>
            <h1 className="mt-2 text-2xl font-semibold text-[#F5F0E6]">Merchant onboarding</h1>
          </div>

          <div className="flex flex-wrap gap-2">
            {steps.map((label, index) => (
              <div
                key={label}
                className={[
                  "rounded-full border px-2.5 py-1.5 text-[10px] uppercase tracking-[0.16em]",
                  index === step ? "border-[#D7A455]/40 bg-[#D7A455]/10 text-[#F3C77F]" : "border-white/10 bg-[#171613] text-[#B7AEA2]",
                ].join(" ")}
              >
                {index + 1}. {label}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          {step === 0 ? (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-[#D5CFC4]">Business name</label>
                <input value={businessName} onChange={(event) => setBusinessName(event.target.value)} className="w-full rounded-md border border-white/10 bg-[#121210] px-3 py-2.5 text-[#F5F0E6]" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-[#D5CFC4]">Business category</label>
                <input value={category} onChange={(event) => setCategory(event.target.value)} className="w-full rounded-md border border-white/10 bg-[#121210] px-3 py-2.5 text-[#F5F0E6]" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-[#D5CFC4]">Business email</label>
                <input value={businessEmail} onChange={(event) => setBusinessEmail(event.target.value)} className="w-full rounded-md border border-white/10 bg-[#121210] px-3 py-2.5 text-[#F5F0E6]" />
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="rounded-xl border border-white/10 bg-[#171613] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#B7AEA2]">Gateway</p>
                  <h2 className="mt-2 text-2xl font-semibold text-[#F5F0E6]">Razorpay</h2>
                </div>
                <div className="rounded-full border border-[#D7A455]/25 bg-[#D7A455]/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-[#F3C77F]">
                  Test Mode
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-dashed border-white/10 bg-[#121210] p-4 text-sm text-[#B7AEA2]">
                Status: <span className="font-medium text-[#F5F0E6]">Not connected</span>
              </div>

              <div className="mt-6">
                <Button
                  type="button"
                  variant={gatewayConnected ? "secondary" : "primary"}
                  className="w-full sm:w-auto"
                  onClick={() => setGatewayConnected((current) => !current)}
                >
                  {gatewayConnected ? "Connected ✓" : "Connect Test Account"}
                </Button>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-4 rounded-xl border border-white/10 bg-[#171613] p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-[#121210] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#B7AEA2]">Maximum retry attempts</p>
                  <p className="mt-2 text-2xl font-semibold text-[#F5F0E6]">2</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#121210] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#B7AEA2]">Recovery window</p>
                  <p className="mt-2 text-2xl font-semibold text-[#F5F0E6]">48 hours</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#121210] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#B7AEA2]">Maximum auto-recovery</p>
                  <p className="mt-2 text-2xl font-semibold text-[#F5F0E6]">₹25,000</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#121210] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#B7AEA2]">Recovery mode</p>
                  <p className="mt-2 text-2xl font-semibold text-[#F5F0E6]">Assisted</p>
                </div>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="rounded-xl border border-[#D7A455]/25 bg-[#D7A455]/10 p-5 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#D7A455] text-[#0B0B0A]">
                <CheckCircle2 size={28} />
              </div>
              <h2 className="mt-5 text-2xl font-semibold text-[#F5F0E6]">Merchant account ready</h2>
              <p className="mt-2 text-[#D5CFC4]">Your recovery workflows, policy guardrails, and test gateway connection are ready for demo access.</p>
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-[#B7AEA2]">
            <Sparkles size={14} className="text-[#D7A455]" />
            Demo/Test Mode
          </div>

          {step < steps.length - 1 ? (
            <Button type="button" onClick={nextStep} className="sm:ml-auto">
              Continue <ArrowRight className="ml-2" size={16} />
            </Button>
          ) : (
            <Button type="button" onClick={handleFinish} className="sm:ml-auto">
              Go to Dashboard <ArrowRight className="ml-2" size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
