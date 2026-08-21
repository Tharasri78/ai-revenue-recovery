export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactCurrency(amount: number): string {
  const lakhs = amount / 100000;

  if (lakhs >= 1) {
    return `₹${lakhs.toFixed(lakhs >= 10 ? 0 : 1)}L`;
  }

  return formatCurrency(amount);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
