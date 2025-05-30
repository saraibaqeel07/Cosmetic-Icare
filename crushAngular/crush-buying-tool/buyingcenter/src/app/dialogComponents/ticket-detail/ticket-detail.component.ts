import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Call, ticket } from 'src/app/interfaces/call-center.interface';
import * as moment from 'moment';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss']
})
export class TicketDetailComponent implements OnInit {
  t: ticket;
  constructor(public dialogRef: MatDialogRef<TicketDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.t = this.data.ticket;


  }

  formatDate(date: string) {

		if (moment(date).isValid()) {
			// Format the valid date
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

}
