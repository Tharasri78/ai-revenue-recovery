"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { Card } from "@/components/ui/Card";
import {
  createTransaction,
  getTransactions,
} from "@/services/transactions";
import type {
  ApiTransaction,
  PaginatedResponse,
} from "@/types/backend";
import { ApiError } from "@/lib/api";

export default function TransactionsPage() {
  const router = useRouter();

  const [result, setResult] =
    useState<PaginatedResponse<ApiTransaction> | null>(null);

  const [status, setStatus] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    externalReference: "",
    amount: "",
    currency: "INR",
    status: "FAILED",
    paymentMethod: "UPI",
    customerEmail: "",
  });

  const loadTransactions = () => {
  setError("");

  getTransactions({
    paymentStatus: status,
    search: search || undefined,
  })
    .then(setResult)
    .catch((cause) => {
      if (cause instanceof ApiError && cause.status === 401) {
        router.replace("/login");
        return;
      }

      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to load transactions.",
      );
    });
};

  useEffect(() => {
    loadTransactions();
  }, [router, search, status]);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();

    setError("");

    if (!form.externalReference.trim()) {
      setError("External reference is required.");
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    if (
      form.customerEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail)
    ) {
      setError("Enter a valid customer email.");
      return;
    }

    try {
      setCreating(true);

      await createTransaction({
        externalReference: form.externalReference.trim(),
        amount: Number(form.amount),
        currency: form.currency,
        paymentStatus: form.status,
        paymentMethod: form.paymentMethod,
        customerEmail: form.customerEmail.trim() || undefined,
      });

      setForm({
        externalReference: "",
        amount: "",
        currency: "INR",
        status: "FAILED",
        paymentMethod: "UPI",
        customerEmail: "",
      });

      setShowCreate(false);

      loadTransactions();
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) {
        router.replace("/login");
        return;
      }

      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to create transaction.",
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#B7AEA2]">
              AI REVENUE RECOVERY
            </p>

            <h1 className="mt-1 text-3xl font-semibold text-[#F5F0E6]">
              Transactions
            </h1>
          </div>

          <button
            type="button"
            onClick={() => {
              setError("");
              setShowCreate(true);
            }}
            className="rounded-md bg-[#E4AD52] px-5 py-3 text-sm font-medium text-black transition hover:bg-[#efbb65]"
          >
            + Create transaction
          </button>
        </div>

        {/* Demo metrics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[
            { label: "All", value: "1,248" },
            { label: "Successful", value: "982" },
            { label: "Failed", value: "121" },
            { label: "Abandoned", value: "94" },
            { label: "Recovered", value: "51" },
          ].map((metric) => (
            <Card key={metric.label} className="p-4">
              <p className="text-sm text-[#B7AEA2]">{metric.label}</p>
              <p className="mt-2 text-2xl font-semibold text-[#F5F0E6]">
                {metric.value}
              </p>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-wrap gap-3">
            {[
              "All",
              "SUCCESSFUL",
              "FAILED",
              "ABANDONED",
              "RECOVERY_ATTEMPTED",
              "RECOVERED",
            ].map((filter) => (
              <button
                type="button"
                key={filter}
                onClick={() =>
                  setStatus(filter === "All" ? undefined : filter)
                }
                className="rounded-md border border-white/10 bg-[#171613] px-3 py-2 text-xs uppercase tracking-[0.12em] text-[#B7AEA2] hover:border-[#E4AD52]/50"
              >
                {filter}
              </button>
            ))}
          </div>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search transaction"
            aria-label="Search transactions"
            className="mt-3 w-full rounded-md border border-white/10 bg-[#121210] px-3 py-2 text-sm text-[#F5F0E6] outline-none placeholder:text-[#7E786F] md:max-w-xs"
          />
        </Card>

        {/* Error */}
        {error ? (
          <div className="rounded-md border border-[#E26B5B]/30 bg-[#E26B5B]/10 px-3 py-2 text-sm text-[#F7B0A5]">
            {error}
          </div>
        ) : null}

        {/* Loading */}
        {!result && !error ? (
          <Card className="p-5 text-sm text-[#B7AEA2]">
            Loading transactions...
          </Card>
        ) : null}

        {/* Empty */}
        {result && result.items.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-[#F5F0E6]">No transactions found.</p>

            <p className="mt-2 text-sm text-[#B7AEA2]">
              Create your first transaction to test the revenue recovery flow.
            </p>

            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="mt-4 rounded-md bg-[#E4AD52] px-5 py-2.5 text-sm font-medium text-black"
            >
              Create transaction
            </button>
          </Card>
        ) : null}

        {/* Table */}
        {result && result.items.length > 0 ? (
          <TransactionTable items={result.items} />
        ) : null}

        {/* Create Modal */}
        {showCreate ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-lg rounded-xl border border-white/10 bg-[#121210] p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#B7AEA2]">
                    TRANSACTION
                  </p>

                  <h2 className="mt-1 text-2xl font-semibold text-[#F5F0E6]">
                    Create transaction
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="text-xl text-[#B7AEA2] hover:text-white"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCreate} className="mt-6 space-y-4">
                {/* External reference */}
                <div>
                  <label className="mb-1 block text-sm text-[#B7AEA2]">
                    External reference
                  </label>

                  <input
                    value={form.externalReference}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        externalReference: e.target.value,
                      })
                    }
                    placeholder="TXN-001"
                    className="w-full rounded-md border border-white/10 bg-[#171613] px-3 py-3 text-sm text-[#F5F0E6] outline-none"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="mb-1 block text-sm text-[#B7AEA2]">
                    Amount
                  </label>

                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.amount}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        amount: e.target.value,
                      })
                    }
                    placeholder="5000"
                    className="w-full rounded-md border border-white/10 bg-[#171613] px-3 py-3 text-sm text-[#F5F0E6] outline-none"
                  />
                </div>

                {/* Currency + status */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm text-[#B7AEA2]">
                      Currency
                    </label>

                    <select
                      value={form.currency}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          currency: e.target.value,
                        })
                      }
                      className="w-full rounded-md border border-white/10 bg-[#171613] px-3 py-3 text-sm text-[#F5F0E6] outline-none"
                    >
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm text-[#B7AEA2]">
                      Status
                    </label>

                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          status: e.target.value,
                        })
                      }
                      className="w-full rounded-md border border-white/10 bg-[#171613] px-3 py-3 text-sm text-[#F5F0E6] outline-none"
                    >
                      <option value="FAILED">FAILED</option>
                      <option value="ABANDONED">ABANDONED</option>
                      <option value="SUCCESSFUL">SUCCESSFUL</option>
                    </select>
                  </div>
                </div>

                {/* Payment method */}
                <div>
                  <label className="mb-1 block text-sm text-[#B7AEA2]">
                    Payment method
                  </label>

                  <select
                    value={form.paymentMethod}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        paymentMethod: e.target.value,
                      })
                    }
                    className="w-full rounded-md border border-white/10 bg-[#171613] px-3 py-3 text-sm text-[#F5F0E6] outline-none"
                  >
                    <option value="UPI">UPI</option>
                    <option value="CARD">CARD</option>
                    <option value="NET_BANKING">NET BANKING</option>
                    <option value="WALLET">WALLET</option>
                    <option value="BANK_TRANSFER">BANK TRANSFER</option>
                  </select>
                </div>

                {/* Customer email */}
                <div>
                  <label className="mb-1 block text-sm text-[#B7AEA2]">
                    Customer email
                  </label>

                  <input
                    type="email"
                    value={form.customerEmail}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        customerEmail: e.target.value,
                      })
                    }
                    placeholder="customer@example.com"
                    className="w-full rounded-md border border-white/10 bg-[#171613] px-3 py-3 text-sm text-[#F5F0E6] outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="rounded-md border border-white/10 px-4 py-2.5 text-sm text-[#B7AEA2]"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={creating}
                    className="rounded-md bg-[#E4AD52] px-5 py-2.5 text-sm font-medium text-black disabled:opacity-50"
                  >
                    {creating ? "Creating..." : "Create transaction"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}