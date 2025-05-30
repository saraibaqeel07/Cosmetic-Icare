import { Component, OnInit } from '@angular/core';
import { AdminConfig } from 'src/app/config/admin.routes.config';
import {
	vehicleModel,
	vehiclePopularity,
} from 'src/app/interfaces/admin-interface';
import { vehicleMake } from 'src/app/interfaces/call-center.interface';
import { AdminService } from 'src/app/services/admin.service';
import { NotificationService } from 'src/app/services/notification.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ResourceConfig } from 'src/app/config/routes.config';

@Component({
	selector: 'app-unpopular-vehicles',
	templateUrl: './unpopular-vehicles.component.html',
	styleUrls: ['./unpopular-vehicles.component.scss'],
})
export class UnpopularVehiclesComponent implements OnInit {
	allMakes: vehicleMake[] = [];
	allModels: any[] = [];
	modelByMake = {};
	vehicles: vehiclePopularity[] = [];
	baseApi = ResourceConfig.baseAPI;
	applyToAboveDpt = null;
	isSinglePrice = false;
	searchValue: string = '';
	constructor(
		private adminService: AdminService,
		private notify: NotificationService
	) {}

	async initForm() {
		this.adminService.getYearData(this.carAPILoginToken, 0).subscribe((data) => {
			this.allMakes = data['data'];
			this.adminService
				.getMakeData(this.carAPILoginToken, 0, 0)
				.subscribe((data) => {
					this.allModels = data['data'];
					console.log('this.allModels', this.allModels);
					this.adminService.getUnpopularVehicles().subscribe((config) => {
						this.vehicles = config.map((vehicle) => {
							return this.configItem(vehicle);
						});
						console.log(this.vehicles);
					});
					this.allModels.forEach((model) => {
						if (!this.modelByMake[model.make_id]) {
							this.modelByMake[model.make_id] = [];
						}
						this.modelByMake[model.make_id].push(model);
					});
					console.log('this.modelByMake', this.modelByMake);
				});
		});
		// const modelByMake: any = await this.adminService
		// 	.getVehicleGroupModel()
		// 	.toPromise();
		// this.adminService.getVehicleModel().subscribe((all) => {
		// 	this.allMakes = _.orderBy(all.make, 'make', 'asc');
		// 	// this.allModels = _.orderBy(all.model, 'model', 'asc');

		// 	this.adminService.getUnpopularVehicles().subscribe((config) => {
		// 		this.vehicles = config.map((vehicle) => {
		// 			return this.configItem(vehicle);
		// 		});
		// 	});
		// });

		// const popular: any = await this.adminService.getPopularVehicles().toPromise();
		// const modelIds = popular.map((item: any) => {
		// 	return item.modelId;
		// });

		// modelByMake.map((m) => {
		// 	this.modelByMake[m.makeId] = modelByMake.filter(
		// 		(item) => item.makeId === m.makeId && !modelIds.includes(item.id)
		// 	);
		// });

		this.adminService.getSteelConfig().subscribe((config) => {
			config.map((item) => {
				this.isSinglePrice = item.isSinglePrice;
				return item;
			});
		});
	}
	search() {
		console.log('Search value changed:', this.searchValue);
		// You can perform further actions here based on the changed value
	  }
	saveConfig() {
		this.vehicles.map((item) => {
			item.yearbegin = item.yearbegin ? Number(item.yearbegin) : null;
			item.yearend = item.yearend ? Number(item.yearend) : null;
			if (this.isSinglePrice) {
				item.applyToAboveDpt = this.applyToAboveDpt
					? Number(this.applyToAboveDpt)
					: null;
			}
			return item;
		});

		if (
			this.adminService.checkForDuplicatePopularUnpopularVehicles(this.vehicles)
		) {
			// this.notify.error(
			// 	'Error! Vehicle Make/Model/YearBegin/YearEnd should be unique.'
			// );
			// return false;
		}

		this.adminService
			.setUnpopularVehicles(this.vehicles)
			.subscribe((response) => {
				this.notify.success('Saved Successfully');
				this.vehicles = response.map((vehicle) => {
					return this.configItem(vehicle);
				});
			});
	}
	addItem() {
		this.vehicles.push({
			S3GroupId: +this.adminService.retrieveS3GroupId(),
			priceAdj: { adj: null, isPercent: false },
			delete: false,
			modelId: null,
			yearbegin: null,
			yearend: null,
			applyToAboveDpt: null,
		});
	}
	confirmDelete(item: vehiclePopularity) {
		item.delete = true;
	}

	downloadPriceHistory() {
		window.open(
			`${this.baseApi}${
				AdminConfig.downloadPriceHistory
			}${+this.adminService.retrieveS3GroupId()}/unPopularVehicle`,
			'_blank'
		);
	}

	configItem(vehicle: any) {
		vehicle.delete = false;
		if (vehicle.S3GroupId === AdminConfig.defaultId) delete vehicle.id;
		vehicle.S3GroupId = +this.adminService.retrieveS3GroupId();
		const model = this.allModels.find((m) => m.id === vehicle.modelId);
		vehicle.makeId = model?.make_id ? model.make_id : null;
		this.applyToAboveDpt = vehicle.applyToAboveDpt;
		if (vehicle.updatedAt || vehicle.createdAt)
			vehicle.updatedAt = moment(vehicle.updatedAt ?? vehicle.createdAt).format(
				'MMM D, YYYY h:mm:ss a'
			);

		return vehicle;
	}

	carAPILoginToken = '';
	ngOnInit(): void {
		this.adminService.getCarAPILogin().subscribe((data) => {
			console.log('dataCarLogin', data);
			this.carAPILoginToken = data['token'];

			this.initForm();
		});
	}
}
