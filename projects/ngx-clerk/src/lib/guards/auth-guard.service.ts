import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { ClerkService } from '../services/clerk.service';

export const ClerkAuthGuardService: CanActivateFn | CanActivateChildFn = (
  route,
  state
) => {
  const _router: Router = inject(Router);
  const _clerk: ClerkService = inject(ClerkService);
  return _clerk.user$.pipe(
    take(1),
    map((user) => {
      if (!user?.id) {
        _clerk.redirectToSignIn({
          signInFallbackRedirectUrl: state.url,
        });
        return false;
      }
      if (
        state.url.includes('__clerk_db_jwt') ||
        state.url.includes('__clerk_handshake')
      ) {
        const url = state.url.split('?');
        const searchParams = new URLSearchParams(url[1]);
        searchParams.delete('__clerk_db_jwt');
        searchParams.delete('__clerk_handshake');
        const newUrl =
          url[0] +
          (searchParams.toString() ? '?' + searchParams.toString() : '');
        _router.navigateByUrl(newUrl, { replaceUrl: true });
        return false;
      }
      return true;
    })
  );
};
export const ClerkNoAuthGuardService: CanActivateFn | CanActivateChildFn = (
  route,
  state
) => {
  const _router: Router = inject(Router);
  const _clerk: ClerkService = inject(ClerkService);
  return _clerk.user$.pipe(
    take(1),
    map((user) => {
      if (!user?.id) {
        return true;
      }
      return false;
    })
  );
};
