import { HttpClient, HttpParams } from '@angular/common/http';
import { NullTemplateVisitor } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, interval, Observable, Subject } from 'rxjs';
import { debounce, map, take, tap } from 'rxjs/operators';
import { ResourceConfig } from '../config/routes.config';

import {
	Call,
	makeModel,
	question,
	vehicleSize,
	VINNumber,
} from '../interfaces/call-center.interface';
import { HttpClientService } from './http-client.service';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
	providedIn: 'root',
})
export class TicketService {
	baseapi = ResourceConfig.baseAPI;
	quote$: Subject<any> = new Subject();
	allTickets$: BehaviorSubject<any> = new BehaviorSubject([]);
	driverTickets$: BehaviorSubject<any> = new BehaviorSubject([]);
	driverCounts$: BehaviorSubject<any> = new BehaviorSubject({});
	constructor(
		private http: HttpClient,
		private httpService: HttpClientService,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {}
	retrieveS3GroupId(): string {
		return localStorage.getItem('selectedGroup');
	}
	saveTicket(qoute: any) {
		qoute.ticket.S3GroupId = +this.retrieveS3GroupId();
		return this.http.post(
			`${this.baseapi}${ResourceConfig.SetCallTicket}`,
			qoute
		);
	}
	adjustTicketStatus(ticket) {
		ticket.S3GroupId = +this.retrieveS3GroupId();
		return this.http.post(
			`${this.baseapi}${ResourceConfig.AdjustTicketStatus}`,
			ticket
		);
	}
	purchaseTicket() {
		//post ticket
	}
	setFinished(finished: boolean, ticketNum: number) {
		return this.http.get(
			`${this.baseapi}${ResourceConfig.setTicketFinished}${ticketNum}/${finished}`
		);
	}
	getVehicleModel() {
		return this.http.get<makeModel>(
			`${this.baseapi}${ResourceConfig.VehicleModel}`
		);
	}
	getVehicleSizes() {
		return this.http.get<vehicleSize[]>(
			`${this.baseapi}${ResourceConfig.VehicleSizesOptions}`
		);
	}
	getVehicleSize(model, year) {
		//this route needs changes it needs to be set to params or a post request
		// in the Node app it has 2 seperate routes going to same code.
		let url = `${this.baseapi}${ResourceConfig.VehicleSizes}${model}`;
		if (year?.length == 4) {
			url += `/${year}`;
		}
		return this.http.get(url);
	}
	updateQuote(ticket: FormGroup) {
		//console.log(ticket.controls);
		const defaultAnswer = [
			{ answeredYes: null, questionId: 3063 },
			{ answeredYes: null, questionId: 3064 },
			{ answeredYes: null, questionId: 3065 },
			{ answeredYes: null, questionId: 3066 },
		];
		let tow = ticket.controls.tow.value;
		if (!ticket.controls.distance.value) {
			tow = false;
		}
		console.log("zssssss",ticket.controls.model)
		const quoteObj = {
			S3GroupId: this.retrieveS3GroupId(),
			questionAnswers: ticket.controls.questionAnswers.value,
			curbWeight: ticket.controls.curbWeight.value != null ? ticket.controls.curbWeight.value : "",
			distance: ticket.controls.distance.value,
			model: ticket.controls.model.value,
			modelId:document.getElementById("myModel").getAttribute("data_id"),
			proofDocs: ticket.controls.hasTitle.value,
			recalls: [],
			series: ticket.controls.series.value,
			towed: tow,
			vehicleSize: ticket.controls.vehicleSize.value,
			year: ticket.controls.year.value,
		};
		console.log('asddasdasdasdadadasd');
		
		this.http
			.post<any>(`${this.baseapi}${ResourceConfig.GetQuote}`, { quote: quoteObj })
			.pipe(
				map((res) => {
					const quote = this._filterQuote(res);
					let emptyQuote = quote;

					if (
						(ticket.controls.model.value &&
							ticket.controls.series.value &&
							ticket.controls.make.value &&
							ticket.controls.year.value) ||
						ticket.controls.VIN.value
					) {
						return quote;
					} else {
						emptyQuote.quote = emptyQuote.quote.map((item: any) => {
							item.quote = 0;
							return item;
						});
						emptyQuote.quoteCurb = emptyQuote.quoteCurb.map((item: any) => {
							item.quote = 0;
							return item;
						});
						return emptyQuote;
					}
				})
				
			)
			.subscribe((quote) => {
				this.quote$.next(quote);
			});
	}
	getQuote() {
		return this.quote$.asObservable();
	}
	updateAllTickets(status = 'all', searchString = null, finished = false) {
		const meta = {
			ticketInfo: {
				callTicket: null,
				phoneNumber: null,
				longitude: null,
				latitude: null,
				quotebottom: null,
				quoteTop: null,
				distance: null,
				S3GroupId: +this.retrieveS3GroupId(),
				chosenYardId: null,
				pickupDate: null,
				searchString: null,
				numResults: 250,
				orderChangedDesc: false,
				towed: false,
				ticketStatus: 'all',
				assignedToMeOrNull: false,
				assignedToMe: false,
				notFinished: false,
				pickupRange: null,
				driverId: null,
				driverVendor: false,
			},
		};
		meta.ticketInfo.ticketStatus = status;
		meta.ticketInfo.searchString = searchString;
		meta.ticketInfo.notFinished = finished;
		this.http
			.post(`${this.baseapi}${ResourceConfig.OpenTickets}`, meta)
			.subscribe((tickets) => {
				this.allTickets$.next(tickets);
			});
	}
	getAllTickets() {
		return this.allTickets$.asObservable();
	}
	updateDriverTickets() {
		const meta = {
			ticketInfo: {
				callTicket: null,
				phoneNumber: null,
				longitude: null,
				latitude: null,
				quotebottom: null,
				quoteTop: null,
				distance: null,
				S3GroupId: +this.retrieveS3GroupId(),
				chosenYardId: null,
				pickupDate: null,
				searchString: null,
				numResults: 600,
				orderChangedDesc: false,
				towed: true,
				ticketStatus: 'pickup',
				assignedToMeOrNull: false,
				assignedToMe: false,
				notFinished: false,
				pickupRange: null,
				driverId: null,
				driverVendor: false,
			},
		};
		this.http
			.post<any[]>(`${this.baseapi}${ResourceConfig.OpenTickets}`, meta)
			.subscribe((tickets: any[]) => {
				const ticketCounts = this.countTickets(tickets);
				this.driverTickets$.next(tickets);
				this.driverCounts$.next(ticketCounts);
			});
	}
	countTickets(tickets) {
		const obj = {};
		tickets.forEach((ticket) => {
			if (ticket.driver)
				obj[ticket.driver] ? obj[ticket.driver]++ : (obj[ticket.driver] = 1);
		});
		return obj;
	}
	getDriverTickets() {
		return this.driverTickets$.asObservable();
	}
	getDriverCounts() {
		return this.driverCounts$.asObservable();
	}

	private _filterQuote(res) {
		// attach a min max to response for green/red
		let min = Number.MAX_VALUE;
		let max = -Number.MAX_VALUE;
		res.quote.map((q) => {
			if (q.quote == null) q.quote = 0;
			q.quote = Number(q.quote.toFixed(2));
			if (q.quote < min) min = q.quote;
			if (q.quote > max) max = q.quote;
			return q;
		});
		res.quoteCurb.map((q) => {
			if (q.quote == null) q.quote = 0;
			q.quote = Number(q.quote.toFixed(2));
			if (q.quote < min) min = q.quote;
			if (q.quote > max) max = q.quote;
			return q;
		});
		res.min = min;
		res.max = max;
		return res;
	}
	getAddress() {}
	getYards() {
		return this.httpService.getYards();
	}
	getTicket(id: string) {
		return this.httpService.getTicket(id);
	}
	decodeVIN(VIN) {
		return this.http.get<VINNumber>(
			`${this.baseapi}${ResourceConfig.VinTranslation}${VIN}`
		);
	}
	getCustomQuestionMap() {
		return this.http.get<question[]>(
			`${this.baseapi}${ResourceConfig.GetQuestions}${this.retrieveS3GroupId()}`
		);
	}
	deleteTicket(ticketNum: number) {
		return this.http.get(
			`${this.baseapi}${ResourceConfig.deleteTicket}${ticketNum}`
		);
	}
}