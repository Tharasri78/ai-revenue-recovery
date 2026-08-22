"use client";

import { Bell, Menu, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { getDemoAuthSession, isProtectedMerchantPath } from "@/lib/auth";

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
  const router = useRouter();
  const pageTitle = getPageTitle(pathname);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [session, setSession] = useState(getDemoAuthSession());

  useEffect(() => {
    const auth = getDemoAuthSession();
    setSession(auth);

    if (pathname === "/login" && auth?.isAuthenticated) {
      router.replace("/dashboard");
      return;
    }

    if (pathname === "/unauthorized" && auth?.isAuthenticated && auth.role !== "CUSTOMER") {
      router.replace("/dashboard");
      return;
    }

    if (isProtectedMerchantPath(pathname)) {
      if (!auth?.isAuthenticated) {
        router.replace("/login");
        return;
      }

      if (auth.role === "CUSTOMER") {
        router.replace("/unauthorized");
      }
    }
  }, [pathname, router]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = mobileNavOpen ? "hidden" : originalOverflow;

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileNavOpen]);

  const merchantDisplayName = session?.merchantName || session?.email?.split("@")[0] || "Merchant";
  const userEmail = session?.email || "";

  return (
    <div className="min-h-screen bg-[#0B0B0A]">
      <div className="mx-auto flex min-h-screen max-w-[1800px]">
        <Sidebar navItems={navigation} activePath={pathname} />

        {mobileNavOpen ? (
          <button
            type="button"
            aria-label="Close mobile navigation"
            onClick={() => setMobileNavOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          />
        ) : null}

        <Sidebar
          navItems={navigation}
          activePath={pathname}
          mobile
          open={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
          onNavigate={() => setMobileNavOpen(false)}
        />

        <main className="flex min-h-screen min-w-0 flex-1 flex-col bg-[#0B0B0A]">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0B0B0A]/95 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3 px-3 py-3 sm:px-5 lg:px-8">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <button
                  type="button"
                  aria-label="Open navigation"
                  onClick={() => setMobileNavOpen(true)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-[#121210] text-[#F5F0E6] lg:hidden"
                >
                  <Menu size={18} />
                </button>

                <div className="min-w-0">
                  <p className="truncate text-[10px] uppercase tracking-[0.22em] text-[#B7AEA2] sm:text-xs">AI Revenue Recovery</p>
                  <h1 className="mt-1 truncate text-lg font-semibold text-[#F5F0E6] sm:text-2xl">{pageTitle}</h1>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <label className="hidden items-center gap-2 rounded-md border border-white/10 bg-[#121210] px-2.5 py-2 text-sm text-[#B7AEA2] md:flex">
                  <Search size={16} />
                  <input
                    aria-label="Search transactions"
                    className="w-32 bg-transparent text-sm text-[#F5F0E6] placeholder:text-[#7E786F] focus:outline-none lg:w-48"
                    placeholder="Search transaction"
                  />
                </label>

                <button
                  type="button"
                  aria-label="Notifications"
                  className="relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-[#121210] text-[#D5CFC4]"
                >
                  <Bell size={16} />
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#D7A455]" />
                </button>

                <div className="hidden items-center gap-2 rounded-full border border-[#D7A455]/25 bg-[#D7A455]/10 px-2.5 py-1.5 text-[10px] font-medium text-[#F3C77F] sm:inline-flex">
                  <ShieldCheck size={12} />
                  Live
                </div>

                <Link href="/settings" className="flex items-center gap-2 rounded-md border border-white/10 bg-[#121210] px-2 py-1.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D7A455] text-xs font-semibold text-[#0B0B0A]">
                    {merchantDisplayName.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="hidden text-left sm:block">
                    <div className="text-[11px] text-[#D5CFC4]">{merchantDisplayName}</div>
                    <div className="text-[9px] uppercase tracking-[0.18em] text-[#A69D90]">{userEmail}</div>
                  </div>
                </Link>
              </div>
            </div>
          </header>

          <div className="flex-1 min-w-0 p-3 sm:p-5 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
