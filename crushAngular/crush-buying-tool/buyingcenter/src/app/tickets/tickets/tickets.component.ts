import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { log } from 'node:console';
import { PopupQuestionComponent } from 'src/app/admin/componets/popup-question/popup-question.component';
import { TicketDetailComponent } from 'src/app/dialogComponents/ticket-detail/ticket-detail.component';
import {
	status,
	ticket,
	ticketView,
} from 'src/app/interfaces/call-center.interface';
import { NotificationService } from 'src/app/services/notification.service';
import { TicketService } from 'src/app/services/ticket.service';
import { HttpClientService } from 'src/app/services/http-client.service';


@Component({
	selector: 'app-tickets',
	templateUrl: './tickets.component.html',
	styleUrls: ['./tickets.component.scss'],
})
export class TicketsComponent implements OnInit {
	@Input() size: ticketView = 'large';
	selectedTicketId: number = 1092;
	tickets: ticket[] = [];
	status: status = 'all';
	isFinished = false;
	IsDeleted;
	searchString = null;
	finishingTickets = [];
	finishingTicketIds = [];
	ticketStatus = ['open', 'pickup', 'dropoff', 'finished'];


	constructor(
		private ticketService: TicketService,
		private notificationService: NotificationService,
		private router: Router,
		private dialog: MatDialog,
		private clientService: HttpClientService,
	) {
		this.ticketService.updateAllTickets();
	}

	ngAfterViewInit(): void {
		console.log('dtadasd32323');

		let data = [];
		// Emitting event to indicate initialization has completed
		this.ticketService.getAllTickets().subscribe((tickets) => {
			const currentDate = new Date();
			console.log('dtadasd');
			//console.log(tickets,'ticketstickets')
			tickets?.map(item => {
				const pickupDate = new Date(item?.pickupdate);
				//item.pickupDate = moment(item?.pickupdate);
				const timezoneOffsetMinutes = new Date().getTimezoneOffset();				
      
				// Adjust the date by the timezone offset and convert to local time
				const adjustedDate = moment(item?.pickupdate).add(-timezoneOffsetMinutes,'minutes')
				console.log("🚀 ~ TicketsComponent ~ this.ticketService.getAllTickets ~ adjustedDate:", adjustedDate)
				item.pickupDate = adjustedDate.format("dddd-MMMM-YYYY hh:mm:a");
				
				console.log(item.pickupDate,"pd")



				// Checking if the condition is true for item.data


				if (currentDate > pickupDate && !item?.finished && item?.pickupdate) {

					if (!this.finishingTicketIds.includes(item.callticket)) {
						this.finishingTicketIds.push(item.callticket);
						this.finishingTickets.push(item)
					}


					this.markItFinish(item)
				}
			});

		});
		console.log(this.finishingTickets, "name dedia")

	}

