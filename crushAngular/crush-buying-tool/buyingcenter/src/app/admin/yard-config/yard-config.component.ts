import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { yardInfo } from 'src/app/interfaces/admin-interface';
import { AdminService } from 'src/app/services/admin.service';
import { DistanceService } from 'src/app/services/distance.service';
import { NotificationService } from 'src/app/services/notification.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import * as _ from 'lodash';

@Component({
	selector: 'app-yard-config',
	templateUrl: './yard-config.component.html',
	styleUrls: ['./yard-config.component.scss'],
})
export class YardConfigComponent implements OnInit {
	yardConfig: yardInfo[] = [];
	addressFound: boolean = false;
	Pk: number = 0;
	constructor(
		private admin: AdminService,
		private distance: DistanceService,
		private notify: NotificationService,
		private httpClient: HttpClientService
	) {}

	ngOnInit(): void {
		this.getData();
	}
	prevDefault: number = 0;
	getData() {
		this.httpClient.getAdminYards().subscribe((yards) => {
			this.yardConfig = _.orderBy(yards, 'YardName', 'asc').map((yard) => {
				yard.isDefault = yard.isDefault ? yard.Pk.toString() : false;
				if (yard.isDefault) {
					this.prevDefault = yard.Pk;
				}

				return yard;
			});
		});
	}
	saveYard() {
		this.yardConfig = this.yardConfig.map((yard) => {
			yard.YardLocation = yard.address;
			if (
				yard.isDefault == yard.Pk.toString() &&
				yard.isDefault != this.prevDefault.toString()
			) {
				console.log('is default', yard.isDefault, yard.Pk);
				yard.isDefault = true;
			}
			if (yard.isDefault == false) {
				console.log('is default0', yard.isDefault, yard.Pk);
				yard.isDefault = false;
			}
			return yard;
		});
		this.admin.setYards(this.yardConfig).subscribe((val) => {
			this.getData();
			this.notify.success('Yards Saved');
		});
	}

	addYard() {
		let s3_client_id = _.orderBy(this.yardConfig, ['S3ClientId'], ['desc']);
		this.httpClient.getAllYards().subscribe((yard) => {
			this.yardConfig.push({
				Pk: _.size(yard) + 1,
				S3GroupId: +this.admin.retrieveS3GroupId(),
				GroupName: s3_client_id[0]?.GroupName,
				S3ClientId: s3_client_id[0]?.S3ClientId,
				YardName: '',
				YardLocation: {
					street1: null,
					street2: null,
					city: null,
					zip: null,
					state: null,
					latitude: null,
					longitude: null,
				},
				YardAddress: null,
				YardLicenseStatus: null,
				YardCrushUpgradeDate: null,
				YardCrushPackage: null,
				YardCrushVersion: null,
				isDefault: false,
				address: {
					street1: null,
					street2: null,
					city: null,
					zip: null,
					state: null,
					latitude: null,
					longitude: null,
				},
			});
		});
	}

	findAddress(yard: yardInfo) {
		//only find  when all address fields have a value.
		let addressStr =
			`${yard.address.street1},+${yard.address.street2},+${yard.address.city},+${yard.address.zip},+${yard.address.state}`.replace(
				/\s/g,
				'+'
			);
		this.distance
			.geocode(addressStr)
			.pipe(
				catchError((err) => {
					this.addressFound = false;
					return of(false);
				})
			)
			.subscribe((geo: any) => {
				if (geo) {
					const coords = geo.results[0].geometry;
					yard.address.latitude = coords.location.lat;
					yard.address.longitude = coords.location.lng;
				}
			});
	}

	onClick(event: any) {
		console.log(event);
	}
}
