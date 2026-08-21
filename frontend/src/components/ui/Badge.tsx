import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  tone?: "amber" | "green" | "red" | "muted" | "gray";
}

export function Badge({ children, className, tone = "muted" }: BadgeProps) {
  const tones = {
    amber: "bg-[#D7A455]/12 text-[#F3C77F] border border-[#D7A455]/20",
    green: "bg-[#4AB58D]/12 text-[#8CE0B4] border border-[#4AB58D]/20",
    red: "bg-[#C65D57]/12 text-[#F5A39B] border border-[#C65D57]/20",
    muted: "bg-white/5 text-[#D5CFC4] border border-white/10",
    gray: "bg-[#171613] text-[#D5CFC4] border border-white/10",
  };

  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium", tones[tone], className)}>
      {children}
    </span>
  );
}
