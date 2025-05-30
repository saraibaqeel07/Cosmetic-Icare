import { Component, OnInit } from '@angular/core';
import { AdminConfig } from 'src/app/config/admin.routes.config';
import { recallCosts, yearAdjCost } from 'src/app/interfaces/admin-interface';
import { AdminService } from 'src/app/services/admin.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
	selector: 'app-recall-adjustment',
	templateUrl: './recall-adjustment.component.html',
	styleUrls: ['./recall-adjustment.component.scss'],
})
export class RecallAdjustmentComponent implements OnInit {
	recallConfig: recallCosts[] = [];
	constructor(
		private adminService: AdminService,
		private notify: NotificationService
	) {}

	ngOnInit(): void {
		this.adminService.getRecall().subscribe((config) => {
			this.recallConfig = config.map((y) => {
				if (y.S3GroupId === AdminConfig.defaultId) delete y.id;
				y.S3GroupId = +this.adminService.retrieveS3GroupId();
				y.delete = false;
				return y;
			});
			console.log(this.recallConfig);
		});
	}
	confirmDelete(config: recallCosts) {
		config.delete = true;
	}
	saveConfig() {
		this.adminService
			.setRecall(this.recallConfig)
			.subscribe(() => this.notify.success('Saved Successfully'));
	}
}
