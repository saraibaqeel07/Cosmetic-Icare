import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup;
	formSubmitted: boolean = false;

  constructor(private formBuilder: FormBuilder, private authservice: AuthService) { }

  ngOnInit(): void {
			this.loginForm = this.formBuilder.group({
				email: [null, [Validators.required]],
				password: [null, Validators.required]
			});
		}
		onSubmit() {
			// if(this.loginForm.valid) {
			// 	this.formSubmitted = true;
			// 	this.authservice.login(this.loginForm.get('email').value, this.loginForm.get('password').value)
			// } else {
			// 	this.formSubmitted = false;
			// }


		}

}
