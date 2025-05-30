import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, take, tap } from 'rxjs/operators';
import {
	quoteInfo,
	quoteToName,
	yardLocation,
} from 'src/app/interfaces/call-center.interface';
import { Subscription } from 'rxjs';
import { TicketService } from 'src/app/services/ticket.service';
import { MatDialog } from '@angular/material/dialog';
import { PopupQuestionComponent } from 'src/app/admin/componets/popup-question/popup-question.component';
import { AdminService } from 'src/app/services/admin.service';
import { AdminConfig } from 'src/app/config/admin.routes.config';
import { steelPrice, yardInfo } from 'src/app/interfaces/admin-interface';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AddressService } from 'src/app/services/address.service';
import { log } from 'console';

@Component({
	selector: 'app-quote-price',
	templateUrl: './quote-price.component.html',
	styleUrls: ['./quote-price.component.scss'],
})
export class QuotePriceComponent implements OnInit, OnDestroy {
	@Output() onYardUpdate = new EventEmitter<any>();
	alternateAlgorithm = false;
	@Input() towing: FormControl;
	@Input() price: FormControl;
	@Input() distance: FormControl;

	@Input() YardName = '';
	@Input() YardLocation = '';
	@Input() selectedYard = 0;
	preferredYard = 0;
	streetAddress = '';
	streetAddressDistance = false;

	// @Input() yard: FormControl;

	quoteSize: quoteToName[] = [];
	quoteCurb: quoteToName[] = [];
	originalQuoteSize: quoteToName[] = [];
	originalQuoteCurb: quoteToName[] = [];
	quoteMin = 0;
	quoteMax = 0;
	quoteHeader = [];
	steelConfig: any = [];
	faQuestionCircle = faQuestion;
	singPriceEnabled = false;
	negotiatedPriceLimit = null;
	negotiatedPriceLimitMin = null;
	negotiatedPriceEnabled = false;
	errorMessage = false;
	ticketId = 0;
	yards: yardLocation[] = [];
	yardConfig: yardInfo[] = [];
	selectedQuote = 0;
	finalDistance = 0;
	towingEnabled = { finalDistance: "0" }
	// yards: any = []
	private subscriptions: Subscription[] = [];

	constructor(
		private ticketService: TicketService,
		private adminService: AdminService,
		private ActivatedRoute: ActivatedRoute,
		private clientService: HttpClientService,
		private addressService: AddressService,
		private cd: ChangeDetectorRef,

	) {
		if (this.ActivatedRoute.snapshot.params.ticketId) {
			this.ticketId = parseInt(this.ActivatedRoute.snapshot.params.ticketId);
			console.log('hel', this.ticketId);
		}
		console.log('ticketId', this.ticketId);
	}

