import { InjectionToken } from '@angular/core';
import { windowFactory } from '../window/token';

export const LOCAL_STORAGE = new InjectionToken<Storage>(
  'LOCAL_STORAGE token',
  {
    factory: () => windowFactory().localStorage,
  },
);
