import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
	navbarState: boolean = false;
	roles = [];
	user = '';
	homeUrl = environment.baseAPI;
	ifStaging = environment.staging;
	constructor(private auth: AuthService, private router: Router) {}


	ngOnInit(): void {
		this.auth.checkLoggedIn().subscribe((val) => {
			this.roles = this.auth.getRoles().map((item) => item.role);
			this.user = this.auth.getUser().username;
		});
	}
	toggleNavbar() {
		this.navbarState = !this.navbarState;
	}
	logout() {
		this.auth.logout();
	}
	navigateToPage() {
		window.location.href = '/ticket';

		//this.router.navigate(['/ticket'], { skipLocationChange: true });
	  }
}
