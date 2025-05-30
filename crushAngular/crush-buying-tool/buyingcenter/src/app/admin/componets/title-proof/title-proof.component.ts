import { Component, OnInit } from '@angular/core';
import { AdminConfig } from 'src/app/config/admin.routes.config';
import { proofDocs } from 'src/app/interfaces/admin-interface';
import { AdminService } from 'src/app/services/admin.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
	selector: 'app-title-proof',
	templateUrl: './title-proof.component.html',
	styleUrls: ['./title-proof.component.scss'],
})
export class TitleProofComponent implements OnInit {
	PD: proofDocs[] = [];
	constructor(
		private adminService: AdminService,
		private notify: NotificationService
	) {}

	ngOnInit(): void {
		this.adminService.getProofDocs().subscribe((config) => {
			this.PD = config.map((item) => {
				item.delete = false;
				if (item.S3GroupId === AdminConfig.defaultId) delete item.id;
				item.S3GroupId = +this.adminService.retrieveS3GroupId();
				return item;
			});
		});
	}
	saveConfig() {
		this.adminService
			.setProofDocs(this.PD)
			.subscribe(() => this.notify.success('Saved Successfully'));
	}
}
