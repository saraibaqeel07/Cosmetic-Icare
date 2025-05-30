import { Component, OnInit } from '@angular/core';
import { AdminConfig } from 'src/app/config/admin.routes.config';
import { yearAdjCost } from 'src/app/interfaces/admin-interface';
import { AdminService } from 'src/app/services/admin.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
	selector: 'app-year-adjustment',
	templateUrl: './year-adjustment.component.html',
	styleUrls: ['./year-adjustment.component.scss'],
})
export class YearAdjustmentComponent implements OnInit {
	yearConfig: yearAdjCost[] = [];
	constructor(
		private adminService: AdminService,
		private notify: NotificationService
	) {}

	ngOnInit(): void {
		this.adminService.getYearAdjustment().subscribe((config) => {
			this.yearConfig = config.map((y) => {
				if (y.S3GroupId === AdminConfig.defaultId) delete y.id;
				y.S3GroupId = +this.adminService.retrieveS3GroupId();
				y.delete = false;
				return y;
			});
		});
	}
	confirmDelete(config: yearAdjCost) {
		config.delete = true;
	}
	addItem() {
		this.yearConfig.push({
			S3GroupId: +this.adminService.retrieveS3GroupId(),
			year: null,
			priceAdj: { adj: null, isPercent: false },
			delete: false,
		});
	}
	saveConfig() {
		this.yearConfig.map((item) => {
			item.year = item.year ? Number(item.year) : null;
			return item;
		});
		if (this.adminService.checkForDuplicates(this.yearConfig, 'year')) {
			this.notify.error('Error! Years offset should be unique.');
			return false;
		}
		console.log(this.yearConfig);
		this.adminService
			.setYearAdjustment(this.yearConfig)
			.subscribe(() => this.notify.success('Saved Successfully'));
	}
}
