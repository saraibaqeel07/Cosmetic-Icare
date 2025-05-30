import { Component, OnInit } from '@angular/core';
import { AdminConfig } from 'src/app/config/admin.routes.config';
import { customQuestionsCosts } from 'src/app/interfaces/admin-interface';
import { question } from 'src/app/interfaces/call-center.interface';
import { AdminService } from 'src/app/services/admin.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
	selector: 'app-custom-questions-admin',
	templateUrl: './custom-questions-admin.component.html',
	styleUrls: ['./custom-questions-admin.component.scss'],
})
export class CustomQuestionsAdminComponent implements OnInit {
	questionConfig: customQuestionsCosts[] = [];
	questionsMandatory = false;
	constructor(
		private adminService: AdminService,
		private notify: NotificationService
	) {}

	ngOnInit(): void {
		this.adminService.getCustomQuestions().subscribe((config) => {
			this.questionConfig = config.map((item) => {
				return this.configItem(item);
			});
		});

		this.adminService.getQuestionsMandatory().subscribe((data: any) => {
			this.questionsMandatory = data;
		});
	}
	questionsMandatoryEvent(value) {
		this.adminService
			.setQuestionsMandatory({
				questionsMandatory: value,
			})
			.subscribe((response: any) => {
				this.notify.success('Saved Successfully');
			});
	}
	addItem() {
		this.questionConfig.push({
			S3GroupId: +this.adminService.retrieveS3GroupId(),
			questionText: 'New',
			priceAdj: { adj: 0, isPercent: false },
			delete: false,
		});
	}
	confirmDelete(item: customQuestionsCosts) {
		item.delete = true;
	}
	saveConfig() {
		if (
			this.adminService.checkForDuplicates(this.questionConfig, 'questionText')
		) {
			this.notify.error('Error! Question should be unique.');
			return false;
		}
		this.adminService
			.setCustomQuestions(this.questionConfig)
			.subscribe((response) => {
				this.notify.success('Saved Successfuly');
				this.questionConfig = response.map((item) => {
					return this.configItem(item);
				});
			});
	}
	configItem(item: any) {
		item.delete = false;
		//legacy code to match API
		if (item.S3GroupId === AdminConfig.defaultId) delete item.id;
		item.S3GroupId = +this.adminService.retrieveS3GroupId();
		return item;
	}
}
