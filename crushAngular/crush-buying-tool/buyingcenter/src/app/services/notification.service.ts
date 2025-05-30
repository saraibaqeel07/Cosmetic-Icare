import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

//import matSnackBar
//https://material.angular.io/components/snack-bar/examples
// set to bottom right
// use dialogComponents/notificationComponenet. pass data with as class maybe for red/yellow/green
//incoming interceptor


export enum StyleType {
	ERROR = 'error',
	WARN = 'warn',
	SUCCESS = 'success'
}

export interface INotification {
	message: string;
	action?: string;
	delaySeconds: number;
	type: StyleType;
}

//old httpclient
@Injectable({
	providedIn: 'root'
})
export class NotificationService {

	static DURATION = 5;
	private _notification$ = new Subject<INotification>();

	constructor() {}

	get notification$(): Subject<INotification> {
		return this._notification$;
	}

	success(message: string, duration: number = NotificationService.DURATION, styleType = StyleType.SUCCESS) {
		this.message(message,'Success',duration,styleType);
	}
	error(message: string, duration: number = NotificationService.DURATION, styleType = StyleType.ERROR) {
		this.message(message,'Error',duration,styleType);
	}
	warn(message: string, duration: number = NotificationService.DURATION, styleType = StyleType.WARN) {
		this.message(message,'Warn',duration,styleType);
	}
	message(message: string, action: string, duration: number, styleType: StyleType) {
		this._notification$.next({
				message: message,
				action: '',
				delaySeconds: duration,
				type: styleType
		});
	}


}