	// changeTowingToggle(stat) {
	// 	this.towing.setValue(stat);
	// }
	quote;
	async initForm() {
		console.log("🚀 ~ QuotePriceComponent ~ selectedYard:", this.selectedYard)

		this.steelConfig = await this.adminService.getSteelConfig().toPromise();
		console.log("🚀 ~ QuotePriceComponent ~ initForm ~ steelConfig:", this.steelConfig)

		this.ticketService.quote$.subscribe((quote: quoteInfo) => {
			console.log('quoteCurb', quote.quoteCurb);
			this.quote = quote;
			this.quoteSize = quote.quote;
			this.originalQuoteSize = quote.quote;
			this.quoteCurb = quote.quoteCurb;
			this.addressService.series$
				.pipe(take(1))
				.subscribe((series) => {
					console.log(this.quoteCurb[0].quote);

					if (series && this.quoteCurb[0].quote == 0) {
						this.errorMessage = true
					}
					else {
						this.errorMessage = false
					}
				});

			if (quote.quoteCurb.length > 0 && quote.quoteCurb[0].quote == 0) {
				quote.quoteCurb = quote.quote
			}
			this.originalQuoteCurb = quote.quoteCurb;

			console.log("Kharab", quote.quoteCurb)
			this.quoteHeader = quote.quote;
			this.selectQuote(this.selectedQuote);
			//this.distance.setValue(false);
		});

		// console.log(this.yard.value)
		// const yards = await this.ticketService.getYards().toPromise();
		// this.yards = yards.filter((item) => { return item.S3ClientId === this.yard.value })

		this.adminService.getAlternateAlgorithm().subscribe((data: any) => {
			this.alternateAlgorithm = data;
		});
	}
	selectQuote(q) {
		this.selectedQuote = q;
		this.negotiatedPriceEnabled = this.steelConfig[0].NegotiatedPriceEnabled;

		if (this.steelConfig.length && !this.steelConfig[0].isSinglePrice) {
			this.quoteMin = this.quoteCurb[q].quote;
			this.quoteMax = this.quoteSize[q].quote;
			if (this.negotiatedPriceEnabled) {
				this.negotiatedPriceLimit = (
					this.quoteMax +
					this.quoteMax * (this.steelConfig[0].negotiatedPriceLimit / 100)
				).toFixed(2);

				this.negotiatedPriceLimitMin = (
					this.quoteMin -
					this.quoteMin * (this.steelConfig[0].negotiatedPriceLimit / 100)
				).toFixed(2);
			} else {
				this.negotiatedPriceLimit = null;
				this.negotiatedPriceLimitMin = null;
			}
		}

		if (this.steelConfig.length && this.steelConfig[0].isSinglePrice) {
			this.negotiatedPriceLimit = 99999999;
			this.singPriceEnabled = this.steelConfig[0].isSinglePrice;
			let settings =
				this.steelConfig[0].biddingSetup == 'highest'
					? this.quote.max
					: this.quote.min;
			this.quoteSize = _.isMatch(this.quote.quote[0], { quote: settings })
				? this.quote.quote
				: [];
			this.quoteCurb = _.isMatch(this.quote.quoteCurb[0], { quote: settings })
				? this.quote.quoteCurb
				: [];

			if (this.quoteSize.length == 0) {
				this.quoteSize = this.originalQuoteSize
			}
			console.log("🚀 ~ QuotePriceComponent ~ selectQuote ~ this.quoteCurb:", this.quoteCurb)
			if (this.quoteCurb.length == 0) {
				this.quoteCurb = this.originalQuoteCurb

				if (this.quoteSize.length > 0) {
					this.quoteCurb = this.quoteSize

				}
			}
			if (this.quoteCurb.length > 0 && this.quoteCurb[0].quote == 0) {
				this.quoteCurb = this.quoteSize
			}
			console.log(this.quoteCurb, "curb")
			console.log(this.quoteSize, "size")
			console.log(this.quoteCurb, "curb")

			this.quoteHeader = this.quoteSize.length ? this.quoteSize : this.quoteCurb;

			this.quoteMin = this.quote.min;
			this.quoteMax = this.quote.max;
			if (this.negotiatedPriceEnabled) {
				this.negotiatedPriceLimit = (
					settings +
					settings * (this.steelConfig[0].negotiatedPriceLimit / 100)
				).toFixed(2);

				this.negotiatedPriceLimitMin = (
					settings -
					settings * (this.steelConfig[0].negotiatedPriceLimit / 100)
				).toFixed(2);
			} else {
				this.negotiatedPriceLimit = null;
				this.negotiatedPriceLimitMin = null;
			}
		}

		console.log('quoteMin', this.quoteMin, 'quoteMax', this.quoteMax);
	}
	ngOnInit(): void {
		console.log("🚀 ~ QuotePriceComponent ~ selectedYard:", this.selectedYard)

		this.subscriptions.push(
			this.clientService.getYards().subscribe((yards) => {
				this.yards = _.orderBy(yards, 'YardName', 'asc');
			})
		);

		this.streetAddressDistance = false;
		this.towing.setValue(false);

		this.subscriptions.push(
			this.addressService.street1$.subscribe((street1) => {
				if (street1) {
					this.streetAddress = street1;
					if (this.streetAddress && this.finalDistance < 50) {
						this.toggleTowing(true);
						this.cd.detectChanges();
						this.towing.setValue(true);
					}
				}
			})
		);

		this.subscriptions.push(
			this.addressService.street2$.subscribe((street2) => {
				console.log('Street 2:', street2);
			})
		);

		this.subscriptions.push(
			this.addressService.status$.subscribe((status) => {
				this.finalDistance = parseInt(status);
				if (this.finalDistance < 50) {
					this.streetAddressDistance = true;
					this.towingEnabled = { finalDistance: status };
					this.cd.detectChanges();
					document.getElementById('mat-input-21').focus();

					if (this.streetAddress && this.finalDistance < 50) {
						this.toggleTowing(true);
						this.cd.detectChanges();
						this.towing.setValue(true);
					}
				} else if (this.finalDistance > 50) {
					this.streetAddressDistance = false;
					this.towing.setValue(false);
				} else {
					this.streetAddressDistance = true;
				}
			})
		);

		if (this.streetAddress && this.finalDistance > 50) {
			this.towing.setValue(false);
		}

		this.subscriptions.push(
			this.clientService.getAdminYards().subscribe((yards) => {
				this.yardConfig = _.orderBy(yards, 'YardName', 'asc');
				this.adminService.getPreferredYard().subscribe((data: any) => {
					this.preferredYard = data;
					console.log('preferredYard', yards);
				});
			})
		);

		this.cd.detectChanges();
		this.initForm();
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach(sub => sub.unsubscribe());
	}

	toggleTowing(event: any) {
		// Event will contain the value of the slide toggle
		const isChecked = event.checked;
		console.log(
			this.streetAddress + ' ' + this.streetAddressDistance,
			'PTA NAI CHALE GA'
		);
		if (
			isChecked == true &&
			(!this.streetAddress || !this.streetAddressDistance)
		) {
			alert('Address/Distance must be within range.');
			this.towing.setValue(false);
			setTimeout(() => {
				this.towing.setValue(false);
			});
		}
		this.cd.detectChanges()
		//console.log('Slide toggle checked:', isChecked);

		// You can perform any additional logic here
	}
	getDistance(event) {
		this.cd.detectChanges()
		this.selectedYard = event.value;
		console.log('event', event);
		console.log(this.streetAddress, this.finalDistance);
		if (this.streetAddress && this.finalDistance < 50) {
			this.toggleTowing(true)
			this.cd.detectChanges()
			this.towing.setValue(true);
		}

		this.onYardUpdate.emit(event);
		this.cd.detectChanges()
	}
	dropdownChange(event) {

		const selectedOption = event.source.selected;
		const newId = selectedOption ? selectedOption._element.nativeElement.getAttribute('newId') : null;
	  
		console.log('New ID:', newId);
		console.log('Selected Yard:', selectedOption.value);


	}
	onSelectionChange(event: any) {
		this.getDistance(event);
		this.dropdownChange(event);
	}
}