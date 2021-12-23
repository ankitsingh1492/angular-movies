import {inject, InjectionToken} from '@angular/core';
import { DOCUMENT } from '@angular/common';


export const windowFactory = () => {
  const { defaultView } = inject(DOCUMENT);

  if (!defaultView) {
    throw new Error('Window is not available');
  }

  return defaultView;
}

export const WINDOW = new InjectionToken<Window>(
  'WINDOW token',
  {
    factory: windowFactory
  },
);
