import Link from "next/link";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency } from "@/lib/utils";
import type { Transaction } from "@/lib/mock-data/types";

interface TransactionTableProps {
  items: Transaction[];
}

export function TransactionTable({ items }: TransactionTableProps) {
  const rows = items.map((item) => ({
    id: (
      <Link href={`/transactions/${item.id}`} className="font-medium text-[#F5F0E6] hover:text-[#D7A455]">
        {item.id}
      </Link>
    ),
    customer: item.customerName,
    amount: formatCurrency(item.amount),
    method: item.paymentMethod,
    status: <StatusBadge status={item.status} />,
    reason: item.failureReason,
    recovery: item.recoveryStatus,
    date: new Date(item.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
  }));

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[760px]">
    <DataTable
      columns={[
        { key: "id", label: "Transaction ID" },
        { key: "customer", label: "Customer" },
        { key: "amount", label: "Amount" },
        { key: "method", label: "Payment method" },
        { key: "status", label: "Status" },
        { key: "reason", label: "Failure reason" },
        { key: "recovery", label: "Recovery status" },
        { key: "date", label: "Date" },
      ]}
      rows={rows}
    />
      </div>
    </div>
  );
}