	ngOnInit(): void {

		this.ticketService.getAllTickets().subscribe((tickets) => {
			if (this.size == 'small') {
				this.tickets = tickets.filter((ticket) => {
					return (
						ticket.status == 'pickup' || ticket.status == 'dropoff' || ticket.finished
					);
				});
				return;
			}
			this.tickets = tickets;
		});
	}
	ticketDetails(event, ticket) {
		const ref = this.dialog.open(TicketDetailComponent, {
			width: '500px',
			height: '600px',
			data: {
				ticket: ticket,
			},
		});
	}
	setFilter() { }
	searchChange(searchString) {
		console.log(this.status, 'this.statusthis.statusthis.status');

		this.ticketService.updateAllTickets(
			this.status,
			this.searchString,
			this.isFinished,

		);
	}
	statusChange(status: status = 'all', finished = true) {
		console.log(status, 'sdsaasdasd');

		this.status = status;
		this.isFinished = finished;


		this.ticketService.updateAllTickets(
			this.status,
			this.searchString,
			this.isFinished,

		);
	}
	ticketView() {
		this.router.navigate(['./tickets']);
	}
	openEdit(id: number) {
		this.router.navigate(['./ticket', id]);
	}
	setView(id: number) { }
	getTicketByType(type: string) {
		console.log(type);
		if (this.status == 'finished') {
			this.ticketStatus = ['open', 'pickup', 'dropoff', 'finished'];
		}
		else if (this.status.toString() == 'deleted') {
			this.ticketStatus = ['deleted'];
		}
		else {

			this.ticketStatus = ['open', 'pickup', 'dropoff'];
		}
		console.log(this.ticketStatus);

		let data = [];
		this.ticketService.getAllTickets().subscribe((tickets) => {
			const currentDate = new Date();
			console.log(tickets, 'ticketstickets')
			console.log(this.status);
			if (this.status === "all") {
				tickets = tickets.filter(item => !item.finished && !item.isdeleted);
			}

			tickets?.map(item => {
				const pickupDate = new Date(item?.pickupdate);
				// Checking if the condition is true for item.data


				if (currentDate > pickupDate) {

					if (!this.finishingTicketIds.includes(item.callticket)) {
						this.finishingTicketIds.push(item.callticket);
						this.finishingTickets.push(item)
					}
					// this.markItFinish(item)
				}
			});
			console.log(type, 'asdasdasd');

			if (type != 'all') {
				console.log('asdasdasdasdasd');

				data = tickets
					.filter((ticket) => {
						if (type == 'finished') return ticket.finished;
						if (type == 'deleted') return ticket.isdeleted;
						return ticket.status == type && !ticket.finished && !ticket.isdeleted;
					})
					.map((ticket) => {
						return {
							...ticket,
							timeUp: this.checkIfTimeUp(ticket),
						};
					});
			}
			else {
				data = tickets;
				console.log(data, 'asasdasdasdasdasdasd');

			}
		});

		return data;
	}
	checkIfTimeUp(ticket) {
		const timeUp = moment(ticket.pickupdate);
		const now = moment();
		if (timeUp.isBefore(now)) {
			return true && !ticket.finished;
		}
		return false;
	}
	markItFinish(ticket) {
		console.log(ticket.pickupdate, 'sdfsdjsdfj');

		ticket.finished = true;
		this.ticketService.adjustTicketStatus(ticket).subscribe((res) => {
			this.notificationService.success(`Ticket Saved`);
		});
	}
	StatusChange(ticket, status) {
	
		if (status == 'purchased') {
			ticket.finished = true;
			ticket.purchased = true;
			this.ticketService.adjustTicketStatus(ticket).subscribe((res) => {
				this.notificationService.success(`Ticket Saved`);
				window.location.reload()
			});
		}
		else {
			if (ticket.status == status) {
				alert(`Ticket is already in ${status} `)
			}
			else {

				ticket.status = status;
				this.ticketService.adjustTicketStatus(ticket).subscribe((res) => {
					this.notificationService.success(`Ticket Saved`);
					window.location.reload()
				});
			}

		}
	}
	formatDate(date: string) {
	console.log("🚀 ~ TicketsComponent ~ formatDate ~ date:", date)

		if (moment(date).isValid()) {
		
			// Format the adjusted date
			const formattedDate = moment(date).format('dddd, MMMM D, YYYY h:mm a').toString();
			const timezoneOffsetMinutes = new Date().getTimezoneOffset();				
      
			// Adjust the date by the timezone offset and convert to local time
			const adjustedDate = moment(date).add(-timezoneOffsetMinutes,'minutes').format('dddd, MMMM D, YYYY h:mm a')
			
			return adjustedDate;
		} else {
			// Return the fallback message for an invalid date
			return "Towing not selected";
		}

		return moment(date).format('dddd, MMMM D, YYYY, h:mm a');
	}
	setTearStatus(status: any, ticket) {
		if (['prod', 'production'].includes(process.env.NODE_ENV)) {
			const s3GroupId = +this.ticketService.retrieveS3GroupId();
			if (s3GroupId !== 102) return; //check if tear a part yard
			if (
				ticket &&
				['pickup', 'dropoff', 'finished', 'cancel'].includes(status)
			) {
				this.clientService
					.updateTearAPartStatus({
						ticket_id: ticket,
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
								ticket
							);
						},
						() => { }
					);
			}
		} else {
			return;
		}
	}
	closeTicket(ticket) {


		const dialogRef = this.dialog.open(PopupQuestionComponent, {
			width: '450px',
			data: {
				title: 'Trash Ticket',
				question: `Are you sure you want to trash ticket #${ticket}? This ticket will no longer be available if you continue.`,
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
					.deleteTicket(ticket)
					.subscribe(
						(res) => {
							console.log(
								'Successfully deleted ticket!',
								ticket
							);
							this.setTearStatus('closed', ticket);
							window.location.reload()
						},
						(error) => {
							this.notificationService.error(
								'Error! Cannot delete ticket #' +
								ticket
							);
						},
						() => {
							this.router.navigate(['./tickets']);
						}
					);
			}
		});
	}
}
