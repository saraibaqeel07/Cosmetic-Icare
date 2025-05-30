import { Component, OnInit } from '@angular/core';
import { AdminConfig } from 'src/app/config/admin.routes.config';
import { towingCost, yardInfo } from 'src/app/interfaces/admin-interface';
import { AdminService } from 'src/app/services/admin.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { PopupQuestionComponent } from 'src/app/admin/componets/popup-question/popup-question.component';
import { HttpClientService } from 'src/app/services/http-client.service';
import * as _ from 'lodash';

@Component({
	selector: 'app-towing-cost',
	templateUrl: './towing-cost.component.html',
	styleUrls: ['./towing-cost.component.scss'],
})
export class TowingCostComponent implements OnInit {
	towingConfig: towingCost[] = [];
	maximumDistance = 500; //default value
	preferredYard = 0;
	yardConfig: yardInfo[] = [];
	constructor(
		private adminService: AdminService,
		private notify: NotificationService,
		public dialog: MatDialog,
		private httpClient: HttpClientService
	) {}

	prevDefault: number = 0;
	ngOnInit(): void {
		this.adminService.getTowingCost().subscribe((config) => {
			this.towingConfig = config.map((item) => {
				item.delete = false;
				this.maximumDistance = item.maximumDistance;
				if (item.S3GroupId === AdminConfig.defaultId) delete item.id;
				item.S3GroupId = +this.adminService.retrieveS3GroupId();
				return item;
			});
		});
		this.httpClient.getAdminYards().subscribe((yards) => {
			this.yardConfig = _.orderBy(yards, 'YardName', 'asc');
			this.adminService.getPreferredYard().subscribe((data: any) => {
				this.preferredYard = data;
			});
		});
	}
	confirmDelete(item: towingCost) {
		item.delete = true;
	}
	addItem() {
		this.towingConfig.push({
			S3GroupId: +this.adminService.retrieveS3GroupId(),
			distance: 0,
			priceAdj: { adj: 0, isPercent: false },
			maximumDistance: this.maximumDistance,
			delete: false,
		});
	}
	deleteItem(item: towingCost) {
		item.delete = true;
	}
	onChangePreffered(e) {
		this.adminService
			.setPreferredYard({
				preferredYard: this.preferredYard,
			})
			.subscribe((response: any) => {
				this.notify.success('Saved Successfully');
			});
	}
	saveConfig() {
		let countOver = 0;
	
		this.towingConfig.map((item) => {
			console.log(item)
			item.maximumDistance = this.maximumDistance;
			item.distance = item.distance ? Number(item.distance) : null;
			if (item.distance > this.maximumDistance && item.delete == false) {
				countOver += 1;
			}
			return item;
		});
		if (this.adminService.checkForDuplicates(this.towingConfig, 'distance')) {
			this.notify.error('Error! Distance value should be unique.');
			return false;
		}
		if (countOver) {
			this.popupQuestion();
		} else {
			this.adminService.setTowingCost(this.towingConfig).subscribe(() => {
				this.notify.success('Saved Successfully');
			});
		}
	}

	popupQuestion() {
		const dialogRef = this.dialog.open(PopupQuestionComponent, {
			width: '450px',
			data: {
				title: 'Warning',
				question: `Tow distance has exceeded the maximum allowed milage which is ${this.maximumDistance}. Please change it to an appropriate value.`,
				confirm: 'Ok',
				deny: '',
				isconfirmed: false,
				otherData: {},
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result.isconfirmed) {
				console.log('closed');
			}
		});
	}
}
