import { timeInfo } from '.';

export type ticketStatusTypes = 'all' | 'open' | 'Pickup' | 'DropOff' | 'Scheduled';

export interface filterCall {

  callTicket: number;
  
phoneNumber: string;

 longitude: number;

 latitude: number;

 quotebottom: number;

 quoteTop: number;

 distance: number;

 S3GroupId: number;

 chosenYardId: number;

  pickupDate: timeInfo;

  searchString: string;
  
  numResults: number;
  
  orderChangedDesc: boolean;
  
  ticketStatus: ticketStatusTypes;

  towed: boolean;

  assignedToMeOrNull: boolean;

  assignedToMe: boolean;

    notFinished: boolean;

    pickupRange: { begin: Date, days: number };

    driverId: number;

    driverVendor: boolean;
}
