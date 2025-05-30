import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { AdminConfig } from 'src/app/config/admin.routes.config';
import { steelPrice } from 'src/app/interfaces/admin-interface';
import { AdminService } from 'src/app/services/admin.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { PopupQuestionComponent } from 'src/app/admin/componets/popup-question/popup-question.component';
import * as moment from 'moment';
import { HttpClientService } from 'src/app/services/http-client.service';
import { ResourceConfig } from 'src/app/config/routes.config';

@Component({
	selector: 'app-steel-price',
	templateUrl: './steel-price.component.html',
	styleUrls: ['./steel-price.component.scss'],
})
export class SteelPriceComponent implements OnInit {
	alternateAlgorithm = false;
	steelConfig: steelPrice[] = [];
	biddingSetup = '';
	isSinglePrice = false;
	negotiatedPriceLimit = null;
	negotiatedPriceEnabled = false;
	baseApi = ResourceConfig.baseAPI;
	constructor(
		private adminService: AdminService,
		private notify: NotificationService,
		public dialog: MatDialog
	) {}

	ngOnInit(): void {
		this.adminService.getSteelConfig().subscribe((config: steelPrice[]) => {
			config.map((item) => {
				return this.configItem(item);
			});

			console.log('config', config);

			this.steelConfig = config;
			this.confirmSteels = this.steelConfig.filter((item) => {
				return !item.delete;
			}).length;
		});

		this.adminService.getAlternateAlgorithm().subscribe((data: any) => {
			this.alternateAlgorithm = data;
		});
	}
	downloadPriceHistory() {
		window.open(
			`${this.baseApi}${
				AdminConfig.downloadPriceHistory
			}${+this.adminService.retrieveS3GroupId()}/steelPrice`,
			'_self'
		);
	}
	confirmSteels = 0;
	confirmDelete(steel: steelPrice) {
		steel.delete = true;
		this.confirmSteels = this.steelConfig.filter((item) => {
			return !item.delete;
		}).length;
	}
	addSteel() {
		this.steelConfig.push({
			S3GroupId: +this.adminService.retrieveS3GroupId(),
			steelPriceTon: 0,
			steelPricePound: 0,
			delete: false,
			name: 'New',
			isSinglePrice: false,
			biddingSetup: null,
			negotiatedPriceLimit: null,
			NegotiatedPriceEnabled: false,
		});
		if (this.steelConfig.length > 1) {
			this.resetConfig();
		}
		this.confirmSteels = this.steelConfig.filter((item) => {
			return !item.delete;
		}).length;
	}
	biddingSetupEvent(value) {
		console.log('value', value);
		this.biddingSetup = value;
	}
	saveConfig() {
		let count = 0;
		this.steelConfig.map((item) => {
			if (!item.delete) {
				count += 1;
			}
			console.log('item', this.biddingSetup);
			item.biddingSetup = this.biddingSetup;
			item.isSinglePrice = this.isSinglePrice;
			item.negotiatedPriceLimit = this.negotiatedPriceLimit
				? Number(this.negotiatedPriceLimit)
				: null;
			item.NegotiatedPriceEnabled = this.negotiatedPriceEnabled;

			return item;
		});
		if (this.adminService.checkForDuplicates(this.steelConfig, 'name')) {
			this.notify.error('Error! Name should be unique');
			return false;
		}

		if (count === 1 && !this.isSinglePrice) {
			this.popupQuestion();
		} else {
			console.log('steelConfig', this.steelConfig);
			this.adminService
				.setSteelConfig(this.steelConfig)
				.subscribe((response: any) => {
					this.notify.success('Saved Successfully');
					this.steelConfig = response.map((config) => {
						return this.configItem(config);
					});
					this.confirmSteels = this.steelConfig.filter((item) => {
						return !item.delete;
					}).length;
				});
		}
	}

