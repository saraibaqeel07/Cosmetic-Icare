import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
declare var google: any;

@Injectable({
	providedIn: 'root'
})
export class DistanceService {

	constructor(private httpService: HttpClientService) {
	}
	//this will get lat long from google api
	geocode(address: string = '') {
		return this.httpService.getGeoCode({ geocode: { geocoding: address } });
	}
	zipCode(zip: string = '') {
		return this.httpService.getGeoCodeByZip(zip);
	}
	//google map api wasn't working...
	//google.maps.geometry.spherical
	calcDistance(coordFrom, coordTo) {
		//Haversine formulac
		const square = (x => Math.pow(x, 2));
		const deg2rad = (d => d * (Math.PI / 180));
		const earthRadius = 6371;
		const mileConversion = 0.621371;
		const lat1 = deg2rad(coordFrom.lat);
		const lat2 = deg2rad(coordTo.lat);
		const long1 = coordFrom.long;
		const long2 = coordTo.long;
		const latDif = lat2 - lat1;
		const longDif = deg2rad(long2 - long1);
		const a = square(Math.sin(latDif / 2)) + Math.cos(lat1) * Math.cos(lat2) * square(Math.sin(longDif / 2));
		const distance = 2 * earthRadius * Math.asin(Math.sqrt(a));
		return distance * mileConversion;
	}
}
