import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import {
	MatSnackBar,
	MatSnackBarHorizontalPosition,
	MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import {
	NotificationService,
	StyleType,
} from './services/notification.service';
import { promise } from 'protractor';
import { resolve } from 'dns';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	title = 'buyingcenter';
	userloaded = false;
	constructor(
		private auth: AuthService,
		private _notification: MatSnackBar,
		private notificationService: NotificationService
	) {
		this.auth.checkLoggedIn().subscribe((val: boolean) => {
			this.userloaded = val;
		});
	}
	ngOnInit() {
		this.notificationService.notification$.subscribe({
			next: (notify) =>
				this.notificationMessage(
					notify.message,
					notify.action,
					notify.delaySeconds,
					notify.type
				),
		});
	}

	public notificationMessage(
		message: string,
		action: string,
		duration: number,
		type: StyleType
	) {
		this._notification.open(message, action, {
			duration: duration * 1000,
			panelClass: [`snackbar-notification-style-${type}`], //style notification in styles.scss
			horizontalPosition: 'start',
			verticalPosition: 'bottom',
		});
	}
}
