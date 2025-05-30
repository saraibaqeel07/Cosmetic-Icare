import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
	public val: string = '';
	public val2: string = '';
	public navLinks: any = [
		{
			label: 'Quote Configuration',
			link: './quote',
			children: [
				{
					label: 'Steel',
					link: '/steel-price',
					icon: 'request_quote',
					isShow: true,
				},
				{
					label: 'Vehicle Class',
					link: '/vehicle-class',
					icon: 'directions_car',
					isShow: true,
				},
				{
					label: 'Questions',
					link: '/questions',
					icon: 'quiz',
					isShow: true,
				},
				{
					label: 'Towing',
					link: '/towing',
					icon: 'rv_hookup',
					isShow: true,
				},
				{
					label: 'Popular',
					link: '/popular',
					icon: 'verified',
					isShow: true,
				},
				{
					label: 'Unpopular',
					link: '/unpopular',
					icon: 'thumb_down',
					isShow: true,
				},
				{
					label: 'Year',
					link: '/year',
					icon: 'date_range',
					isShow: true,
				},
				// {
				// 	label: 'Recall',
				// 	link: '/recall',
				// 	icon: 'find_replace',
				// 	isShow: this.isSuperAdmin(),
				// },
				// {
				// 	label: 'Proof of Ownership',
				// 	link: '/proof-of-ownership',
				// 	icon: 'copyright',
				// 	isShow: this.isSuperAdmin(),
				// },
			],
		},
		{
			label: 'User Manage',
			link: './user',
			children: [],
		},
		{
			label: 'Yards',
			link: './yard',
			children: [],
		},
		{
			label: 'Subscription',
			link: './subscription',
			children: [],
		},
	];

	constructor(private auth: AuthService) {}

	isSuperAdmin() {
		return this.auth.getUser().admin;
	}

	ngOnInit(): void {
		const x = this.auth.getRoles();
	}
}
