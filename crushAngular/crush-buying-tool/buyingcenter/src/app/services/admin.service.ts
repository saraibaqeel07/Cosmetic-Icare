import { Injectable } from '@angular/core';
import {
	classToWeight,
	customQuestionsCosts,
	proofDocs,
	recallCosts,
	steelPrice,
	towingCost,
	vehiclePopularity,
	yardInfo,
	yearAdjCost,
} from '../interfaces/admin-interface';
import { HttpClientService } from './http-client.service';

@Injectable({
	providedIn: 'root',
})
export class AdminService {
	//many 'defaults' are -1
	constructor(private httpClient: HttpClientService) {}
	retrieveS3GroupId() {
		return localStorage.getItem('selectedGroup');
	}
	getSteelConfig() {
		return this.httpClient.getSteelConfig();
	}
	setSteelConfig(steelConfig: steelPrice[]) {
		return this.httpClient.setSteelConfig(steelConfig);
	}
	setAlternateAlgorithm(alternateAlgorithm) {
		return this.httpClient.setAlternateAlgorithm(alternateAlgorithm);
	}
	getAlternateAlgorithm() {
		return this.httpClient.getAlternateAlgorithm();
	}
	setPreferredYard(preferredYard) {
		return this.httpClient.setPreferredYard(preferredYard);
	}
	getPreferredYard() {
		return this.httpClient.getPreferredYard();
	}
	setQuestionsMandatory(questionsMandatory) {
		return this.httpClient.setQuestionsMandatory(questionsMandatory);
	}
	getQuestionsMandatory() {
		return this.httpClient.getQuestionsMandatory();
	}
	getVehicleClass() {
		return this.httpClient.getVehicleClassConfig();
	}
	setVehicleClass(config: classToWeight[], useDefault: boolean = false) {
		return this.httpClient.setVehicleClassConfig(config, useDefault);
	}
	getTowingCost() {
		return this.httpClient.getTowingCost();
	}
	getYearData(token, year = null) {
		return this.httpClient.getVehicleDataByYear(token, year);
	}
	getMakeData(token, year?, make?) {
		return this.httpClient.getVehicleDataByYearMake(token, year, make);
	}
	getModelTrims(token, year, make, model) {
		return this.httpClient.getVehicleDataByYearMakeModel(
			token,
			year,
			make,
			model
		);
	}
	getVehicleTrim(token, series) {
		return this.httpClient.getVehicleDataBySeries(token, series);
	}
	getCarAPILogin() {
		return this.httpClient.getCarAPILogin();
	}
	setTowingCost(config: towingCost[]) {
		return this.httpClient.setTowingCost(config);
	}
	getVehicleModel() {
		return this.httpClient.getVehicleModel();
	}
	getPopularVehicles() {
		return this.httpClient.getPopularVehicles();
	}
	setPopularVehicles(vehicles: vehiclePopularity[]) {
		return this.httpClient.setPopularVehicles(vehicles);
	}
	getUnpopularVehicles() {
		return this.httpClient.getUnpopularVehicles();
	}
	setUnpopularVehicles(vehicles: vehiclePopularity[]) {
		return this.httpClient.setUnpopularVehicles(vehicles);
	}
	getYearAdjustment() {
		return this.httpClient.getYearAdjustment();
	}
	setYearAdjustment(years: yearAdjCost[]) {
		return this.httpClient.setYearAdjustment(years);
	}
	getRecall() {
		return this.httpClient.getRecall();
	}
	setRecall(recalls: recallCosts[]) {
		return this.httpClient.setRecall(recalls);
	}
	getProofDocs() {
		return this.httpClient.getProofDocs();
	}
	setProofDocs(proofDocs: proofDocs[]) {
		return this.httpClient.setProofDocs(proofDocs);
	}
	getCustomQuestions() {
		return this.httpClient.getCustomQuestions();
	}
	setCustomQuestions(proofDocs: customQuestionsCosts[]) {
		return this.httpClient.setCustomQuestions(proofDocs);
	}
	getYards() {
		return this.httpClient.getAdminYards();
	}
	setYards(yards: yardInfo[]) {
		return this.httpClient.setAdminYards(yards);
	}
	getSubscription() {
		return this.httpClient.getSubscriptions();
	}
	getSubscriptionsData() {
		return this.httpClient.getSubscriptionsData();
	}

	getVehicleGroupModel() {
		return this.httpClient.getVehicleGroupModel();
	}

	checkForDuplicates(object: object, index: string) {
		let valuesAlreadySeen = [];
		let array = [];

		Object.keys(object).forEach((item) => {
			if (!object[item]['delete']) {
				array.push(object[item][index]);
			}
		});

		if (!array.length) {
			return false;
		}

		for (let i = 0; i < array.length; i++) {
			let value = array[i];
			if (valuesAlreadySeen.indexOf(value) !== -1) {
				return true;
			}
			valuesAlreadySeen.push(value);
		}
		return false;
	}

	checkForDuplicatePopularUnpopularVehicles(vehicles) {
		let duplicateFound = false;

		for (let i = 0; i < vehicles.length; i++) {
			for (let j = i + 1; j < vehicles.length; j++) {
				if (
					vehicles[i].makeId === vehicles[j].makeId &&
					vehicles[i].modelId === vehicles[j].modelId &&
					vehicles[i].yearbegin === vehicles[j].yearbegin &&
					vehicles[i].yearend === vehicles[j].yearend
				) {
					duplicateFound = true;
					break; // Stop checking further if a duplicate is found
				}
			}
			if (duplicateFound) break;
		}

		return duplicateFound;
	}
}
