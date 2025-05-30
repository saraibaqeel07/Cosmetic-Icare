import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
	providedIn: 'root'
})
export class AuthRolesGuard implements CanActivate {
	constructor(private auth: AuthService) {

	}
	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

		return this.auth.checkLoggedIn().pipe(switchMap((val, i) => {
			if (!route.data.roles) console.warn('roles must be in data route for this guard');
			const roles = this.auth.getRoles().map((role) => {
				return role.role;
			});
			if (!val) return of(false);
			const roleCheck = route.data.roles.some((role) => { return roles.indexOf(role) !== -1 });
			if (roleCheck) return of(true);
			return of(false)
		}), catchError(err => of(false)));
	}

}
