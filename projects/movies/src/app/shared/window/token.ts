import { inject, InjectionToken } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * @internal
 */
export const windowFactory = (): Window => {
  const { defaultView } = inject(DOCUMENT);

  if (!defaultView) {
    throw new Error('Window is not available');
  }

  return defaultView;
};


export const WINDOW = new InjectionToken<Window>(
  'WINDOW token',
  {
    factory: windowFactory
  }
);
