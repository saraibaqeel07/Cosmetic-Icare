import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpHeaderResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor() {}

	intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		request = request.clone({
			withCredentials: true,
		});

		return next.handle(request).pipe(
			catchError((error: HttpHeaderResponse) => {
				console.log(error);
				if (error.status === 401) {
					console.log('401');
					location.href = `${environment.baseAPI}/user/login`;
				}

				return throwError(error);
			})
		);
	}
}
/*const errorMessage = (error && error.error && error.error.message) ? error.error.message : null;
switch (error.status) {
	case 0:
	this.notificationService.showError((errorMessage) ? "" :ResourceConfig.StatusUnreachable.desc, (errorMessage) ?errorMessage:ResourceConfig.StatusUnreachable.title);
					break
	case 400:
	this.notificationService.showError((errorMessage) ? "" :ResourceConfig.Status400.desc, (errorMessage) ? errorMessage :ResourceConfig.Status400.title);
					break;
	case 401:
			this.storageService.error401Called = true;
			setTimeout(() => {
					this.storageService.error401Called = false;
			}, 3000);
	this.notificationService.showError((errorMessage) ? "" :ResourceConfig.Status401.desc, (errorMessage) ? errorMessage :ResourceConfig.Status401.title);
					break;
	case 440:
	this.notificationService.showError((errorMessage) ? "" :ResourceConfig.Status440.desc, (errorMessage) ? errorMessage :ResourceConfig.Status440.title);
					break;
	case 500:
	this.notificationService.showError((errorMessage) ? "" :ResourceConfig.Status500.desc, (errorMessage) ? errorMessage :ResourceConfig.Status500.title);
					break;
	case 503:
	this.notificationService.showError((errorMessage) ? "" :ResourceConfig.Status503.desc, (errorMessage) ? errorMessage :ResourceConfig.Status503.title);
					break;
	default:
					this.notificationService.showError('Error', 'Something went wrong')
					break;

	return throwError(request?)
} */
