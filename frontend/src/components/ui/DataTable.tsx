import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DataTableProps {
  columns: Array<{ key: string; label: string; className?: string }>;
  rows: Array<Record<string, ReactNode>>;
  className?: string;
}

export function DataTable({ columns, rows, className }: DataTableProps) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-white/10 bg-[#121210]", className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-[#171613] text-[#B7AEA2]">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={cn("px-4 py-3 font-medium", column.className)}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-white/5 last:border-none hover:bg-[#171613]/80">
                {columns.map((column) => (
                  <td key={`${rowIndex}-${column.key}`} className={cn("px-4 py-3 align-middle text-[#F5F0E6]", column.className)}>
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
