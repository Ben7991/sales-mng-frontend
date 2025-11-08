export function calculateOrderTotal(orderItems: { amount: number }[]): number {
  return orderItems?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
}

export function calculatePaidPercent(amountPaid: number, orderItems: { amount: number }[]): number {
  const total = calculateOrderTotal(orderItems);
  if (total === 0) return 0;
  return Math.min(100, Math.round((amountPaid / total) * 100));
}

export function calculateBalance(amountPaid: number, orderItems: { amount: number }[]): number {
  const total = calculateOrderTotal(orderItems);
  return Math.max(0, total - amountPaid);
}
