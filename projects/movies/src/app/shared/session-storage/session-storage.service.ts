import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE } from './token';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor(
    @Inject(SESSION_STORAGE) private windowSessionStorage: Storage
  ) {

  }

  save(key: string, data: string): void {
    this.windowSessionStorage.setItem(key, data);
  }

  read(key: string): string | null {
    return this.windowSessionStorage.getItem(key);
  }

  remove(key: string) {
    this.windowSessionStorage.removeItem(key);
  }

  clear(): void {
    this.windowSessionStorage.clear();
  }
}
