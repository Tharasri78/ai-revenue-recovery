import { transactions } from "@/lib/mock-data/mock-data";

export async function getTransactions() {
  return transactions;
}

export async function getTransactionById(id: string) {
  return transactions.find((transaction) => transaction.id === id) ?? null;
}
