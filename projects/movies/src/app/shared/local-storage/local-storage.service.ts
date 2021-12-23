import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE } from './token';

@Injectable({
  providedIn: 'root'
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
