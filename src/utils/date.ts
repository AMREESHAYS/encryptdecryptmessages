// Utility for formatting dates
export function formatDate(ts: number): string {
  return new Date(ts).toLocaleString();
}
