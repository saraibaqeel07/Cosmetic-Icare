import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin/admin.component';
import { QouteManagementComponent } from './admin/qoute-management/qoute-management.component';
import { UserManageComponent } from './admin/user-manage/user-manage.component';
import { YardConfigComponent } from './admin/yard-config/yard-config.component';
import { AuthRolesGuard } from './guards/auth-roles.guard';
import { roles } from './interfaces/data.interface';
import { ScheduleComponent } from './schedule/schedule.component';
import { LoginComponent } from './shared/login/login.component';
import { NewTicketComponent } from './tickets/new-ticket/new-ticket.component';
import { TicketsComponent } from './tickets/tickets/tickets.component';
import { SubscriptionsComponent } from './admin/subscriptions/subscriptions.component';
import { SteelPriceComponent } from './admin/componets/steel-price/steel-price.component';
import { VehichleClassComponent } from './admin/componets/vehichle-class/vehichle-class.component';
import { CustomQuestionsAdminComponent } from './admin/componets/custom-questions-admin/custom-questions-admin.component';
import { TowingCostComponent } from './admin/componets/towing-cost/towing-cost.component';
import { PopularVehiclesComponent } from './admin/componets/popular-vehicles/popular-vehicles.component';
import { UnpopularVehiclesComponent } from './admin/componets/unpopular-vehicles/unpopular-vehicles.component';
import { YearAdjustmentComponent } from './admin/componets/year-adjustment/year-adjustment.component';
import { RecallAdjustmentComponent } from './admin/componets/recall-adjustment/recall-adjustment.component';
import { TitleProofComponent } from './admin/componets/title-proof/title-proof.component';

const routes: Routes = [
	{
		path: 'login',
		component: LoginComponent
	},
	//probably should rename to edit ticket
	{
		path: 'ticket',
		component: NewTicketComponent
	},
	{
		path: 'ticket/:ticketId',
		component: NewTicketComponent,
		data: {
			roles: [roles.GM, roles.superAdmin, roles.callCenter]
		},
		canActivate: [AuthRolesGuard]
	},
	{
		path: 'admin',
		data: { roles: [roles.superAdmin, roles.GM], title: 'Admin' },
		component: AdminComponent,
		canActivate: [AuthRolesGuard],
		children: [
			{
				path: 'quote',
				data: { roles: [roles.superAdmin, roles.GM], title: 'Quote Management' },
				component: QouteManagementComponent,
				children: [
					{
						path: 'steel-price',
						data: { roles: [roles.superAdmin, roles.GM], title: 'Steel Price' },
						component: SteelPriceComponent
					},
					{
						path: 'vehicle-class',
						data: { roles: [roles.superAdmin, roles.GM], title: 'Vehicle Class' },
						component: VehichleClassComponent
					},
					{
						path: 'questions',
						data: { roles: [roles.superAdmin, roles.GM], title: 'Questions' },
						component: CustomQuestionsAdminComponent
					},
					{
						path: 'towing',
						data: { roles: [roles.superAdmin, roles.GM], title: 'Towing' },
						component: TowingCostComponent
					},
					{
						path: 'popular',
						data: { roles: [roles.superAdmin, roles.GM], title: 'Popular' },
						component: PopularVehiclesComponent
					},
					{
						path: 'unpopular',
						data: { roles: [roles.superAdmin, roles.GM], title: 'Unpopular' },
						component: UnpopularVehiclesComponent
					},
					{
						path: 'year',
						data: { roles: [roles.superAdmin, roles.GM], title: 'Year' },
						component: YearAdjustmentComponent
					},
					{
						path: 'recall',
						data: { roles: [roles.superAdmin, roles.GM], title: 'Recall' },
						component: RecallAdjustmentComponent
					},
					{
						path: 'proof-of-ownership',
						data: { roles: [roles.superAdmin, roles.GM], title: 'Proof of ownership' },
						component: TitleProofComponent
					},
					{
						path: '',
						redirectTo: 'steel-price',
						pathMatch: 'full'
					}
				]
			},
			{
				path: 'yard',
				component: YardConfigComponent,
				data: { title: 'Yards' },
			},
			{
				path: 'user',
				component: UserManageComponent,
				data: { title: 'User Management' },
			},
			{
				path: 'subscription',
				component: SubscriptionsComponent,//UserManageComponent
				data: { title: 'Subscription' },
			},
			{
				path: '',
				redirectTo: 'quote',
				pathMatch: 'full'
			},
		]
	},
	{
		path: 'tickets',
		component: TicketsComponent
	},
	{
		path: 'schedule',
		component: ScheduleComponent
	},
	{
		path: '**',
		redirectTo: '/schedule'
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
