export interface car {
	veh: string;
	make: string;
	model: string;
}

export interface titleInfo {
	titleInfo: string;
	id: number;
}

export interface vehicleMake {
	make: string;
	id?: number;
}

export interface model {
	model: string;
	makeId?: number;
	id?: number;
	make: string;
	series?: string;
	year?: string;
}

export interface series {
	series: string;
}
export interface makeModel {
	model: model[];
	make: vehicleMake[];
}
export interface vehicleSize {
	vehicleClass: string;
}

export interface condition {
	condition: string;
	id: number;
}

export interface leadType {
	leadType: string;
	id: number;
	otherExplanation?: string;
}

export interface yardLocation {
	S3ClientId: number;
	YardName: string;
	YardLocation: string;
	latitude: number;
	longitude: number;
}

export interface vehicleVendor {
	name: string;
	city: string;
	contact?: string;
	phone?: string;
	vendorNum: number;
}

export interface address {
	street1?: string;
	street2?: string;
	city?: string;
	zip?: string;
	state?: string;
	latitude?: number;
	longitude?: number;
}

export interface question {
	priceAdj: any;
	questionText: string;
	id: number;
	answeredYes: boolean;
	answeredText?: string;
}
export interface VINNumber {
	Make: string;
	Model: string;
	Series: string;
	'Vehicle Class': string;
	'Model Year': string;
	curbWeight: string;
}

export interface quoteForm {
	year: any;
	Make: any;
	Model: any;
	Series: any;
	VIN: any;
	vehicleSize: any;
	towed: any;
	distance: any;
	questions: any;
	quote: any;
	color?: any;
	titleNum: any;
	titleState: any;
	proofDocs: any;
	odometer: any;
	curbWeight: any;
	quoteCurbWeight: any;
	quote1: any;
	quoteCurbWeight1: any;
}

export interface callForm {
	callerName: any;
	phoneNumber: any;
	address: any;
}

export interface timeInfo {
	date: number;
	year: number;
	month: number;
	hour: number;
	minute: number;
}

export interface ticket {
	Address: string;
	address: address;
	callername: string;
	callerLastName: string;
	callticket: number;
	changed: string;
	chosenYardId: number;
	driver: number;
	driverUsername: string;
	latitude: number;
	longitude: number;
	make: string;
	model: string;
	phonenumber: string;
	pickupdate: string;
	quote: number;
	negotiatedprice: number;
	ticketAccepted: string;
	ticketFinished: string;
	towed: boolean;
	purchased: boolean;
	vehicleSize: string;
	vin: string;
	status: string;
	driverstatus: string;
}

export interface driver {
	callTicket: number;
	latitude: number;
	loginIdExpiresDate: string;
	longitude: number;
	userid: number;
	username: string;
	email: string;
	phone: string;
}
export interface recall {
	Recall: string;
	Recall_Date: string;
	Repurchase: number;
	Type: string;
	Penalty: number;
	isPercent: boolean;
}

export type recallCost = 'low' | 'medium' | 'high' | 'none';

export interface recallInfo {
	Recall: string;
	Recall_Date: string;
	Repurchase: number;
	Type: string;
	recallCost: recallCost;
}
export interface quoteToName {
	quote: number;
	name: string;
}
export interface quoteInfo {
	quote: quoteToName[];
	towingCost: number;
	quoteCurb: quoteToName[];
	min?: number;
	max?: number;
}
export interface timeInfo {
	date: number;
	year: number;
	month: number;
	hour: number;
	minute: number;
}
export interface vendor {
	id: number;
	businessName: string;
	contactName: string;
	businessAddress: number;
	phoneNumber: string;
	address: address;
	towingVendor: boolean;
}
export interface confirmDialog {
	title: string;
	cofirmButton: string;
	denyButton: string;
	message: string;
}
export type driverStatus =
	| 'scheduled'
	| 'pickedup'
	| 'done'
	| 'will be late'
	| 'vehicle not available';
export type status =
	| 'all'
	| 'open'
	| 'pickup'
	| 'dropoff'
	| 'scheduled'
	| 'finished';
export type ticketView = 'small' | 'large';
// $ticket-status-open: rgb(53, 123, 253);
// $ticket-status-finished: rgb(179, 35, 245);
// $ticket-status-pickup: rgb(35, 245, 63);
// $ticket-status-dropoff: rgb(253, 150, 53);
export const calenderColors: any = {
	finished: {
		primary: 'rgb(179, 35, 245)',
		secondary: 'rgba(179, 35, 245, 0.3)',
	},
	dropoff: {
		primary: ' rgb(253, 150, 53)',
		secondary: 'rgba(253, 150, 53, 0.3)',
	},
	pickup: {
		primary: 'rgb(35, 245, 63)',
		secondary: 'rgba(35, 245, 63, 0.3)',
	},
};
export class Call {
	constructor(
		public searchAddress?: string,
		public address?: address,
		public year?: number,
		public Make?: string,
		public Model?: string,
		public Series?: string,
		public vehicleSize?: string,
		public VIN?: string,
		public callerName?: string,
		public callerLastName?: string,
		public phoneNumber?: string,
		public email?: string,
		public internalMemo?: string,
		public driverMemo?: string,
		public towed?: boolean,
		public distance?: number,
		public questions?: any,
		public callTicket?: number,
		public S3GroupId?: number,
		public chosenYardId?: number,
		public pickupDate?: any,
		public pickupDateNumber?: number,
		public longitude?: number,
		public latitude?: number,
		public Address?: string,
		public purchased?: boolean,
		public status?: status,
		public driverName?: string,
		public finished?: boolean,
		public notes?: string,
		public color?: string,
		public titleNum?: string,
		public titleState?: string,
		public proofDocs?: boolean,
		public addressDetails?: string,
		public odometer?: number,
		public VendorId?: number,
		public curbWeight?: number,
		public DriverId?: any,
		public driver?: any,
		public pickUpNotes?: string,
		public VendorIdPickup?: number,
		public recalls?: recallInfo[],
		public negotiatedPrice?: number,
		public driverStatus?: driverStatus,
		public questionAnswer?: any
	) {}
}
