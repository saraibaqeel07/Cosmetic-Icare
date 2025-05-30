import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { ResourceConfig } from '../config/routes.config';
import { AdminConfig } from '../config/admin.routes.config';
import {
	Call,
	makeModel,
	ticket,
	vendor,
	yardLocation,
} from '../interfaces/call-center.interface';
import {
	classToWeight,
	customQuestionsCosts,
	proofDocs,
	recallCosts,
	steelPrice,
	towingCost,
	userAndRoles,
	UserData,
	vehiclePopularity,
	yardInfo,
	yearAdjCost,
} from '../interfaces/admin-interface';
import { AuthService } from './auth.service';
import { delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { state } from '../interfaces/data.interface';
// import {temptickets} from ../data
/*****************
 * this is all the API routes subscriptions should be done in other files not here. generally. *
 **************/
@Injectable({
	providedIn: 'root',
})
export class HttpClientService {
	// allTickets$ = new BehaviorSubject('tickets');
	baseApi = ResourceConfig.baseAPI;
	constructor(private http: HttpClient) {}
	retrieveS3GroupId(): string {
		return localStorage.getItem('selectedGroup');
	}
	getUser() {
		return this.http.get(`${this.baseApi}user`);
	}
	logout() {
		this.http
			.get(`${this.baseApi}${ResourceConfig.UserLogoutEndpoint}`)
			.subscribe(() => {
				localStorage.removeItem('user');
				localStorage.removeItem('roles');
				window.location.href = environment.baseAPI;
			});
	}
	// getAllTickets() {
	// 	//http request
	// 	return this.allTickets$;
	// }
	getTicket(id: string) {
		return this.http.get<Call>(`${this.baseApi}${ResourceConfig.GetTicket}${id}`);
	}
	getVehicleModel() {
		return this.http.get<makeModel>(
			`${this.baseApi}${ResourceConfig.VehicleModel}`
		);
	}
	getVendors() {
		return this.http.get<vendor[]>(
			`${this.baseApi}${ResourceConfig.getVendors}${this.retrieveS3GroupId()}`
		);
	}
	getVendorDrivers(vendorId) {
		return this.http.get(
			`${this.baseApi}${ResourceConfig.getVendorDriver}${vendorId}`
		);
	}
	getDrivers() {
		return this.http.get(
			`${this.baseApi}${
				ResourceConfig.CallCenterDrivers
			}/${this.retrieveS3GroupId()}`
		);
	}
	updateQoute(qoute: any) {}
	getQoute() {}
	getGeoCode(geoObj = {}) {
		return this.http.post(`${this.baseApi}${ResourceConfig.GeoCode}`, geoObj);
	}
	getGeoCodeByZip(zip: any) {
		return this.http.get(`${this.baseApi}${ResourceConfig.GeoCode}/${zip}`);
	}
	getYards() {
		console.log(localStorage.getItem('test'));
		return this.http.get<yardLocation[]>(
			`${this.baseApi}${ResourceConfig.YardLocations}${this.retrieveS3GroupId()}`
		);
	}
	//admin routes
	getSteelConfig() {
		return this.http.get<steelPrice[]>(
			`${this.baseApi}${AdminConfig.steelPrice}/${this.retrieveS3GroupId()}`
		);
	}
	setSteelConfig(steelConfig: steelPrice[]) {
		return this.http.post(`${this.baseApi}${AdminConfig.steelPrice}`, {
			default: false,
			steelprice: steelConfig,
		});
	}
	setAlternateAlgorithm(alternateAlgorithm) {
		return this.http.post(
			`${this.baseApi}${AdminConfig.alternateAlgorithm}`,
			alternateAlgorithm
		);
	}
	getAlternateAlgorithm() {
		return this.http.get(`${this.baseApi}${AdminConfig.alternateAlgorithm}`);
	}
	setPreferredYard(preferredYard) {
		return this.http.post(
			`${this.baseApi}${AdminConfig.preferredYard}`,
			preferredYard
		);
	}
	getPreferredYard() {
		return this.http.get(`${this.baseApi}${AdminConfig.preferredYard}`);
	}
	setQuestionsMandatory(questionsMandatory) {
		return this.http.post(
			`${this.baseApi}${AdminConfig.questionsMandatory}`,
			questionsMandatory
		);
	}
	getQuestionsMandatory() {
		return this.http.get(`${this.baseApi}${AdminConfig.questionsMandatory}`);
	}
	getVehicleClassConfig() {
		return this.http.get(
			`${this.baseApi}${AdminConfig.GetVehicleSizes}/${this.retrieveS3GroupId()}`
		);
	}
	setVehicleClassConfig(config: classToWeight[], useDefault: boolean = false) {
		return this.http.post(`${this.baseApi}${AdminConfig.GetVehicleSizes}`, {
			default: useDefault,
			carSizeWeight: config,
		});
	}
	getTowingCost() {
		return this.http.get<towingCost[]>(
			`${this.baseApi}${AdminConfig.towingCost}/${this.retrieveS3GroupId()}`
		);
	}
	getVehicleDataByYear(token, year) {
		// const headers = new HttpHeaders({
		// 	'accept': 'application/json',
		// 	'Authorization': `Bearer ${token}`
		//   });
		return this.http.get<any[]>(
			`${this.baseApi}${AdminConfig.getVehicleDataByYear}/${year}?tokenString=${token}`
		);
	}
	getVehicleDataByYearMake(token, year, make) {
		return this.http.get<any[]>(
			`${this.baseApi}${AdminConfig.getVehicleDataByYearMake}/${year}/${make}?tokenString=${token}`
		);
	}
	getVehicleDataByYearMakeModel(token, year, make, model) {
		return this.http.get<any[]>(
			`${this.baseApi}${AdminConfig.getVehicleDataByYearMakeModel}/${year}/${make}/${model}?tokenString=${token}`
		);
	}
	getVehicleDataBySeries(token, series) {
		return this.http.get<any[]>(
			`${this.baseApi}${AdminConfig.getVehicleDataBySeries}/${series}?tokenString=${token}`
		);
	}
	getCarAPILogin() {
		return this.http.get(`${this.baseApi}${AdminConfig.getCarAPILogin}`);
	}

	setTowingCost(config: towingCost[]) {
		return this.http.post(`${this.baseApi}${AdminConfig.towingCost}`, {
			default: false,
			towingcost: config,
		});
	}
	getPopularVehicles() {
		return this.http.get<vehiclePopularity[]>(
			`${this.baseApi}${AdminConfig.popularVehicles}/${this.retrieveS3GroupId()}`
		);
	}
	setPopularVehicles(vehicles: vehiclePopularity[]) {
		return this.http.post<vehiclePopularity[]>(
			`${this.baseApi}${AdminConfig.popularVehicles}`,
			{ default: false, popularVehicles: vehicles }
		);
	}
	getUnpopularVehicles() {
		return this.http.get<vehiclePopularity[]>(
			`${this.baseApi}${AdminConfig.unpopularVehicles}/${this.retrieveS3GroupId()}`
		);
	}
	setUnpopularVehicles(vehicles: vehiclePopularity[]) {
		return this.http.post<vehiclePopularity[]>(
			`${this.baseApi}${AdminConfig.unpopularVehicles}`,
			{ default: false, unpopularVehicles: vehicles }
		);
	}
	getYearAdjustment() {
		return this.http.get<yearAdjCost[]>(
			`${this.baseApi}${AdminConfig.yearAdjustments}/${this.retrieveS3GroupId()}`
		);
	}
	setYearAdjustment(year: yearAdjCost[]) {
		return this.http.post<yearAdjCost[]>(
			`${this.baseApi}${AdminConfig.yearAdjustments}`,
			{ default: false, yearadjustments: year }
		);
	}
	getRecall() {
		return this.http.get<recallCosts[]>(
			`${this.baseApi}${AdminConfig.RecallCosts}/${this.retrieveS3GroupId()}`
		);
	}
	setRecall(recalls: recallCosts[]) {
		return this.http.post<recallCosts[]>(
			`${this.baseApi}${AdminConfig.RecallCosts}`,
			{ default: false, recallCosts: recalls }
		);
	}
	getProofDocs() {
		return this.http.get<proofDocs[]>(
			`${this.baseApi}${AdminConfig.ProofDocs}/${this.retrieveS3GroupId()}`
		);
	}
	setProofDocs(proofDocs: proofDocs[]) {
		return this.http.post<proofDocs[]>(
			`${this.baseApi}${AdminConfig.ProofDocs}`,
			{ default: false, proofdocs: proofDocs }
		);
	}
	getCustomQuestions() {
		return this.http.get<customQuestionsCosts[]>(
			`${this.baseApi}${
				AdminConfig.GetcustomQuestions
			}/${this.retrieveS3GroupId()}`
		);
	}
	setCustomQuestions(questions: customQuestionsCosts[]) {
		return this.http.post<customQuestionsCosts[]>(
			`${this.baseApi}${AdminConfig.SetcustomQuestions}`,
			{ default: false, questions: questions }
		);
	}
	getAdminYards() {
		return this.http.get<yardInfo[]>(
			`${this.baseApi}${AdminConfig.getYards}${this.retrieveS3GroupId()}`
		);
	}
	setAdminYards(yards: yardInfo[]) {
		return this.http.post(`${this.baseApi}${AdminConfig.setYards}`, {
			yards: yards,
		});
	}
	getUserAccounts() {
		return this.http.get<userAndRoles[]>(
			`${this.baseApi}${
				AdminConfig.UsersAccordingToGroup
			}${this.retrieveS3GroupId()}`
		);
	}
	resendInvite(userId) {
		return this.http.get<yardInfo[]>(
			`${this.baseApi}${AdminConfig.resendInvitation}${userId}`
		);
	}
	//used for admin route. to support legacy without side effects
	getAdminUser() {
		return this.http.get<UserData>(`${this.baseApi}user`);
	}
	setNewUser(user: any) {
		return this.http.post(`${this.baseApi}${AdminConfig.inviteUser}`, {
			invite: user,
		});
	}
	updateUser(user: any) {
		return this.http.post(`${this.baseApi}${AdminConfig.updateUser}`, {
			user: user,
		});
	}
	changeRoles(roles: any) {
		return this.http.post(`${this.baseApi}${AdminConfig.ChangeRoles}`, {
			roles: roles,
		});
	}
	getStates() {
		return this.http.get<state[]>(`${this.baseApi}${ResourceConfig.States}`);
	}
	saveVendor(vendor: any) {
		return this.http.post(`${this.baseApi}${ResourceConfig.setVendors}`, {
			vendor: vendor,
		});
	}
	getSubscriptions() {
		return this.http.get(
			`${this.baseApi}${AdminConfig.getSubscription}${this.retrieveS3GroupId()}`
		);
	}
	getSubscriptionsData() {
		return this.http.get(
			`${this.baseApi}${AdminConfig.getSubscriptionsData}`
		);
	}
	getRoles() {
		return this.http.get(`${this.baseApi}${AdminConfig.getRoles}`);
	}
	getAllYards() {
		return this.http.get(`${this.baseApi}${AdminConfig.getAllYards}`);
	}
	updateTearAPartStatus(obj: any) {
		return this.http.post(`${this.baseApi}${AdminConfig.updateTearAPartStatus}`, {
			data: obj,
		});
	}
	getVehicleGroupModel() {
		return this.http.get(`${this.baseApi}${AdminConfig.getVehicleGroupModel}`);
	}
}
