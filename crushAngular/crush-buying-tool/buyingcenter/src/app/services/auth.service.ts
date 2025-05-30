import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, ReplaySubject, Subject, Subscription } from 'rxjs';
import { catchError, delay, take, tap } from 'rxjs/operators';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
		// set as replay subject to fix auth guards.
		private _loggedIn$: ReplaySubject<boolean> = new ReplaySubject(1);

		constructor(private httpClientService: HttpClientService) {
			this.setUser();
		 }
		checkLoggedIn() {
			return this._loggedIn$.asObservable();
		}

		getS3GroupId() {
			return localStorage.getItem('selectedGroup');
		}
		setS3GroupId(roles) {
			const ids: string[] = [];
			const currentId = localStorage.getItem('selectedGroup');
			roles.map((role) => {
				if(role.GroupId > 0) ids.push(role.GroupId);
			});
			if(!currentId || !ids.includes(currentId)) {
				localStorage.setItem('selectedGroup', ids[0]);
			}
		}
		setUser() {
			this.httpClientService.getUser().pipe(
				catchError(err => {
					this._loggedIn$.next(false);
					return of(null);
				}
				),
				take(1)
				).subscribe((user: any) => {
				localStorage.setItem('user', JSON.stringify(user));
				localStorage.setItem('roles', JSON.stringify(user.roles));
				this.setS3GroupId(user.roles);
				this._loggedIn$.next(true);
			});
		}
		getUser() {
			return JSON.parse(localStorage.getItem('user'));
		}
		getRoles() {
			return JSON.parse(localStorage.getItem('roles'));
		}
		logout() {
			this.httpClientService.logout();
		}
}
