/**
 * @description
 * returns true if zone.js polyfills are imported, false otherwise
 */

export function isZonePresent(window: Window): boolean {
  return !!(window as any).Zone;
}
