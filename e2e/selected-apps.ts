/**
 * E2E_APPS limits Playwright to a comma-separated list of applications
 * (e.g. "application-1,application-3") so CI can test one app in isolation.
 * When unset, every application is tested.
 */
const selected = (process.env.E2E_APPS ?? "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

export function isAppSelected(id: string): boolean {
  return selected.length === 0 || selected.includes(id);
}
