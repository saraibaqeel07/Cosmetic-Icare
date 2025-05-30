import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AdminConfig } from 'src/app/config/admin.routes.config';
import { UserData } from 'src/app/interfaces/admin-interface';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AuthService } from 'src/app/services/auth.service';
import * as _ from 'lodash';

@Component({
	selector: 'app-new-user',
	templateUrl: './new-user.component.html',
	styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {
	userDataSub: Subscription;
	userData: UserData = null;
	person = {
		name: '',
		email: '',
		phone: '',
		roleid: null,
		s3clientid: null,
		subscription: null,
	}
	validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	invalidEmail = false;
	roleList = [];
	selectedRole = null;
	isProcessing = false;
	hasError = false;
	errorMessage = null;


	constructor(
		private httpClient: HttpClientService,
		public dialogRef: MatDialogRef<NewUserComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private auth: AuthService
	) { }

	ngOnInit(): void {
		this.httpClient.getRoles().pipe().subscribe((out: any) => {
			console.log(out);
			
			out.forEach((key: any, val: any) => {
				if (key !== 'xml download' && key != 'admin') {
					this.roleList.push({ key: key, val: val })
				}
			})
		})
		console.log(this.person);
		console.log(this.data);
		
		this.person = this.data?.user ?? this.person
	}
	addUser() {
		this.isProcessing = true
		if (this.validEmail.test(this.person.email.toLowerCase())) {
			this.invalidEmail = false;
			if (this.data?.user) {
				this.httpClient.updateUser({
					id: this.data?.user.userid,
					email: this.person.email,
					phone: this.person.phone,
					name: this.person.name,
					subscription: this.person.subscription,
					roles: [{
						role: this.person.roleid ?? AdminConfig.GROUPID,
						GroupId: this.httpClient.retrieveS3GroupId(),
						S3ClientId: this.person.s3clientid,
						
					}]
				}).subscribe(
					out => {
						console.log(out);
					},
					err => {
						this.hasError = true
						this.errorMessage = err.message
						this.isProcessing = false
					},
					() => this.dialogRef.close()
				)
			}
			else {
				this.httpClient.setNewUser({
					email: this.person.email,
					phone: this.person.phone,
					name: this.person.name,
					subscription: this.person.subscription,
				
					roles: [{
						role: this.person.roleid ?? AdminConfig.GROUPID,
						GroupId: this.httpClient.retrieveS3GroupId(),
						S3ClientId: this.person.s3clientid,
		
					}]
				}).subscribe(
					out => {
						console.log(out);
					},
					err => {
						this.hasError = true
						this.errorMessage = err.error.message
						this.isProcessing = false
					},
					() => this.dialogRef.close()
				);
			}
		} else {
			this.invalidEmail = true;
			this.isProcessing = false;
		}
	}

	onChange(role: number) {
		this.selectedRole = Number(role)
		this.person.s3clientid = this.selectedRole ? this.person.s3clientid : null
	}
}
