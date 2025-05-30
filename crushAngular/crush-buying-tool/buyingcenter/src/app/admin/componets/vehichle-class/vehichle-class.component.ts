import { Component, OnInit } from '@angular/core';
import { AdminConfig } from 'src/app/config/admin.routes.config';
import { classToWeight } from 'src/app/interfaces/admin-interface';
import { AdminService } from 'src/app/services/admin.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TicketService } from 'src/app/services/ticket.service';
import { vehicleSize } from 'src/app/interfaces/call-center.interface';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
	selector: 'app-vehichle-class',
	templateUrl: './vehichle-class.component.html',
	styleUrls: ['./vehichle-class.component.scss']
})
export class VehichleClassComponent implements OnInit {
	vehicleClass: classToWeight[] = [];
	vehicleSizes: vehicleSize[] = [];
	constructor(
		private adminService: AdminService,
		private notify: NotificationService,
		private ticketService: TicketService
	) { }

	ngOnInit(): void {
		this.initConfig();
	}
	saveConfig() {
		if (this.adminService.checkForDuplicates(this.vehicleClass, 'CarSize')) {
			this.notify.error('Error! Car Size should be unique');
			return false
		}

		this.adminService.setVehicleClass(this.vehicleClass).subscribe(
			(response: any) => {
				this.notify.success('Saved Successfully');
				this.vehicleClass = response.map(vehicle => {
					return this.configItem(vehicle)
				});
			}
		);
	}
	reset() {
		this.adminService.setVehicleClass([], true).subscribe(() => {
			this.initConfig();
			this.notify.success('Reset Successfully');
		})
	}
	confirmDelete(item: classToWeight) {
		item.delete = true
	}
	addCarSize() {
		this.vehicleClass.push({
			S3GroupId: +this.adminService.retrieveS3GroupId(),
			CarSize: null,
			weightTons: null,
			new: true
		})
	}

	initConfig() {
		combineLatest([
			this.ticketService.getYards(),
			this.ticketService.getVehicleModel(),
			this.ticketService.getVehicleSizes()
		]).pipe(map(([yards, allMakes, vehicleSize]) => ({ yards, allMakes, vehicleSize }))).subscribe((obj) => {
			this.vehicleSizes = obj.vehicleSize;
		});

		this.adminService.getVehicleClass().subscribe((config: classToWeight[]) => {
			this.vehicleClass = config.map((item) => {
				return this.configItem(item);
			});

		});
	}

	configItem(item: any) {
		if (item.S3GroupId === AdminConfig.defaultId) delete item.id;
		item.curbWeight = item.weightTons * 2000;
		if (item.weightTons === 0) item.weightTons = null;
		item.delete = false;
		item.S3GroupId = +this.adminService.retrieveS3GroupId();
		return item;
	}

}
