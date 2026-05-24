/** Iconify icon id: `prefix:icon-name` (e.g. mdi:home, lucide:settings). */
export const ICONIFY_ICON_ID =
  /^[a-z0-9][a-z0-9-]*:[a-z0-9][a-z0-9._-]*$/i;

export function isIconifyIconId(value: string): boolean {
  return ICONIFY_ICON_ID.test(value.trim());
}
