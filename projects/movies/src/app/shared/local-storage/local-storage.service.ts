import { Inject, Injectable, InjectionToken } from '@angular/core';
import { windowFactory } from '../tokens/tokens';

export const LOCAL_STORAGE = new InjectionToken<Storage>(
  'LOCAL_STORAGE token',
  {
    factory: () => windowFactory().localStorage,
  },
);

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {

  constructor(
    @Inject(LOCAL_STORAGE) private windowLocalStorage: Storage
  ) {

  }
  setItem(key: string, data: string): void {
    this.windowLocalStorage.setItem(key, data);
  }

  getItem(key: string): string | null {
    return this.windowLocalStorage.getItem(key);
  }

  removeItem(key: string) {
    this.windowLocalStorage.removeItem(key);
  }

  clear(): void {
    this.windowLocalStorage.clear();
  }
}
