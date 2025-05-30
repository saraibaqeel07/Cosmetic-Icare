export interface steelPrice {
	id?: number;
	S3GroupId: number;
	steelPriceTon: number;
	steelPricePound: number;
	name: string;
	delete?: boolean;
	isSinglePrice?: boolean;
	NegotiatedPriceEnabled?: boolean;
	biddingSetup?: string;
	negotiatedPriceLimit?: number;
	updatedAt?: string;
	createdAt?: string;
}
export interface vehiclePopularity {
	S3GroupId: number;
	id?: number;
	modelId: number;
	makeId?: number;
	priceAdj: priceAdj;
	priceAdjId?: number;
	yearbegin: number;
	yearend: number;
	delete?: boolean;
	model?: string;
	applyToAboveDpt?: number;
	updatedAt?: string;
	createdAt?: string;
}

export interface vehicleMake {
	id: number;
	make: string;
}

export interface vehicleModel {
	model: string;
	makeId: number;
	series: string;
	make: string;
	id: number;
}
export interface priceAdj {
	id?: number;
	adj: number;
	isPercent: boolean;
}

export interface makeAccount {
	cardNum: string;
	expiration: string;
	userId: number;
	email: string;
	phone: string;
	firstName: string;
	lastName: string;
	company: string;
	address: string;
	city: string;
	state: string;
	zip: string;
	country: string;
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
export interface classToWeight {
	CarSize: string;
	S3GroupId: number;
	id?: number;
	weightTons: number;
	delete?: boolean;
	new?: boolean;
	curbWeight?: number;
}

export interface vehicleClass {
	vehicleClass: string;
}
export interface towingCost {
	id?: number;
	S3GroupId: number;
	distance: number;
	priceAdj: priceAdj;
	priceAdjId?: number;
	delete?: boolean;
	maximumDistance?: number;
}
export interface vehicleUnPopularity {
	S3GroupId: number;
	id?: number;
	modelId: number;
	makeId?: number;
	priceAdj: priceAdj;
	priceAdjId?: number;
	yearbegin: number;
	yearend: number;
	applyToAboveDpt: number;
	delete?: boolean;
	updatedAt?: string;
	createdAt?: string;
}

export interface vehicleMake {
	id: number;
	make: string;
}

export interface vehicleModel {
	model: string;
	makeId: number;
	series: string;
	make: string;
	id: number;
}
export interface yearAdjCost {
	S3GroupId: number;
	id?: number;
	priceAdj: priceAdj;
	priceAdjId?: number;
	year: number;
	delete?: boolean;
}
export interface recallCosts {
	S3GroupId: number;
	id?: number;
	recallCost: string;
	priceAdj: priceAdj;
	delete?: boolean;
}
export interface proofDocs {
	id?: number;
	S3GroupId: number;
	priceAdj: priceAdj;
	delete: boolean;
}
export interface customQuestionsCosts {
	S3GroupId: number;
	id?: number;
	priceAdj: priceAdj;
	priceAdjId?: number;
	questionText: string;
	delete?: boolean;
}
export interface yardInfo {
	Pk: number;
	S3GroupId: number;
	GroupName: string;
	S3ClientId: number;
	YardName: string;
	YardLocation?: address;
	YardAddress: number;
	YardLicenseStatus: number;
	YardCrushUpgradeDate: string;
	YardCrushPackage: number;
	YardCrushVersion: string;
	address?: address;
	isDefault?: any;
}
export interface userAndRoles {
	userid: number;
	roleid: number;
	groupid: number;
	email: string;
	verified: number;
	name: string;
	fake?: boolean;
}
export interface UserRO {
	user: UserData;
}
export type trialType = 'trial' | 'sub';

export interface subInfo {
	lastCheckedSubValid: string;
	SubscriptionPaid: boolean;
	accountType: trialType;
	userId: number;
	cancelled: boolean;
	GroupId: number;
}
export interface roles {
	role: string;
	GroupId: number;
	GroupName: string;
}
export interface UserData {
	username: string;
	email: string;
	token: string;
	bio: string;
	image?: string;
	roles: roles[];
	id: number;
	verified: boolean;
	admin?: boolean;
	phone?: string;
	sub: subInfo;
}
export interface popupQuestion {
	title: string;
	question: string;
	confirm: string;
	deny: string;
	isconfirmed: boolean;
	otherData: any;
}

export const ROLES = [
	'GM', // 0 - CALLCENTERADMININDEX
	'admin', // 1 - ADMININDEX super admin
	's3groupid', // 2 - GROUPID
	'call center', // 3 - CALLCENTERINDEX
	'driver', // 4 - DRIVERINDEX
	'team lead', // 5 - TEAMLEADINDEX
];
export const ROLESEXPLAINED = [
	'GM: The call center administrator. They can add users, delete users, change user permissions and are able to use every app',
	'ADMIN: ',
	'S3GROUPID: ',
	'CALL CENTER: Can use every feature of the buying center tool. However, they cannot manage users or change how the quote is generated.',
	'DRIVER: Can use limited features on the buying center tool. This feature is under construction',
	'TEAM LEAD: ',
];
const getRoles = (roleIds) =>
	roleIds.map((r) => {
		return ROLES[r];
	});
export const ADMININDEX = 1;
export const ADMIN = getRoles([ADMININDEX]);
