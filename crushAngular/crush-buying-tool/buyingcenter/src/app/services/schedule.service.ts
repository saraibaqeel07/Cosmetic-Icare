import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ticket } from '../interfaces/call-center.interface';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
		//s3groupid or groupId 100s
		//contains clientids or yardids 990+
		/*example {
			groupId: 100
			clientIds: [997(dev yard 1),998(yard2),999(yard3)]
		}
		*/
		//{"ticketInfo":{"callTicket":null,"phoneNumber":null,"longitude":null,"latitude":null,"quotebottom":null,"quoteTop":null,"distance":null,"S3GroupId":100,"chosenYardId":null,"pickupDate":null,"searchString":null,"numResults":600,"orderChangedDesc":false,"towed":false,"ticketStatus":"all","assignedToMeOrNull":false,"assignedToMe":false,"notFinished":false,"pickupRange":null,"driverId":null,"driverVendor":false}}
		constructor() { }
		getAllTickets():any {
			//is a post to pass a filters object as seen above
			//POST: http://localhost:3000/api/callcenter/alltickets
			//
			// return of(allTickets)
		}
		getYards() {
			//http://localhost:3000/api/callcenter/yardlocations/100
			// return of(yards);
		}
}
