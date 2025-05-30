import {
	Component,
	OnDestroy,
	OnInit,
	Output,
	EventEmitter,
	ChangeDetectorRef,
} from '@angular/core';
import Swal from 'sweetalert2';
import {
	AbstractControl,
	FormArray,
	FormBuilder,
	FormControl,
	FormGroup,
	FormGroupDirective,
	NgForm,
	ValidatorFn,
	Validators,
} from '@angular/forms';
import { TicketService } from 'src/app/services/ticket.service';
import {
	catchError,
	debounceTime,
	map,
	mergeAll,
	take,
	takeUntil,
} from 'rxjs/operators';
import { NotificationService } from '../../services/notification.service';
import {
	Call,
	makeModel,
	model,
	series,
	ticket,
	vehicleMake,
	vehicleSize,
	vendor,
	yardLocation,
	confirmDialog,
	VINNumber,
	calenderColors,
} from 'src/app/interfaces/call-center.interface';
import { HttpParams } from '@angular/common/http';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { HttpClientService } from 'src/app/services/http-client.service';
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { combineLatest, merge, of, pipe, Subject } from 'rxjs';
import { DistanceService } from 'src/app/services/distance.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { ActivatedRoute } from '@angular/router';
import { truncate } from 'fs';
import { MatDialog } from '@angular/material/dialog';
import { SetVendorComponent } from 'src/app/dialogComponents/set-vendor/set-vendor.component';
import { ConfirmDialogComponent } from 'src/app/dialogComponents/confirm-dialog/confirm-dialog.component';
import { state } from 'src/app/interfaces/data.interface';
import { decode } from 'node:punycode';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { classToWeight, yardInfo } from 'src/app/interfaces/admin-interface';
import { AdminService } from 'src/app/services/admin.service';
import { AdminConfig } from 'src/app/config/admin.routes.config';
import { PopupQuestionComponent } from 'src/app/admin/componets/popup-question/popup-question.component';
import { AgmCoreModule } from '@agm/core';
import { AddressService } from '../../services/address.service';

@Component({
	selector: 'app-new-ticket',
	templateUrl: './new-ticket.component.html',
	styleUrls: ['./new-ticket.component.scss'],
})
export class NewTicketComponent implements OnInit, OnDestroy {
	destroy$: Subject<boolean> = new Subject();
	yardConfig: yardInfo[] = [];

	temp = [
		{
			id: 3063,
			S3GroupId: 100,
			questionText: 'has engine',
			priceAdjId: 3341,
			priceAdj: { id: 3341, adj: -7, isPercent: false },
		},
		{
			id: 3064,
			S3GroupId: 100,
			questionText: 'alloy wheel',
			priceAdjId: 3340,
			priceAdj: { id: 3340, adj: 12, isPercent: true },
		},
		{
			id: 3065,
			S3GroupId: 100,
			questionText: 'converter',
			priceAdjId: 3342,
			priceAdj: { id: 3342, adj: 15, isPercent: false },
		},
		{
			id: 3066,
			S3GroupId: 100,
			questionText: 'doors',
			priceAdjId: 3343,
			priceAdj: { id: 3343, adj: 12, isPercent: true },
		},
	];
	ticketForm: FormGroup;
	customQuestionsForm: FormGroup = new FormGroup({});
	isPurchased: boolean = false;
	isFinished: boolean = false;
	submitted: boolean = false;
	addressFound: boolean = null; //3 state boolean...
	viewDate: Date = new Date();
	vehicleSizes: vehicleSize[] = [];
	vehicleMake: vehicleMake[] = [];
	vehicleMakeFiltered: vehicleMake[] = []; //used to search
	vehicleModelFiltered: model[] = []; //filtered by make on select and search
	vehicleMakesAll: any[] = [];
	vehicleModelsAll: any[] = [];
	vehicleModelAll: model[] = [];
	editId: any;
	series: any[] = [];
	seriesAll: any[] = [];
	vendors: vendor[] = [];
	DriverTickets: CalendarEvent[] = [];
	yards: yardLocation[] = [];
	states: state[] = [];
	confirmValidParentMatcher = new ConfirmValidParentMatcher();
	view: CalendarView = CalendarView.Week;
	CalendarView = CalendarView;
	driver: any;
	questionsLoaded = false;
	formatted_address = '';
	addressDetails='';
	i = 1;
	daysInWeek = 7;
	formFields = [];
	isLoading = false;
	//date
	selectedDate: Date;
	carSizeWeight: classToWeight[] = [];
	towingMaxRadius = 0;
	vinDecoderTrigger = false;
	timer = null;
	closestYard: any = {};
	oldData: any = {};
	preferredYard = 0;
	buttonDisabled: boolean = false;
	finalDistance = 0
	popupShown = false;


	constructor(
		private fb: FormBuilder,
		private notificationService: NotificationService,
		private ticketService: TicketService,
		private clientService: HttpClientService,
		private distanceService: DistanceService,
		private route: ActivatedRoute,
		private dialog: MatDialog,
		private breakpointObserver: BreakpointObserver,
		private cd: ChangeDetectorRef,
		private router: Router,
		private adminService: AdminService,
		private addressService: AddressService
	) {
		console.log(this.addressService, 'saraib');
	}
	carAPILoginToken: string = '';

	// Function to deep compare two objects
	deepEqual(obj1: any, obj2: any): boolean {
		console.log(obj1, 'obj1');
		console.log(obj2, 'obj2');

		if (obj1 === obj2) return true;

		if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) return false;

		let keys1 = Object.keys(obj1);
		let keys2 = Object.keys(obj2);

		if (keys1.length !== keys2.length) return false;

		for (let key of keys1) {
			if (!keys2.includes(key) || !this.deepEqual(obj1[key], obj2[key])) return false;
		}

