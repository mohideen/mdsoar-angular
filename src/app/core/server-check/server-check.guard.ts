import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
  NavigationStart
} from '@angular/router';

import { Observable } from 'rxjs';
import { take, map, filter } from 'rxjs/operators';

import { RootDataService } from '../data/root-data.service';
import { getPageInternalServerErrorRoute } from '../../app-routing-paths';

@Injectable({
  providedIn: 'root'
})
/**
 * A guard that checks if root api endpoint is reachable.
 * If not redirect to 500 error page
 */
export class ServerCheckGuard implements CanActivateChild {
  constructor(private router: Router, private rootDataService: RootDataService) {
  }

  /**
   * True when root api endpoint is reachable.
   */
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {

    return this.rootDataService.checkServerAvailability().pipe(
      take(1),
      map((isAvailable: boolean) => {
        if (!isAvailable) {
          return this.router.parseUrl(getPageInternalServerErrorRoute());
        } else {
          return true;
        }
      })
    );
  }

  /**
   * Listen to all router events. Every time a new navigation starts, invalidate the cache
   * for the root endpoint. That way we retrieve it once per routing operation to ensure the
   * backend is not down. But if the guard is called multiple times during the same routing
   * operation, the cached version is used.
   */
  listenForRouteChanges(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart),
    ).subscribe(() => {
      this.rootDataService.invalidateRootCache();
    });
  }
}
