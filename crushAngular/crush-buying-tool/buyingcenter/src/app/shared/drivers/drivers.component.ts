import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { Observable, from, forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';
import { driver, vendor } from 'src/app/interfaces/call-center.interface';
import { HttpClientService } from 'src/app/services/http-client.service';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
	selector: 'app-drivers',
	templateUrl: './drivers.component.html',
	styleUrls: ['./drivers.component.scss']
})
export class DriversComponent implements OnInit, OnChanges {
	//this includes vendor and internal
	drivers: driver[] = [];
	vendors: vendor[] = [];
	vendorDrivers: any = {};
	driverCounts: any = {};
	driverid: number = null;
	@Input() tab: string = 'driver';
	// pass true if you want see vendors where towing = false, used in dropdown on new/edit ticket
	@Input() onlySellers = false;
	@Output() selectedDriver = new EventEmitter();
	@Output() driverTab = new EventEmitter();
	constructor(private ticketService: TicketService, private httpClientService: HttpClientService, private cdRef: ChangeDetectorRef) { }

	ngOnInit(): void {
		this.ticketService.updateDriverTickets();
		this.updateDrivers();
		this.updateVendors();
		this.ticketService.getDriverCounts().subscribe((counts) => {

			this.driverCounts = counts;
			// console.log(this.driverCounts)
		})
	}
	ngOnChanges(changes: SimpleChanges) {
	}
	updateDrivers() {
		this.httpClientService.getDrivers().pipe(take(1)).subscribe((drivers: driver[]) => {
			this.drivers = drivers;
			console.log(drivers,'drivers');
			
		});
	}
	updateVendors() {
		this.httpClientService.getVendors().pipe(take(1)).subscribe((vendors: vendor[]) => {
			//only build out list where tow = true
			this.vendors = vendors.filter((vendor) => vendor.towingVendor);
			this.updateVendorDrivers();
		});
	}
	updateVendorDrivers() {
		if (this.vendors) {
			const observableIds = this.vendors.map((vendor) => {
				return this.httpClientService.getVendorDrivers(vendor.id);
			});
			forkJoin(observableIds).subscribe((drivers) => {
				const tempDrivers = {};
				drivers.map((driver: any) => {
					if (driver.length > 0) {
						tempDrivers[driver[0].vendorId] = driver;
					}
				});
				this.vendorDrivers = tempDrivers;
				this.cdRef.detectChanges();
			});
		}
	}
	showTab(tab: string) {
		this.tab = tab;
	}
	changeDriver(driver) {
		driver.id = driver.userid ? driver.userid : driver.id;
		this.driverid = driver.id;
		this.selectedDriver.emit(driver);
	}
}
