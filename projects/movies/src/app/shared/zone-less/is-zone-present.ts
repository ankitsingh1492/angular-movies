/**
 * @description
 * returns true if zone.js polyfills are imported, false otherwise
 */
import { inject } from '@angular/core';
import { WINDOW } from '../tokens/tokens';

export function isZonePresent(): boolean {
  return !!(inject(WINDOW) as any).Zone;
}