		return true;
	}

	ngOnInit(): void {
		console.log("check how many times it runs")

		this.adminService.getCarAPILogin().subscribe((data) => {
			console.log('dataCarLogin', data);
			this.carAPILoginToken = data['token'];
		});

		const CALENDAR_RESPONSIVE = {
			small: {
				breakpoint: '(max-width: 576px)',
				daysInWeek: 2,
			},
			medium: {
				breakpoint: '(max-width: 768px)',
				daysInWeek: 3,
			},
			large: {
				breakpoint: '(max-width: 960px)',
				daysInWeek: 5,
			},
		};

		this.breakpointObserver
			.observe(
				Object.values(CALENDAR_RESPONSIVE).map(({ breakpoint }) => breakpoint)
			)
			.pipe(takeUntil(this.destroy$))
			.subscribe((state: BreakpointState) => {
				const foundBreakpoint = Object.values(CALENDAR_RESPONSIVE).find(
					({ breakpoint }) => !!state.breakpoints[breakpoint]
				);
				if (foundBreakpoint) {
					this.daysInWeek = foundBreakpoint.daysInWeek;
				} else {
					this.daysInWeek = 7;
				}
				this.cd.markForCheck();
			});

		this.customQuestionsForm;
		// let controls = this.temp.map((q) => {
		// 	return this.fb.group({
		// 		answeredYes: ['true'],
		// 		questionId: q.id,
		// 		text: q.questionText
		// 	})
		// });
		// this.customQuestionsForm.addControl(this.temp[0].id.toString(), new FormControl('true'));
		this.ticketForm = this.fb.group(
			{
				notes: [''],
				tow: [true],
				distance: [''],
				price: ['', []],
				//tab 1 seller
				Address: [''],
				street1: ['', [this.addressCheck.bind(this)]],
				street2: [''],
				city: [''],
				state: [''],
				zip: [''],
				name: [
					'',
					[
						this.ticketForm?.controls?.ticketNumber?.value ? '' : Validators.required,
					],
				],
				callerLastName: [
					'',
					[
						this.ticketForm?.controls?.ticketNumber?.value ? '' : Validators.required,
					],
				],
				email: [
					'',
					[
						this.ticketForm?.controls?.ticketNumber?.value ? '' : Validators.required,
						Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
					],
				],
				phone: [
					'',
					[
						this.ticketForm?.controls?.ticketNumber?.value ? '' : Validators.required,
						Validators.minLength(6),
						Validators.maxLength(20),
					],
				], //Validators.pattern("^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]\\d{3}[\\s.-]\\d{4}$")
				//seller vendor
				vendor: [''],
				//tab 2 vehicle
				VIN: [''],
				curbWeight: [''],
				year: [''],
				make: [''],
				model: [''],

				series: [''],
				vehicleSize: [''],
				color: [''],
				odometer: [''],
				titleState: ['', [this.titleCheck.bind(this)]],
				titleNumber: ['', [this.titleCheck.bind(this)]],
				hasTitle: [false],
				//tab 3 schedule
				yard: [''],
				dateTime: [''],
				dateTimeNumber: [null],
				driver: ['', [this.addressCheck.bind(this)]],
				driverId: [''],
				towVendorId: [null],
				// hidden to track tickets
				status: [''],
				ticketNumber: [null],
				//found by address
				lat: [''],
				long: [''],
				questionAnswers: [''],
			},
			{ validators: [this.test.bind(this)] }
		);

		this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
			if (params.ticketId && params.ticketId != '0') {
				console.log(params.ticketId, 'params.ticketId');
				this.editId = params.ticketId
				
				this.ticketService.getTicket(params.ticketId).subscribe((ticket: Call) => {
					this.setTicket(ticket);
					this.initConfigs();
					this.setFormHooks();
					this.setCustomQuestions(ticket.questions);
					if (ticket.questions) {
						this.ticketForm.patchValue(
							{
								questionAnswers: ticket.questions,
							},
							{ emitEvent: false }
						);
						console.log("🚀 ~ NewTicketComponent ~ .subscribe ~ this.ticketForm Akhri ye Wala:", this.ticketForm)

						this.ticketService.updateQuote(this.ticketForm);
					}
				});
			} else {
				this.initConfigs();
				this.setFormHooks();
				this.setCustomQuestions();
			}
		});

		// this.ticketForm.statusChanges;
		console.log(Object.keys(this.ticketForm.value));

		this.formFields = Object.keys(this.ticketForm.value);

		// combineLatest([
		// 	this.ticketService.getYards(),
		// 	this.ticketService.getVehicleModel(),
		// 	this.ticketService.getVehicleSizes()
		// ]).pipe(map(([yards, allMakes, vehicleSize]) => ({ yards, allMakes, vehicleSize }))).subscribe((obj) => {
		// 	this.vehicleSizes = obj.vehicleSize;
		// })

		this.clientService.getAdminYards().subscribe((yards) => {
			this.yardConfig = _.orderBy(yards, 'YardName', 'asc');
			this.adminService.getPreferredYard().subscribe((data: any) => {
				this.preferredYard = data;
			});
		});
	}

	setVendorFields(id: number) {
		const vendor = this.vendors.find((vendor) => vendor.id == id);
		console.log(vendor);

		this.ticketForm.patchValue(
			{
				name: vendor.contactName,
				phone: vendor.phoneNumber,
				street1: vendor.address.street1,
				street2: vendor.address.street2,
				city: vendor.address.city,
				state: vendor.address.state,
				zip: vendor.address.zip,
				lat: vendor.address.latitude,
				long: vendor.address.longitude,
			},
			{ emitEvent: false }
		);
		this.addressFound = true;
		this.ticketService.updateQuote(this.ticketForm);
	}
	test(AC: any): ValidatorFn {
		return (AC) => {
			return null;
		};
	}
	print() {
		window.print();
	}
	setCustomQuestions(questions: any = []) {
		this.ticketService.getCustomQuestionMap().subscribe((questionMap) => {
			const formQuestions = questionMap.map((question) => {
				let answer = null;
				let yesNo = null;
				if (questions.length > 0) {
					answer = questions.find((q) => {
						return q.questionId == question.id;
					});
					if (answer) {
						yesNo = answer.answeredYes ? 'true' : 'false';
					}
				}
				return this.fb.group({
					answeredYes: [yesNo],
					questionId: [question.id],
					text: [question.questionText],
					priceAdj: [question.priceAdj.adj],
				});
			});
			this.customQuestionsForm.setControl(
				'questions',
				this.fb.array(formQuestions)
			);
			this.questionsLoaded = true;
		});
	}
	setTicket(t: Call) {
		const pickupDate = new Date(t.pickupDate);

		// Format the date to 'YYYY-MM-DDTHH:mm' format for the dateTime input
		const formattedDateTime = this.formatDateToDateTimeLocal(pickupDate);


		const a = t?.Address !== null ? t?.Address?.split('+=') : [];
		this.isFinished = t.finished;
		this.isPurchased = !!(
			// t.status == 'dropoff' ||
			// t.status == 'pickup' ||
			t.status == 'scheduled'
		);
		console.log('isPurchased', t);
		let dateEvent1 = {
			start: pickupDate,
			title: `Selected`,
			color: calenderColors['finished'],
			data: {},
		}

		this.DriverTickets = [dateEvent1]
		this.ticketForm.setValue({
			notes: t.notes,
			tow: t.towed,
			distance: t.distance,
			price: t.negotiatedPrice,
			Address: t.Address,
			street1: a.length ? a[0] : '',
			street2: a.length ? a[1] : '',
			city: a.length ? a[2] : '',
			zip: a.length ? a[3] : '',
			state: a.length ? a[4] : '',
			name: t.callerName,
			callerLastName: t.callerLastName,
			phone: t.phoneNumber,
			email: t.email,
			vendor: t.VendorId,
			VIN: t.VIN,
			curbWeight: t.curbWeight,
			year: t.year,
			make: t.Make,
			model: t.Model,
			series: t.Series,
			vehicleSize: t.vehicleSize,
			color: t.color,
			odometer: t.odometer,
			titleState: t.titleState,
			titleNumber: t.titleNum,
			hasTitle: t.proofDocs,
			yard: t.chosenYardId,
			dateTime: formattedDateTime,


			dateTimeNumber: t.pickupDateNumber,
			driver: t?.driver?.name || '',
			driverId: t?.driver?.id || '',
			towVendorId: t.VendorIdPickup,
			status: t.status,
			ticketNumber: t.callTicket,
			//addressDetails:this.addressDetails,
			lat: t.latitude,
			long: t.longitude,
			questionAnswers: '',
		});
		this.addressDetails = t.addressDetails

		combineLatest([
			this.ticketService.getYards(),
			// this.ticketService.getVehicleModel(),
			// this.ticketService.getVehicleSizes(),
			this.clientService.getVendors(),
			this.clientService.getStates(),
		])
			.pipe(
				map(([yards, vendors, states]) => ({
					yards,
					vendors,
					states,
				}))
			)
			.subscribe((obj) => {
				console.log("🚀 ~ NewTicketComponent ~ .subscribe ~ obj:", obj)
				
				this.yards = _.orderBy(obj.yards, 'YardName', 'asc');
				// if (!this.ticketForm.get('yard').value) this.ticketForm.get('yard').setValue(obj.yards[0].S3ClientId, { emitEvent: false });
				// this.vehicleMake = _.orderBy(obj.allMakes.make, 'make', 'asc');
				// this.vehicleModelAll = obj.allMakes.model;
				// console.log('vehicleModelAll', this.vehicleModelAll);
				// this.vehicleSizes = obj.VehicleSize;
				this.states = obj.states;
				console.log(this.states);

				//only show vendor where tow = false
				this.vendors = obj.vendors.filter((vendor) => !vendor.towingVendor);
				this.updateModel();
				this.updateMake();



				this.ticketService.updateQuote(this.ticketForm);

		
		
				this.onAutocompleteSelected(JSON.parse(t.addressDetails))
			});

		this.adminService.getTowingCost().subscribe((config) => {
			config.forEach((item) => {
				console.log(item.maximumDistance, 'item.maximumDistanceitem.maximumDistance');

				this.towingMaxRadius = item.maximumDistance;
			});
		});

		//this.getDistance();

		// let event = {formatted_address: t.Address}
		// this.onAutocompleteSelected(event)
		
	}
	setFormHooks() {
		//any item that can change the qoute goes here
		//add custom questions and recalls
		console.log("🚀 ~ NewTicketComponent ~ .subscribe ~ this.ticketForm:", this.ticketForm)
		merge(
			this.ticketForm.controls['curbWeight'].valueChanges,
			this.ticketForm.controls['distance'].valueChanges,
			this.ticketForm.controls['model'].valueChanges,
			this.ticketForm.controls['hasTitle'].valueChanges,
			this.ticketForm.controls['series'].valueChanges,
			this.ticketForm.controls['tow'].valueChanges,
			this.ticketForm.controls['vehicleSize'].valueChanges,
			this.ticketForm.controls['year'].valueChanges
		)
			.pipe(debounceTime(250), takeUntil(this.destroy$))
			.subscribe(() => {
				this.ticketService.updateQuote(this.ticketForm);
			});
		// find address via google
		merge(
			this.ticketForm.controls['street1'].valueChanges,
			this.ticketForm.controls['street2'].valueChanges,
			this.ticketForm.controls['city'].valueChanges,
			this.ticketForm.controls['state'].valueChanges,
			this.ticketForm.controls['zip'].valueChanges
		)
			.pipe(debounceTime(250), takeUntil(this.destroy$))
			.subscribe((val) => {
				this.findAddress();
				console.log('Street 1 value changed:', val);
				console.log('Street 2 value changed:', val.street2);

				this.addressService.updateStreet1(val);
				this.addressService.updateStreet2(val.street2);
				console.log('Street 1 value changed:', val.street1);
				console.log('Street 2 value changed:', val.street2);
			});
		this.ticketForm.controls['make'].valueChanges
			.pipe(takeUntil(this.destroy$))
			.subscribe((val) => {
				// console.log('value change make')
				this.updateMake(val);
				this.updateModel();
			});
		this.ticketForm.controls['model'].valueChanges
			.pipe(takeUntil(this.destroy$))
			.subscribe((val) => {
				this.updateModel(val);
			});
		this.ticketForm.controls['vendor'].valueChanges
			.pipe(takeUntil(this.destroy$))
			.subscribe((id) => {
				this.setVendorFields(id);
			});
	}
	initConfigs() {
		combineLatest([
			this.ticketService.getYards(),
			// this.ticketService.getVehicleModel(),
			// this.ticketService.getVehicleSizes(),
			this.clientService.getVendors(),
			this.clientService.getStates(),
		])
			.pipe(
				map(([yards, vendors, states]) => ({
					yards,
					vendors,
					states,
				}))
			)
			.subscribe((obj) => {
				this.yards = _.orderBy(obj.yards, 'YardName', 'asc');
				// if (!this.ticketForm.get('yard').value) this.ticketForm.get('yard').setValue(obj.yards[0].S3ClientId, { emitEvent: false });
				// this.vehicleMake = _.orderBy(obj.allMakes.make, 'make', 'asc');
				// this.vehicleModelAll = obj.allMakes.model;
				// console.log('vehicleModelAll', this.vehicleModelAll);
				// this.vehicleSizes = obj.VehicleSize;
				this.states = obj.states;
				console.log(this.states);

				//only show vendor where tow = false
				this.vendors = obj.vendors.filter((vendor) => !vendor.towingVendor);
				this.updateModel();
				this.updateMake();

				this.ticketService.updateQuote(this.ticketForm);
			});

		this.adminService.getTowingCost().subscribe((config) => {
			config.forEach((item) => {
				console.log(item.maximumDistance, 'item.maximumDistanceitem.maximumDistance');

				this.towingMaxRadius = item.maximumDistance;
			});
		});
	}
	vehicleData = [];
	yearChange(v) {
		console.log(v);

		this.adminService.getYearData(this.carAPILoginToken, v).subscribe((data) => {
			console.log('vehicleMakeFiltered', data);
			this.vehicleMakeFiltered = data['data'];
			this.vehicleMakesAll = data['data'];
		});
	}
	changeMake() {
		const year = this.ticketForm.get('year').value;
		const make = this.ticketForm.get('make').value;
		if (year && make) {
			this.adminService
				.getMakeData(this.carAPILoginToken, year, make)
				.subscribe((data) => {
					console.log('data', data);
					this.vehicleModelFiltered = data['data'];
					this.vehicleModelsAll = data['data'];
				});
		}
	}
	changeModel() {
		const year = this.ticketForm.get('year').value;
		const make = this.ticketForm.get('make').value;
		const model = this.ticketForm.get('model').value;
		const modelId = this.vehicleModelFiltered.find(
			(m) => m['name'] === model
		);
		console.log(modelId["name"]); //try now

		this.ticketForm.controls.model.setValue(modelId["name"]);
		const element = document.querySelector('#myModel');
		element.setAttribute('data_id', (modelId["id"].toString()));

		if (year && make && model) {
			this.adminService
				.getModelTrims(this.carAPILoginToken, year, make, model)
				.subscribe((data) => {
					console.log('data', data);
					this.series = data['data'];
					this.seriesAll = data['data'];
				});
			// this.vehicleModelFiltered = [
			// 	...new Set(
			// 		this.vehicleData
			// 			.filter((item) => {
			// 				return item.MAKE === make && item.iYEAR === year;
			// 			})
			// 			.map((item) => item.MODEL)
			// 	),
			// ].map((model) => ({ model: model, make: make }));
		}
	}
	updateMake(makeValue: string = '') {
		// if (makeValue) {
		// 	this.vehicleMakeFiltered = this.vehicleMake.filter((make) => {
		// 		return this._compareValue(make.make, makeValue);
		// 	});
		// } else {
		// 	this.vehicleMakeFiltered = this.vehicleMake;
		// }
	}
	filterDropdowns(target, event) {
		const value = event.target.value;
		if (target === 'make') {
			if (value === '' || value === null || value === undefined) {
				this.vehicleMakeFiltered = this.vehicleMakesAll;
			} else {
				this.vehicleMakeFiltered = this.vehicleMakesAll.filter((make) => {
					return this._compareValue(make.name, value);
				});
			}
		} else if (target === 'model') {
			if (value === '' || value === null || value === undefined) {
				this.vehicleModelFiltered = this.vehicleModelsAll;
			} else {
				this.vehicleModelFiltered = this.vehicleModelsAll.filter((model) => {
					return this._compareValue(model.name, value);
				});
			}
		} else if (target === 'series') {
			if (value === '' || value === null || value === undefined) {
				this.series = this.seriesAll;
			} else {
				this.series = this.seriesAll.filter((series) => {
					return this._compareValue(series.description, value);
				});
			}
		}
	}
	updateModel(modelValue: string = '') {
		const make = this.ticketForm.controls.make.value;
		const year = this.ticketForm.controls.year.value;
		this.updateSeries();
	}
	updateSeries() {
		const model = this.ticketForm.controls.model.value;
		const year = this.ticketForm.controls.year.value;
	}
	setView(selected: CalendarView) {
		console.log(this.view, 'this.viewthis.view');

		this.view = selected;
	}
	updateVendors() { }
	//used to compare search string and filter list: contains A in ACURA
	private _compareValue(base: string, compare: string): boolean {
		if (compare) {
			return base.toLowerCase().includes(compare.toLowerCase());
		}
		return true;
	}
	//override search input
	displayName(vendorId) {
		// console.log(vendorId);
		if (vendorId) {
			const selected = this.vendors.filter(
				(vendor: vendor) => vendor.id == vendorId
			);
			return selected[0]?.businessName;
		}
		return null;
	}
	async setVehicleSize() {
		const model = this.ticketForm.get('model').value;
		const year = this.ticketForm.get('year').value;
		const make = this.ticketForm.get('make').value;
		const series = this.ticketForm.get('series').value;
		const seriesId = this.series.find((s) => s['description'] === series)?.id;
		console.log('seriesId', seriesId);
		this.addressService.updateSeries(seriesId);
		this.adminService
			.getVehicleTrim(this.carAPILoginToken, seriesId)
			.subscribe((data) => {
				this.ticketForm.controls.curbWeight.setValue(
					data['make_model_trim_body'].curb_weight || null
				);
				this.ticketForm.controls.vehicleSize.setValue(
					data['make_model_trim_body'].type || null
				);
			});
		// await this.adminService
		// 	.getVehicleClass()
		// 	.subscribe((config: classToWeight[]) => {
		// 		this.carSizeWeight = config.map((item) => {
		// 			console.log('item>>>>', item);
		// 			if (item.S3GroupId === AdminConfig.defaultId) delete item.id;
		// 			item.curbWeight = item.weightTons * 2000;
		// 			if (item.weightTons === 0) item.weightTons = null;
		// 			item.delete = false;
		// 			item.S3GroupId = +this.adminService.retrieveS3GroupId();
		// 			return item;
		// 		});

		// 		if (modelValue) {
		// 			this.vehicleModelFiltered = this.vehicleData.filter((model) => {
		// 				return (
		// 					model.iYEAR === year &&
		// 					this._compareValue(model.MAKE, make) &&
		// 					this._compareValue(model.MODEL, modelValue)
		// 				);
		// 			});
		// 			console.log('vehicleModelFiltered', this.vehicleModelFiltered);
		// 			if (modelValue) {
		// 				let filtered = [];
		// 				filtered.push(...this.vehicleModelFiltered);
		// 				const carSizeData = this.carSizeWeight.filter((item) => {
		// 					return item.CarSize === filtered[0].vehicleClass;
		// 				});
		// 				console.log('carSizeData', carSizeData);
		// this.ticketForm.controls.vehicleSize.setValue(filtered[0].vehicleClass);
		// this.ticketForm.controls.curbWeight.setValue(
		// 	carSizeData[0]?.curbWeight || null
		// );
		// }
		// this.ticketService.getVehicleSize(modelValue, year).pipe(take(1)).subscribe((size: any) => {
		// 	console.log(size)
		// 	this.ticketForm.controls.vehicleSize.setValue(size.vehicleClass);
		// })
		// }
		// });
	}
	saveTicket() {
		//only some fields required to save. marked by Validators.required.




		console.log(this.ticketForm.value, this.ticketForm.get('tow').value);
		if (this.ticketForm.get('tow').value) {
			if (
				this.ticketForm.get('driver').value == '' ||
				this.ticketForm.get('driver').value == null ||
				this.ticketForm.get('driver').value == undefined
			) {
				alert('Please select a driver');
			} else if (
				this.ticketForm.get('dateTime').value == '' ||
				this.ticketForm.get('dateTime').value == null ||
				this.ticketForm.get('dateTime').value == undefined
			) {
				alert('Please select a date and time');
			} else {
				const ref = (this.submitted = false);
				this.checkPurchaseFields();
				this.ticketForm.markAllAsTouched();
				if (this.ticketForm.valid) {
					this.saveQoute();
				}
			}
		} else {
			const ref = (this.submitted = false);
			this.checkPurchaseFields();
			this.ticketForm.markAllAsTouched();
			if (this.ticketForm.valid) {
				this.saveQoute();
			}
		}

	}
	changeDateTime() {
		const dateTimeString = this.ticketForm.get('dateTime').value;
		console.log(dateTimeString, 'sddateTimeString');

		if (dateTimeString) {
			// Convert the string to a Date object
			const dateTime = new Date(dateTimeString);

			// Set the timestamp in another form control
			this.ticketForm.get('dateTimeNumber').setValue(dateTime.getTime());
		} else {
			// Handle the case where dateTimeString might be null or undefined
			this.ticketForm.get('dateTimeNumber').setValue(null);
		}
	}
	purchaseTicket(event) {
		console.log(event.target.value);

		//check fields based on checkboxes and many fields required to purchase.
		this.submitted = true;
		this.checkPurchaseFields();
		this.ticketForm.markAllAsTouched();
		if (this.ticketForm.valid) {
			const ref = this.dialog.open(ConfirmDialogComponent, {
				width: '400px',
				disableClose: true,
				data: {
					title: 'Purchase',
					message:
						'Are you sure you want to puchase? This will send it to the Yard.',
					cofirmButton: 'Purchase',
					denyButton: 'Cancel',
				},
			});
			ref.afterClosed().subscribe((val) => {
				if (val) {
					this.isPurchased = true;
					this.addressService.updatePurchasedStatus(true);

					this.saveQoute(false, true);
				}
			});
		}
	}
	saveQoute(noCreate = false, manualSave = false) {

		const tf = this.ticketForm.value;
		console.log(tf.curbWeight, "im curb")
		//S3GroupId will be added later down chain
		const ticket: Call = {
			callTicket: this.editId ? this.editId : tf.ticketNumber,
			S3GroupId: +this.ticketService.retrieveS3GroupId(),
			purchased: this.isPurchased,
			finished: this.isPurchased ? true : this.isFinished,
			notes: tf.notes,
			towed: tf.tow,
			distance: tf.distance,
			negotiatedPrice: tf.price,
			Address: this.toAddressString(tf),
			callerName: tf.name,
			callerLastName: tf.callerLastName,
			phoneNumber: tf.phone,
			email: tf.email,
			VendorId: tf.vendor, //seller vendor
			VIN: tf.VIN,
			curbWeight: tf.curbWeight != null ? tf.curbWeight : "",
			year: tf.year,
			Make: tf.make,
			Model: tf.model,
			Series: tf.series,
			vehicleSize: tf.vehicleSize,
			color: tf.color,
			odometer: tf.odometer,
			titleNum: tf.titleNumber,
			titleState: tf.titleState,
			proofDocs: tf.hasTitle,
			chosenYardId: tf.yard,
			//use number instead only
			pickupDate: this.ticketForm.get('dateTime').value,
			pickupDateNumber: parseInt(tf.dateTimeNumber),
			DriverId: tf.driverId,
			VendorIdPickup: tf.towVendorId,
			status: tf.status,
			latitude: tf.lat,
			addressDetails:this.addressDetails,
			longitude: tf.long,
			pickUpNotes: null,
			recalls: [],
			questions: JSON.stringify(this.customQuestionsForm.value.questions),
		};
		const obj = {
			ticket: ticket,
			noCreate: noCreate,
			manualSave: true,
		};
		console.log(obj, 'objobj');
		let newObj = obj;
		let oldObj = this.oldData;
		console.log(this.oldData, 'oldDataoldDataoldData');
		if (!this.editId) {

			delete newObj.ticket.callTicket;
		}
		if (Object.keys(oldObj).length > 0 && !this.editId) {

			delete oldObj.ticket.callTicket;
		}
		if (this.deepEqual(newObj, oldObj)) {
			Swal.fire({
				title: 'Warning',
				text: `No Change Detected`,
			});
		}
		else {


			this.ticketService.saveTicket(obj).subscribe((num: number) => {
				this.notificationService.success(`Ticket #${num} Saved`);
				this.oldData = obj
				console.log(this.oldData);

				this.ticketForm.controls.ticketNumber.setValue(num);
				const status = ticket.finished ? 'finished' : ticket.status;
				this.setTearStatus(status);
			});
		}
	}
	checkPurchaseFields() {
		this.ticketForm.controls.titleNumber.updateValueAndValidity();
		this.ticketForm.controls.street1.updateValueAndValidity();
		this.ticketForm.controls.titleState.updateValueAndValidity();
		// this.ticketForm.controls.dateValue.updateValueAndValidity();
		this.ticketForm.controls.dateTime.updateValueAndValidity();
		this.ticketForm.controls.driver.updateValueAndValidity();
	}
	segmentClicked(date: Date) {


		if (true) {
			let options: Intl.DateTimeFormatOptions = {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			};
			this.ticketForm
				.get('dateTime')
				.setValue(date.toLocaleString('default', options));
			this.ticketForm.get('dateTimeNumber').setValue(date.getTime());
		}
		let dateEvent = {
			start: date,
			title: `Selected`,
			color: calenderColors['finished'],
			data: {},
		}

		this.DriverTickets = [dateEvent]

		const formattedDate = this.formatDateToDateTimeLocal(date);
		this.ticketForm.get('dateTime').setValue(formattedDate);
		this.ticketForm.get('dateTimeNumber').setValue(date.getTime());
	}

	formatDateToDateTimeLocal(date: Date): string {
		const year = date.getFullYear().toString().padStart(4, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-based
		const day = date.getDate().toString().padStart(2, '0');
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');
		return `${year}-${month}-${day}T${hours}:${minutes}`;
	}
	cancelPurchase() {
		this.isPurchased = false;
		this.addressService.updatePurchasedStatus(false);
		this.saveQoute(false, true);
		this.setTearStatus('cancel');
	}
	openTicket() {
		this.ticketService
			.setFinished(false, this.ticketForm.controls.ticketNumber.value)
			.subscribe((res) => {
				this.isFinished = false;
				this.setTearStatus('cancel');
			});
	}
	setTearStatus(status: any) {
		if (['prod', 'production'].includes(process.env.NODE_ENV)) {
			const s3GroupId = +this.ticketService.retrieveS3GroupId();
			if (s3GroupId !== 102) return; //check if tear a part yard
			if (
				this.ticketForm.controls.ticketNumber.value &&
				['pickup', 'dropoff', 'finished', 'cancel'].includes(status)
			) {
				this.clientService
					.updateTearAPartStatus({
						ticket_id: this.ticketForm.controls.ticketNumber.value,
						status: status,
					})
					.subscribe(
						(res) => {
							console.log('Successfully updated tear a part!', res);
						},
						(error) => {
							console.log('Successfully updated tear a part!', error.message);
							this.notificationService.error(
								'Error! Cannot update status Tear A Part ticket #' +
								this.ticketForm.controls.ticketNumber.value
							);
						},
						() => { }
					);
			}
		} else {
			return;
		}
	}
	closeTicket() {
		const dialogRef = this.dialog.open(PopupQuestionComponent, {
			width: '450px',
			data: {
				title: 'Trash Ticket',
				question: `Are you sure you want to trash ticket #${this.ticketForm.controls.ticketNumber.value}? This ticket will no longer be available if you continue.`,
				confirm: 'Yes',
				deny: 'No',
				isconfirmed: false,
				otherData: {},
			},
		});
		dialogRef.afterClosed().subscribe((result) => {
			if (result && result.isconfirmed) {
				// this.ticketService.setFinished(true, this.ticketForm.controls.ticketNumber.value).subscribe((res) => {
				// 	this.isFinished = true;
				// });

				this.ticketService
					.deleteTicket(this.ticketForm.controls.ticketNumber.value)
					.subscribe(
						(res) => {
							console.log(
								'Successfully deleted ticket!',
								this.ticketForm.controls.ticketNumber.value
							);
							this.setTearStatus('closed');
						},
						(error) => {
							this.notificationService.error(
								'Error! Cannot delete ticket #' +
								this.ticketForm.controls.ticketNumber.value
							);
						},
						() => {
							this.router.navigate(['./tickets']);
						}
					);
			}
		});
	}
	setDriver(driver) {
		this.driver = driver;
		this.ticketForm.patchValue({
			driverId: driver.id,
			towVendorId: driver.vendorId || null,
			driver: driver.username,
		});
	}
	private findAddress() {
		//only find  when all address fields have a value.
		if (
			!!this.ticketForm.value.street1 &&
			(!!this.ticketForm.value.city || !!this.ticketForm.value.state) &&
			!!this.ticketForm.value.zip
		) {
			let addressStr =
				`${this.ticketForm.value.street1},+${this.ticketForm.value.street2},+${this.ticketForm.value.city},+${this.ticketForm.value.zip},+${this.ticketForm.value.state}`.replace(
					/\s/g,
					'+'
				);

			this.distanceService
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
						this.ticketForm.patchValue(
							{
								lat: coords.location.lat,
								long: coords.location.lng,
							},
							{ onlySelf: true, emitEvent: false }
						);
						this.addressFound = true;
						this.getDistance();
						this.cd.detectChanges();
						document.getElementById('mat-input-10').focus();
						document.getElementById('street-address-1').focus();
						document.getElementById('mat-input-10').focus();
						document.getElementById('mat-input-11').focus();
						return;
					}
					this.addressFound = false;
					return;
				});
		}
		this.cd.markForCheck();
	}

	getAddressByZip(event) {
		this.distanceService
			.zipCode(event)
			.pipe(
				catchError((err) => {
					console.log('err', err);
					this.addressFound = false;
					return of(false);
				})
			)
			.subscribe((geo: any) => {
				// console.log(geo)
				if (geo) {
					console.log('geo', geo);
					const result = geo.results[0];
					const coords = result.geometry;
					result.address_components.forEach((data) => {
						console.log(data);
						if (data.types.includes('administrative_area_level_1')) {
							this.ticketForm.controls.state.setValue(data.short_name);
						}
						if (data.types.includes('administrative_area_level_2')) {
							this.ticketForm.controls.city.setValue(data.short_name);
						}
						if (data.types.includes('locality')) {
							this.ticketForm.controls.street1.setValue(data.short_name);
						}
						if (data.types.includes('postal_code')) {
							this.ticketForm.controls.zip.setValue(data.short_name);
						}
					});

					this.ticketForm.patchValue({
						lat: coords.location.lat,
						long: coords.location.lng,
					});
					this.addressFound = true;
					this.cd.markForCheck();
					return;
				}
				return;
			});
		this.cd.markForCheck();
	}

	async getCarSizeWeight() {
		await this.adminService
			.getVehicleClass()
			.subscribe((config: classToWeight[]) => {
				this.carSizeWeight = config.map((item) => {
					console.log('item>>>>', item);
					if (item.S3GroupId === AdminConfig.defaultId) delete item.id;
					item.curbWeight = item.weightTons * 2000;
					if (item.weightTons === 0) item.weightTons = null;
					item.delete = false;
					item.S3GroupId = +this.adminService.retrieveS3GroupId();
					return item;
				});
			});
	}

	decodeVIN() {
		this.isLoading = true;
		this.getCarSizeWeight();
		const vinNumber = this.ticketForm.get('VIN').value;
		console.log(vinNumber);
		if (vinNumber.length == 17) {
			this.ticketService.decodeVIN(vinNumber).subscribe(
				(decoded) => {
					console.log('decoded', decoded);
					if (decoded) {
						const carSizeData = this.carSizeWeight.filter((item) => {
							return item.CarSize === decoded['Vehicle Class'];
						});
						// console.log(carSizeData);
						this.ticketForm.patchValue({
							make: decoded?.Make?.toUpperCase() || null,
							model: decoded?.Model || null,
							series: decoded?.Series || null,
							vehicleSize: decoded['Vehicle Class'] || null,
							year: decoded['Model Year'] || null,
							curbWeight: decoded.curbWeight || carSizeData[0]?.curbWeight || null,
						});
					}
				},
				(err) => {
					console.log('err', err);
					this.notificationService.error('VIN not found, Please verify the VIN');
					this.isLoading = false;
				},
				() => {
					this.isLoading = false;
				}
			);
		} else {
			this.notificationService.error('17 characters required for VIN');
			this.isLoading = false;
		}
	}
	getDistance(event: any = null) {

		if (event) {
			console.log('event', event);
			this.ticketForm.controls.yard.setValue(event.value);
		}
		if (this.preferredYard) {
			let distanceArray = [];
			let distance: any;
			let prefYard = {};
			let finalYard = {
				S3ClientId: 0,
				YardName: '',
				YardLocation: '',
				latitude: 0,
				longitude: 0,
			};
			this.yardConfig.forEach((yard) => {
				console.log(yard,'yardyardyardyardyard');
				console.log(this.preferredYard,'this.preferredYardthis.preferredYard');
				if (yard.Pk === this.preferredYard) {
					console.log('preferredYardpreferredYard', yard, this.preferredYard);
					prefYard = yard;
					if (this.yards.length) {
						finalYard = this.yards.filter(
							(yard) => yard.YardName === prefYard['YardName']
						)[0];
						console.log({
							lat: this.ticketForm.get('lat').value,
							long: this.ticketForm.get('long').value,
						}, "dist nai chala 0")
						let dist = this.distanceService.calcDistance(
							{
								lat: this.ticketForm.get('lat').value,
								long: this.ticketForm.get('long').value,
							},
							{ lat: finalYard.latitude, long: finalYard.longitude }
						);
						console.log(dist, "dist nai chala")
						this.finalDistance = dist
						distanceArray.push({
							id: finalYard.S3ClientId,
							distance: Math.round(dist),
							YardName: finalYard.YardName,
							YardLocation: finalYard.YardLocation,
							S3ClientId: finalYard.S3ClientId,
						});

						this.closestYard = _.minBy(distanceArray, 'distance');
						this.ticketForm.controls.yard.setValue(finalYard?.['id']);
						distance = this.closestYard?.distance;
						this.ticketForm.get('distance').setValue(Math.round(distance));
						console.log(Math.round(distance), 'Math.round(distance)');
					}
				}
			});
			this.cd.markForCheck();
			this.cd.detectChanges();
			this.cd.markForCheck();
			this.cd.detectChanges();
		} else {
			let distanceArray = [];
			this.closestYard = {};
			let yard: any;
			let distance: any;
			console.log(this.yards,'yards[i].latitude');
			
			if (this.yards.length) {
				for (let i = 0; i <= this.yards.length - 1; i++) {
					console.log(this.yards[i].latitude,'yards[i].latitude');
					
					if (typeof this.yards[i] !== 'undefined') {
						let dist = this.distanceService.calcDistance(
							{
								lat: this.ticketForm.get('lat').value,
								long: this.ticketForm.get('long').value,
							},
							{ lat: this.yards[i].latitude, long: this.yards[i].longitude }
						);
						this.finalDistance = dist
						distanceArray.push({
							id: this.yards[i].S3ClientId,
							distance: Math.round(dist),
							YardName: this.yards[i].YardName,
							YardLocation: this.yards[i].YardLocation,
							S3ClientId: this.yards[i].S3ClientId,
						});
					}
				}

				this.closestYard = _.minBy(distanceArray, 'distance');
				this.ticketForm.controls.yard.setValue(this.closestYard?.id);
				this.cd.detectChanges();
				this.cd.markForCheck();
				this.cd.detectChanges();


				distance = this.closestYard?.distance;
				console.log('closestYard2', this.closestYard);
			} else {
				yard = this.yards.filter(
					(yard) => this.ticketForm.get('yard').value == yard.S3ClientId
				);
				distance = this.distanceService.calcDistance(
					{
						lat: this.ticketForm.get('lat').value,
						long: this.ticketForm.get('long').value,
					},
					{
						lat: yard[0]?.latitude,
						long: yard[0]?.longitude,
					}
				);
			}
			this.closestYard = Object.keys(this.closestYard).length
				? this.closestYard
				: yard[0];
			this.finalDistance = distance
			this.cd.detectChanges();
			this.cd.markForCheck();
			this.cd.detectChanges();
			console.log('distance ye raha:', distance);
			if (distance) {
				this.addressService.updateStatus(parseFloat(distance).toFixed(2));

			}
			else {
				this.addressService.updateStatus("0");

			}
			if (Math.round(distance) > this.towingMaxRadius) {
				this.towingQuestion();
			}
			this.ticketForm.get('distance').setValue(Math.round(distance));
			this.cd.markForCheck();
			this.cd.detectChanges();
		}

		console.log("Address Distance Get")
		this.cd.detectChanges();
		document.getElementById('mat-input-10').focus();
		document.getElementById('street-address-1').focus();
		document.getElementById('mat-input-10').focus();
		document.getElementById('mat-input-11').focus();
		console.log("mere bad chala")
	}
	private titleCheck(control: AbstractControl) {
		const title = this.ticketForm?.get('hasTitle').value || false;
		if (title && !control.value) return { missingTitle: true };
		return null;
	}
	private addressCheck(control: AbstractControl) {
		const tow = this.ticketForm?.get('tow').value || false;
		const lat = this.ticketForm?.get('lat').value || false;
		const long = this.ticketForm?.get('long').value || false;
		if (tow && this.submitted && (!lat || !long)) return { missingAddress: true };
		return null;
	}
	private driverCheck(control: AbstractControl) {
		const tow = this.ticketForm?.get('tow').value || false;
		const lat = this.ticketForm?.get('lat').value || false;
		const long = this.ticketForm?.get('long').value || false;
		if (tow && this.submitted && (!lat || !long)) return { missingAddress: true };
		return null;
	}
	private dateCheck(control: AbstractControl) {
		const tow = this.ticketForm?.get('tow').value || false;
		const lat = this.ticketForm?.get('lat').value || false;
		const long = this.ticketForm?.get('long').value || false;
		if (tow && this.submitted && (!lat || !long)) return { missingAddress: true };
		return null;
	}
	private toAddressString(tf) {
		return `${tf.street1}+=${tf.street2}+=${tf.city}+=${tf.zip}+=${tf.state}`;
	}
	private fromAddressString() { }
	addVendor(e, vendor) {
		e.stopPropagation();
		e.preventDefault();
		const ref = this.dialog.open(SetVendorComponent, {
			width: '400px',
			height: '400px',
			data: {
				vendor: vendor,
			},
		});
		ref.afterClosed().subscribe((val) => {
			if (val) {
				this.clientService.getVendors().subscribe((vendors) => {
					this.vendors = vendors.filter((vendor) => !vendor.towingVendor);
				});
			}
		});
	}
	keyPress(event: any) {
		const pattern = /[0-9\+\-\(\)\ ]/;
		let inputChar = String.fromCharCode(event.charCode);
		if (event.keyCode != 8 && !pattern.test(inputChar)) {
			event.preventDefault();
		}
	}
	vinDecodeCharCheck(event: any) {
		const vinNumber = this.ticketForm.get('VIN').value;
		console.log('vinNumber', vinNumber);

		if (vinNumber.length >= 17) {
			this.vinDecoderTrigger = true;
			this.decodeVIN();
		}

		if (this.timer) {
			clearTimeout(this.timer);
		}

		this.timer = setTimeout(() => {
			if (
				this.vinDecoderTrigger &&
				vinNumber.length < 17 &&
				vinNumber.length > 0
			) {
				this.decodeVIN();
				console.log('No keyboard events trigger VIN Decoder');
			}
		}, 3000);
	}
	joinString(str: string) {
		const newStr = str.split(/(?=[A-Z])/);
		return newStr.join(' ');
	}
	onChangeQuestion(answerQuestions: any) {
		this.ticketForm.patchValue(
			{
				questionAnswers: answerQuestions.questions,
			},
			{ emitEvent: false }
		);
		console.log("nai ye wala")
		this.ticketService.updateQuote(this.ticketForm);
	}
	onAutocompleteSelected(event: any) {
		console.log(event.formatted_address, "formattedAddress")
		this.addressDetails=JSON.stringify(event)
		this.popupShown = false;
		this.formatted_address = event.formatted_address.replace(/\s/g, '+');
		this.ticketForm.controls.street1.setValue(event.formatted_address);
		this.getAddressByZip(this.formatted_address);

		if (event.address_components) {
			event.address_components.forEach((data) => {
				if (data.types.includes('administrative_area_level_1')) {
					console.log('state', data.short_name);
					this.ticketForm.controls.state.setValue(data.short_name);
				}
				if (data.types.includes('postal_code')) {
					this.ticketForm.controls.zip.setValue(data.short_name);
				}
				if (event.vicinity || data.types.includes('administrative_area_level_2')) {
					let city = event.vicinity ? event.vicinity.split(', ') : [];
	
					if (city.length > 1) {
						this.ticketForm.controls.street2.setValue(city[0]);
					}
					this.ticketForm.controls.city.setValue(
						event.vicinity ? (city.length > 1 ? city[1] : city[0]) : data.short_name
					);
				}
				// if (data.types.includes('locality')) {
				// 	this.ticketForm.controls.street1.setValue(event.formatted_address);
				// }
	
	
				this.cd.markForCheck();
				this.cd.detectChanges();
	
	
	
			});

			this.ticketForm.patchValue(
				{
					// street1: event.name,
					lat: event.geometry.location.lat,
					long: event.geometry.location.lng,
				},
				{ emitEvent: true }
			);
		}
		

	
		//this.addressFound = true;
		this.cd.detectChanges();

		document.getElementById('mat-input-10').focus();
		document.getElementById('mat-input-11').focus();
		this.cd.detectChanges();

		console.log("Getting Address")
		this.getDistance();
		this.cd.detectChanges();
		document.getElementById('mat-input-10').focus();
		document.getElementById('street-address-1').focus();
		document.getElementById('mat-input-10').focus();
		document.getElementById('mat-input-11').focus();
		document.getElementById('mat-input-5').focus();
		document.getElementById('street-address-1').focus();
		document.getElementById('mat-input-6').focus();
		document.getElementById('mat-input-7').focus();
		console.log("mere bad chala")




	}

	towingQuestion() {

		const yard = this.yards.filter(
			(yard) => this.ticketForm.get('yard').value == yard.S3ClientId
		);
		if (this.popupShown == false) {
			Swal.fire({
				title: 'Warning',
				text: `Towing unavailable over ${this.towingMaxRadius} from ${yard[0].YardName} - ${yard[0].YardLocation}`,
			});

			this.popupShown = true
		}

		// const dialogRef = this.dialog.open(PopupQuestionComponent, {
		// 	width: '450px',
		// 	data: {
		// 		title: 'Warning',
		// 		question: `Towing unavailable over ${this.towingMaxRadius} from ${yard[0].YardName} - ${yard[0].YardLocation}`,
		// 		confirm: 'Ok',
		// 		deny: '',
		// 		isconfirmed: false,
		// 		otherData: {},
		// 	},
		// });

		// dialogRef.afterClosed().subscribe((result) => {
		// 	if (result?.isconfirmed) {
		// 		console.log('closed');

		// 	}
		// });
		return;
	}
	ngOnDestroy() {
		this.destroy$.next(true);
		this.destroy$.complete();
	}
}
class ConfirmValidParentMatcher implements ErrorStateMatcher {
	isErrorState(
		control: FormControl | null,
		form: FormGroupDirective | NgForm | null
	): boolean {
		console.log('error');
		return control.parent.invalid && control.touched;
	}
}
