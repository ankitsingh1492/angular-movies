import { PLATFORM_ID, StaticProvider } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { WINDOW } from './token';

function createWindow(protocol: string = 'https'): Window {

  const win = {} as any;
  win.Object = Object;
  win.Math = Math;
  win.location = { protocol };

  win.localStorage = {
    getItem: (): undefined => undefined,
    setItem: () => void 0,
    clear: () => void 0,
    removeItem: () => void 0
  };

  return win as Window;

}

export const BROWSER_WINDOW_PROVIDERS_SSR: Array<StaticProvider> = [
  {
    provide: WINDOW,
    useFactory: (platfromId: string): Window => {
      if (!isPlatformServer(platfromId)) {
        throw new Error('Do not import SSR related code into non SSR code.');
      }
      return createWindow('/');
    },
    deps: [PLATFORM_ID]
  }
];
