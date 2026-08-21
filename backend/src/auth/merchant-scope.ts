export function withMerchantScope<T extends object>(
  where: T,
  merchantId: string,
): T & { merchantId: string } {
  return { ...where, merchantId };
}