	singlePriceEvent(value: boolean, isSinglePrice = false) {
		if (isSinglePrice) {
			this.isSinglePrice = value;
			console.log(this.isSinglePrice);
			
			if (value) {
				this.negotiatedPriceEnabled = false;
			}
		} else {
			this.negotiatedPriceEnabled = value;
			if (!this.negotiatedPriceEnabled) {
				this.negotiatedPriceLimit = null;
			} else {
				this.negotiatedPriceLimit = 10;
			}
		}
		this.steelConfig.map((item) => {
			item.biddingSetup = this.biddingSetup;
			item.isSinglePrice = this.isSinglePrice;
			item.negotiatedPriceLimit = this.negotiatedPriceLimit
				? Number(this.negotiatedPriceLimit)
				: null;
			item.NegotiatedPriceEnabled = this.negotiatedPriceEnabled;

			return item;
		});
		this.adminService
			.setSteelConfig(this.steelConfig)
			.subscribe((response: any) => {
				console.log(response);
				this.notify.success('Saved Successfully');
				this.steelConfig = response.map((config) => {
					return this.configItem(config);
				});
				this.confirmSteels = this.steelConfig.filter((item) => {
					return !item.delete;
				}).length;
			});
	}

	alternateAlgorithmEvent(value) {
		this.adminService
			.setAlternateAlgorithm({
				alternateAlgorithm: value,
			})
			.subscribe((response: any) => {
				this.notify.success('Saved Successfully');
			});
	}

	popupQuestion() {
		const dialogRef = this.dialog.open(PopupQuestionComponent, {
			width: '450px',
			data: {
				title: 'Confirmation',
				question: `ATTENTION: Would you like to display only one bid price?`,
				confirm: 'Yes',
				deny: 'No',
				isconfirmed: false,
				otherData: {},
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (typeof result?.isconfirmed !== 'undefined') {
				if (result.isconfirmed) {
					this.biddingQuestion();
					this.isSinglePrice = true;
				} else {
					this.isSinglePrice = false;
					this.adminService
						.setSteelConfig(this.steelConfig)
						.subscribe((response: any) => {
							this.notify.success('Saved Successfully');
							this.steelConfig = response.map((config) => {
								return this.configItem(config);
							});
						});
				}
			} else {
				this.resetConfig();
			}
		});
	}

	biddingQuestion() {
		const dialogRef = this.dialog.open(PopupQuestionComponent, {
			width: '450px',
			data: {
				title: 'Confirmation',
				question: `Vehicle Class Price Vs. Curb Weight Price – Display`,
				confirm: 'Highest Bid',
				deny: 'Lowest Bid',
				isconfirmed: false,
				otherData: {},
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (typeof result?.isconfirmed !== 'undefined') {
				if (result.isconfirmed) {
					this.biddingSetup = 'highest';
				} else if (!result.isconfirmed) {
					this.biddingSetup = 'lowest';
				}
				this.saveConfig();
			} else {
				this.resetConfig();
			}
		});
	}

	resetConfig() {
		this.isSinglePrice = false;
		this.negotiatedPriceEnabled = false;
		this.biddingSetup = null;
	}

	configItem(item: any) {
		console.log('item', item);
		item.steelPricePound = item.steelPriceTon / 20;
		item.delete = false;
		//legacy code to match API
		if (item.S3GroupId === AdminConfig.defaultId) delete item.id;
		item.S3GroupId = +this.adminService.retrieveS3GroupId();
		this.isSinglePrice = item.isSinglePrice;
		this.biddingSetup = item.biddingSetup;
		this.negotiatedPriceLimit = item.negotiatedPriceLimit;
		this.negotiatedPriceEnabled = item.NegotiatedPriceEnabled;
		if (item.updatedAt || item.createdAt) {
			let dateReplace = (item.updatedAt ?? item.createdAt).replace('T', ' ');
			dateReplace = dateReplace.replace('Z', '');
			item.updatedAt = moment(dateReplace).format('MMM D, YYYY h:mm:ss a');
		}
		return item;
	}
}
