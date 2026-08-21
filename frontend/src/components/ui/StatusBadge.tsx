import { Badge } from "@/components/ui/Badge";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const tones: Record<string, "amber" | "green" | "red" | "muted" | "gray"> = {
    Successful: "green",
    Recovered: "green",
    Failed: "red",
    Abandoned: "muted",
    "Recovery attempted": "amber",
    Approved: "green",
    Pending: "amber",
    Blocked: "red",
    "Needs review": "gray",
    High: "amber",
    Medium: "muted",
    Low: "green",
    "Recommended": "amber",
    "Awaiting approval": "gray",
    Completed: "green",
    Executed: "green",
  };

  return <Badge tone={tones[status] ?? "muted"}>{status}</Badge>;
}
