import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fadeInItems } from '@angular/material/menu';
import { merge, of, Subject } from 'rxjs';
import { catchError, debounceTime, takeUntil } from 'rxjs/operators';
import { state } from 'src/app/interfaces/data.interface';
import { DistanceService } from 'src/app/services/distance.service';
import { HttpClientService } from 'src/app/services/http-client.service';

@Component({
	selector: 'app-set-vendor',
	templateUrl: './set-vendor.component.html',
	styleUrls: ['./set-vendor.component.scss'],
})
export class SetVendorComponent implements OnInit, OnDestroy {
	destroy$: Subject<boolean> = new Subject();
	vendorForm: FormGroup;
	addressFound: boolean = null;
	states: state[];
	constructor(private fb: FormBuilder, private distanceService: DistanceService, public dialogRef: MatDialogRef<SetVendorComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClientService) {}

	ngOnInit(): void {
		this.vendorForm = this.fb.group({
			id: [null],
			addressId: [null],
			businessName: ['', [Validators.required]],
			contactName: ['', [Validators.required]],
			phone: ['', [Validators.required]],
			tow: [false],
			lat: ['', [Validators.required]],
			long: ['', [Validators.required]],
			street1: ['', [Validators.required]],
			street2: [''],
			city: ['', [Validators.required]],
			state: ['', [Validators.required]],
			zip: ['', [Validators.required]],
		});
		const v = this.data.vendor;
		if(v) {
			if(v.address.latitude) this.addressFound = true;
			this.vendorForm.patchValue({
				id: v.id,
				businessName: v.businessName,
				contactName: v.contactName,
				phone: v.phoneNumber,
				tow: v.towingVendor,
				addressId: v.address.id,
				lat: v.address.latitude,
				long: v.address.longitude,
				street1: v.address.street1,
				street2: v.address.stret2,
				state: v.address.state,
				city: v.address.city,
				zip: v.address.zip,
			});
		}
		this.init();
	}
init() {
	this.http.getStates().subscribe(states => {
		this.states = states;
	});
	merge(this.vendorForm.controls['street1'].valueChanges,
		this.vendorForm.controls['street2'].valueChanges,
		this.vendorForm.controls['city'].valueChanges,
		this.vendorForm.controls['state'].valueChanges,
		this.vendorForm.controls['zip'].valueChanges).pipe(debounceTime(250), takeUntil(this.destroy$)).subscribe(() => {
			this.findAddress();
		});
}
private findAddress() {
	//only find  when all address fields have a value.
	if(!!this.vendorForm.value.street1 && !!this.vendorForm.value.city
		&& !!this.vendorForm.value.state  && !!this.vendorForm.value.zip) {
		let addressStr = `${this.vendorForm.value.street1},+${this.vendorForm.value.street2},+${this.vendorForm.value.city},+${this.vendorForm.value.zip},+${this.vendorForm.value.sate}`.replace(/\s/g, '+')
		this.distanceService.geocode(addressStr).pipe(catchError((err) => {
			this.addressFound = false;
			return of(false);
		})).subscribe((geo: any) => {
			if(geo) {
				const coords = geo.results[0].geometry;
				this.vendorForm.patchValue({
					lat: coords.location.lat,
					long: coords.location.lng
				},{onlySelf: true, emitEvent: false});
				this.addressFound = true;
				return;
			}
			this.addressFound = false;
			return;
		});
	}
}
ngOnDestroy() {
	this.destroy$.next(true);
	this.destroy$.complete();
}
save() {
	if(this.vendorForm.valid) {
		const v = this.vendorForm.value;
		const vendor = {
			id: v.id,
			businessName: v.businessName,
			contactName: v.contactName,
			phoneNumber: v.businessName,
			address: {
				id: v.addressId,
				street1: v.street1,
				street2: v.street2,
				city: v.city,
				zip: v.zip,
				latitude: v.lat,
				longitude: v.long
			},
			groupId: this.http.retrieveS3GroupId(),
			towingVendor: v.tow
		}
		this.http.saveVendor(vendor).subscribe((val) => {
			this.dialogRef.close(true);
		});
	}
}
cancel() {
	this.dialogRef.close(false);
}
}
