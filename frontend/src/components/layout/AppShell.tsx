"use client";

import { Bell, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/Button";
import { merchant } from "@/lib/mock-data/mock-data";

const navigation = [
  { href: "/dashboard", label: "Overview" },
  { href: "/revenue-at-risk", label: "Revenue at Risk" },
  { href: "/recovery", label: "Recovery Center" },
  { href: "/transactions", label: "Transactions" },
  { href: "/analytics", label: "Analytics" },
  { href: "/experiments", label: "Experiment Lab" },
  { href: "/policies", label: "Policies" },
  { href: "/audit-logs", label: "Audit Logs" },
  { href: "/settings", label: "Settings" },
];

function getPageTitle(pathname: string) {
  const map: Record<string, string> = {
    "/dashboard": "Overview",
    "/revenue-at-risk": "Revenue at Risk",
    "/recovery": "Recovery Center",
    "/transactions": "Transactions",
    "/analytics": "Analytics",
    "/experiments": "Experiment Lab",
    "/policies": "Recovery Policies",
    "/audit-logs": "Audit Logs",
    "/settings": "Settings",
  };

  return map[pathname] ?? "Overview";
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <div className="min-h-screen bg-[#0B0B0A]">
      <div className="mx-auto flex min-h-screen max-w-[1800px]">
        <Sidebar navItems={navigation} activePath={pathname} />

        <main className="flex min-h-screen flex-1 flex-col bg-[#0B0B0A]">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0B0B0A]/95 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <div className="md:hidden">
                  <Sidebar navItems={navigation} activePath={pathname} mobile />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[#B7AEA2]">AI Revenue Recovery</p>
                  <h1 className="mt-1 text-xl font-semibold text-[#F5F0E6] sm:text-2xl">{pageTitle}</h1>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <label className="hidden items-center gap-2 rounded-md border border-white/10 bg-[#121210] px-3 py-2 text-sm text-[#B7AEA2] md:flex">
                  <Search size={16} />
                  <input
                    aria-label="Search transactions"
                    className="w-56 bg-transparent text-sm text-[#F5F0E6] placeholder:text-[#7E786F] focus:outline-none"
                    placeholder="Search transaction"
                  />
                </label>

                <button aria-label="Notifications" className="relative rounded-md border border-white/10 bg-[#121210] p-2 text-[#D5CFC4]">
                  <Bell size={16} />
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#D7A455]" />
                </button>

                <div className="inline-flex items-center gap-2 rounded-full border border-[#D7A455]/25 bg-[#D7A455]/10 px-2.5 py-1.5 text-xs font-medium text-[#F3C77F]">
                  <ShieldCheck size={12} />
                  Test Mode
                </div>

                <Link href="/settings" className="flex items-center gap-3 rounded-md border border-white/10 bg-[#121210] px-2.5 py-1.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D7A455] text-xs font-semibold text-[#0B0B0A]">
                    {merchant.name.slice(0, 1)}
                  </div>
                  <div className="hidden text-left sm:block">
                    <div className="text-xs text-[#D5CFC4]">{merchant.name}</div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-[#A69D90]">{merchant.storeName}</div>
                  </div>
                </Link>
              </div>
            </div>
          </header>

          <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
