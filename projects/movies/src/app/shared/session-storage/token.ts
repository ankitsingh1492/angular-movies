import { InjectionToken } from '@angular/core';
import { windowFactory } from '../window/token';

export const SESSION_STORAGE = new InjectionToken<Storage>(
  'SESSION_STORAGE token',
  {
    factory: () => windowFactory().sessionStorage
  }
);
