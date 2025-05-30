import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	OnInit,
	OnDestroy,
	Output,
	ViewChild,
	ChangeDetectorRef,
} from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Subject } from 'rxjs';
import { TicketDetailComponent } from '../dialogComponents/ticket-detail/ticket-detail.component';
import { calenderColors, ticket } from '../interfaces/call-center.interface';
import { ScheduleService } from '../services/schedule.service';
import { TicketService } from '../services/ticket.service';
import { filter, takeUntil } from 'rxjs/operators';
import { log } from 'console';
import * as moment from 'moment';

@Component({
	selector: 'app-schedule',
	templateUrl: './schedule.component.html',
	styleUrls: ['./schedule.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent implements OnInit, OnDestroy {
	@ViewChild('daysOfWeek') daysOfWeek;

	refresh: Subject<any> = new Subject();
	view: CalendarView = CalendarView.Month;
	CalendarView = CalendarView;
	viewDate: Date = new Date();
	DriverTickets: CalendarEvent[] = [];
	StoreTickets: CalendarEvent[] = [];
	selectedDriver = null;
	selectedYard = null;
	allTickets = [];
	c = calenderColors;
	yards = [];
	daysInWeek = 7;
	isDrawerOpen = false;

	private destroy$ = new Subject<void>();
	constructor(
		private ticketService: TicketService,
		private scheduler: ScheduleService,
		private route: ActivatedRoute,
		private router: Router,
		private dialog: MatDialog,
		private breakpointObserver: BreakpointObserver,
		private cdRef: ChangeDetectorRef
	) {}

	ngOnInit(): void {
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
				this.cdRef.markForCheck();
			});

		this.ticketService.updateAllTickets();
		// this.route.queryParams.pipe(filter((params) => (params.id || params.yard))).subscribe(params => {
		// 	if(params.yard) {

		// 	}
		// 	if(params.id) {
		// 		this.DriverTickets = this.allTickets.filter(ticket => {
		// 			return ticket.status == 'pickup' && ticket.driver == params.id;
		// 		}).map((t) => {
		// 			return ({start: new Date(t.pickupdate), title: `${t.make} ${t.model} <br /> ${t.callername} $${t.negotiatedprice}`});
		// 		});
		// 	}
		// })
		this.ticketService.getYards().subscribe((yards) => {
			this.yards = yards;
			if (!this.selectedYard) {
				this.selectedYard = this.yards[0].S3ClientId;
			}
			this.updateYards();
		});
		this.ticketService.getAllTickets().subscribe((tickets) => {
			this.allTickets = tickets;
			this.updateYards();
			this.DriverTickets = this.allTickets
				.filter((ticket) => {
					return ticket.status == 'pickup';
				})
				.map((t) => {
					const color = t.finished
						? calenderColors['finished']
						: calenderColors[t.status];
						const timezoneOffsetMinutes = new Date().getTimezoneOffset();				
      
						// Adjust the date by the timezone offset and convert to local time
						const adjustedDate = moment(t.pickupdate).add(-timezoneOffsetMinutes,'minutes').toDate()
					return {
						start: adjustedDate,
						title: `#${t.callticket}: ${t.year.toString().slice(-2)}, ${t.make} ${
							t.model
						}`,
						color: color,
						data: t,
					};
				});
				
		});
	}
	
	toggleDrawer() {
		
		this.isDrawerOpen = !this.isDrawerOpen;
		console.log(this.isDrawerOpen,'this.isDrawerOpen');
		
	  }
	ticketClicked(e) {
		console.log(e);
		const ref = this.dialog.open(TicketDetailComponent, {
			width: '500px',
			height: '600px',
			data: {
				ticket: e.event.data,
			},
		});
	}
	setYard(yardId) {
		this.selectedYard = yardId;
		this.updateYards();
	}
	updateYards() {
		if (this.yards && this.allTickets) {
			this.StoreTickets = this.allTickets
				.filter((ticket) => {
					return (
						ticket.chosenyardid == this.selectedYard &&
						(ticket.status == 'pickup' || ticket.status == 'dropoff')
					);
				})
				.map((t) => {
					const color = t.finished
						? calenderColors['finished']
						: calenderColors[t.status];

						const timezoneOffsetMinutes = new Date().getTimezoneOffset();				
      
					// Adjust the date by the timezone offset and convert to local time
					const adjustedDate = moment(t.pickupdate).add(-timezoneOffsetMinutes,'minutes').toDate()
				return {
					start: adjustedDate,
						title: `#${t.callticket}: ${t.year.toString().slice(-2)}, ${t.make} ${
							t.model
						}<br /> ${t.callername} $${t.negotiatedprice}`,
						color: color,
						data: t,
					};
				});
			this.refresh.next(true);
		}
	}
	setView(selected: CalendarView) {
		this.view = selected;
	}
	filterDrivers(driver) {
		this.selectedDriver = driver;
		this.DriverTickets = this.allTickets
			.filter((ticket) => {
				return ticket.status == 'pickup' && ticket.driver == driver.id;
			})
			.map((t) => {
				const color = t.finished
					? calenderColors['finished']
					: calenderColors[t.status];
					const timezoneOffsetMinutes = new Date().getTimezoneOffset();				
      
					// Adjust the date by the timezone offset and convert to local time
					const adjustedDate = moment(t.pickupdate).add(-timezoneOffsetMinutes,'minutes').toDate()
				return {
					start: adjustedDate,
					title: `#${t.callticket}: ${t.year.toString().slice(-2)}, ${t.make} ${
						t.model
					}`,
					color: color,
					data: t,
				};
			});
	}

	ngOnDestroy() {
		this.destroy$.next();
	}
}
