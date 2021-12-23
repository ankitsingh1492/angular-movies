import { Inject, Injectable } from '@angular/core';
import { exhaustMap, map, Observable, take } from 'rxjs';
import { Tmdb2Service } from '../api/tmdb2.service';
import { AuthStateService, isAuthenticationInProgress } from './auth.state';
import { LocalStorageService } from '../../shared/local-storage/local-storage.service';
import { WINDOW } from '../../shared/window/token';

@Injectable({
  providedIn: 'root'
})
export class TmdbAuthEffects {
  constructor(private authState: AuthStateService,
              private tmdb: Tmdb2Service,
              private localStorage: LocalStorageService,
              @Inject(WINDOW) private window: Window,
  ) {
    this.restoreLogin();
  }

  restoreLogin(): void {
    if (isAuthenticationInProgress(this.authState.get())) {
      this.createAccessToken$().subscribe((accessTokenResult) => {
        // delete in local storage
        this.localStorage.removeItem('requestToken');
        // store in local storage for the next page load
        this.localStorage.setItem(
          'accessToken',
          accessTokenResult.accessToken
        );
        this.localStorage.setItem('accountId', accessTokenResult.accountId);
        this.authState.set({
          ...this.authState.get(),
          ...accessTokenResult
        });
      });
    }
  }

  createAccessToken$(): Observable<{ accessToken: string; accountId: string }> {
    return this.authState.requestToken$.pipe(
      take(1),
      exhaustMap((requestToken) => this.tmdb.createAccessToken(requestToken || '')),
      map(({ access_token, account_id }) => ({
        accessToken: access_token,
        accountId: account_id
      }))
    );
  }

  approveRequestToken(): void {
    this.tmdb
      .createRequestToken(this.authState.redirectUrl)
      .subscribe((res) => {
        // store in local storage for the next page load
        this.localStorage.setItem('requestToken', res.request_token);
        this.window.location.replace(
          `https://www.themoviedb.org/auth/access?request_token=${res.request_token}`
        );
      });
  }

  signOut() {
    const accessToken = this.authState.get().accessToken;

    // store in local storage for the next page load
    this.localStorage.removeItem('accessToken');
    this.localStorage.removeItem('accountId');
    this.localStorage.removeItem('requestToken');
    this.authState.set({
      accessToken: null,
      accountId: null,
      requestToken: null
    });
    if (accessToken) {
      this.tmdb.deleteAccessToken(accessToken).subscribe();
    }
  }
}
