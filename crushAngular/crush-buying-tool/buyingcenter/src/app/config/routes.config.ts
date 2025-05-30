import { environment } from '../../environments/environment';

export const ResourceConfig = {
	baseAPI: environment.baseAPI + '/api/',
	SessionKey: 'A23297B464BA40C2997088891474FC33',
	UserEndpoint: 'user',
	UserLogoutEndpoint: 'logout',
	CallCenterDrivers: 'callcenter/drivers',
	OpenTickets: 'callcenter/alltickets',
	TitleInfo: 'callcenter/titleinfo',
	VehicleVendor: 'callcenter/vehiclevendor',
	VehicleMake: 'callcenter/vehiclemake',
	EmergencyTickets: 'callcenter/emergencytickets/',
	VehicleModel: 'callcenter/vehiclemodel',
	Condition: 'callcenter/condition',
	LeadType: 'callcenter/getleadtype',
	States: 'callcenter/states',
	GeoCode: 'callcenter/geocode',
	VehicleSizesOptions: 'callcenter/getvehiclesizes',
	VehicleSizes: 'callcenter/getsize/',
	VehicleSeries: 'callcenter/getseries/',
	VinTranslation: 'callcenter/vin/',
	GetQuestions: 'callcenter/getquestion/',
	GetQuote: 'callcenter/requestquote',
	SetCallTicket: 'callcenter/callticket',
	AdjustTicketStatus: 'callcenter/adjustTicketStatus',
	YardLocations: 'callcenter/yardlocations/',
	GetTicket: 'callcenter/ticket/',
	GetRecallInfo: 'callcenter/nhtsa/',
	setDriverTickets: 'callcenter/driverticket',
	setTicketFinished: 'callcenter/finished/',
	getVendors: 'callcenter/vendors/',
	setVendors: 'callcenter/setvendor',
	driverLocation: 'callcenter/driverlocation',
	deleteTicket: 'callcenter/deleteTicket/',
	getVendorDriver: 'callcenter/vendordriver/',
	setVendorDriver: 'callcenter/vendordriver',
	setCallTicketTime: 'callcenter/tickettime',
	Recall: 'callcenter/recall',

	Status200: {
		title: 'STATUS CODE: 200',
		desc: 'OK All requested data was received.',
	},
	Status204: {
		title: 'STATUS CODE: 204',
		desc: 'No Content',
	},
	Status206: {
		title: 'STATUS CODE: 206 ',
		desc: 'Partial Content',
	},
	Status400: {
		title: 'STATUS CODE: BadRequest 400 ',
		desc: 'BadRequest 400',
	},
	Status401: {
		title: '401- Unauthorized',
		desc: 'Login at crushbuyingtool.com',
	},
	Status440: {
		title: '440- Session Expired',
		desc: '',
	},
	Status500: {
		title: 'STATUS CODE: Internal Server Error 500',
		desc: 'Server Error',
	},
	Status503: {
		title: 'STATUS CODE: 503 Service Unavailable',
		desc: 'Server is Unavailable.',
	},
	StatusUnreachable: {
		title: 'STATUS  CODE: Host Unreachable',
		desc:
			'Please contact S3 at 801-355-3388. DashboardOne’s data engine is offline.',
	},
};
