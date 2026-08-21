"use client";

import { BarChart3, FileText, Gauge, LogOut, ShieldCheck, Sparkles, WalletCards } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearDemoAuthSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { merchant } from "@/lib/mock-data/mock-data";

interface SidebarProps {
  navItems: Array<{ href: string; label: string }>;
  activePath: string;
  mobile?: boolean;
  open?: boolean;
  onNavigate?: () => void;
  onClose?: () => void;
}

const icons = {
  "/dashboard": Gauge,
  "/revenue-at-risk": WalletCards,
  "/recovery": Sparkles,
  "/transactions": FileText,
  "/analytics": BarChart3,
  "/experiments": BarChart3,
  "/policies": ShieldCheck,
  "/audit-logs": FileText,
  "/settings": ShieldCheck,
};

export function Sidebar({ navItems, activePath, mobile = false, open = true, onNavigate, onClose }: SidebarProps) {
  const router = useRouter();

  const handleSignOut = () => {
    clearDemoAuthSession();
    router.push("/login");
  };

  const content = (
    <aside
      className={cn(
        mobile
          ? cn(
              "fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-white/10 bg-[#0F0F0D] p-4 transition-transform duration-200 ease-out",
              open ? "translate-x-0" : "-translate-x-full",
            )
          : "hidden w-[260px] shrink-0 border-r border-white/10 bg-[#0F0F0D] p-4 lg:flex lg:flex-col",
      )}
    >
      <div className="mb-8 flex items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#D7A455] text-sm font-semibold text-[#0B0B0A]">AR</div>
          <div>
            <div className="text-sm font-semibold tracking-[0.18em] text-[#F5F0E6]">AI R</div>
            <div className="text-[10px] uppercase tracking-[0.24em] text-[#B7AEA2]">Revenue Recovery</div>
          </div>
        </div>

        {mobile ? (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="rounded-md border border-white/10 bg-[#121210] p-2 text-[#D5CFC4]"
          >
            ×
          </button>
        ) : null}
      </div>

      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const Icon = icons[item.href as keyof typeof icons] ?? Gauge;
          const isActive = activePath === item.href || activePath.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                isActive ? "bg-[#171613] text-[#F5F0E6] ring-1 ring-[#D7A455]/25" : "text-[#B7AEA2] hover:bg-[#121210] hover:text-[#F5F0E6]",
              )}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-xl border border-white/10 bg-[#121210] p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D7A455] text-xs font-semibold text-[#10100E]">
            {merchant.name.slice(0, 1)}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-[#F5F0E6]">{merchant.storeName}</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#A69D90]">{merchant.status}</div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
          <span className="text-xs text-[#B7AEA2]">Account</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#4AB58D]/10 px-2 py-0.5 text-[10px] font-medium text-[#8CE0B4]">Active</span>
        </div>
      </div>

      <button
        className="mt-4 flex items-center gap-2 px-2 text-sm text-[#B7AEA2] hover:text-[#F5F0E6]"
        type="button"
        onClick={handleSignOut}
      >
        <LogOut size={15} />
        Sign out
      </button>
    </aside>
  );

  return content;
}
