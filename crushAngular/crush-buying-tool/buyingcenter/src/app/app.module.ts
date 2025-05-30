import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
declare const google: any;

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent } from './shared/login/login.component';
import { LogoutComponent } from './shared/logout/logout.component';
import { MaterialModule } from './shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalenderComponent } from './schedule/calender/calender.component';
// import { ScheduleModule } from './schedule/schedule.module';
import { NewTicketComponent } from './tickets/new-ticket/new-ticket.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { QuotePriceComponent } from './tickets/quote-price/quote-price.component';
import { AdminComponent } from './admin/admin/admin.component';
import { TicketsComponent } from './tickets/tickets/tickets.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NotificationComponent } from './dialogComponents/notification/notification.component';
import {
	AgmCoreModule,
	LazyMapsAPILoader,
	LazyMapsAPILoaderConfigLiteral,
} from '@agm/core';
import { environment } from '../environments/environment';
import { QouteManagementComponent } from './admin/qoute-management/qoute-management.component';
import { VehichleClassComponent } from './admin/componets/vehichle-class/vehichle-class.component';
import { SteelPriceComponent } from './admin/componets/steel-price/steel-price.component';
import { TowingCostComponent } from './admin/componets/towing-cost/towing-cost.component';
import { PopularVehiclesComponent } from './admin/componets/popular-vehicles/popular-vehicles.component';
import { YearAdjustmentComponent } from './admin/componets/year-adjustment/year-adjustment.component';
import { TitleProofComponent } from './admin/componets/title-proof/title-proof.component';
import { RecallAdjustmentComponent } from './admin/componets/recall-adjustment/recall-adjustment.component';
import { UnpopularVehiclesComponent } from './admin/componets/unpopular-vehicles/unpopular-vehicles.component';
import { CustomQuestionsComponent } from './tickets/custom-questions/custom-questions.component';
import { CustomQuestionsAdminComponent } from './admin/componets/custom-questions-admin/custom-questions-admin.component';
import { YardConfigComponent } from './admin/yard-config/yard-config.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { DriversComponent } from './shared/drivers/drivers.component';
import { UserManageComponent } from './admin/user-manage/user-manage.component';
import { PaymentsComponent } from './admin/payments/payments.component';
import { NewUserComponent } from './admin/componets/new-user/new-user.component';
import { PopupQuestionComponent } from './admin/componets/popup-question/popup-question.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SetVendorComponent } from './dialogComponents/set-vendor/set-vendor.component';
import { SetDriverComponent } from './dialogComponents/set-driver/set-driver.component';
import { ConfirmDialogComponent } from './dialogComponents/confirm-dialog/confirm-dialog.component';
import { TicketDetailComponent } from './dialogComponents/ticket-detail/ticket-detail.component';
import { SubscriptionsComponent } from './admin/subscriptions/subscriptions.component';
import { GoogleMapComponent } from './admin/componets/google-map/google-map.component';
import { ProgressSpinnerComponent } from './admin/componets/progress-spinner/progress-spinner.component';
import { CustomMaxDirective } from './directives/custom-max-validator.directive';

import { NgxMaskModule, IConfig } from 'ngx-mask';
import { CustomMinDirective } from './directives/custom-min-validator.directive';
import { NgxPrintModule } from 'ngx-print';

export const options: Partial<null | IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
	declarations: [
		AppComponent,
		NavbarComponent,
		LoginComponent,
		LogoutComponent,
		CalenderComponent,
		NewTicketComponent,
		QuotePriceComponent,
		AdminComponent,
		TicketsComponent,
		NotificationComponent,
		QouteManagementComponent,
		VehichleClassComponent,
		SteelPriceComponent,
		TowingCostComponent,
		PopularVehiclesComponent,
		YearAdjustmentComponent,
		CustomQuestionsComponent,
		TitleProofComponent,
		RecallAdjustmentComponent,
		UnpopularVehiclesComponent,
		CustomQuestionsAdminComponent,
		YardConfigComponent,
		ScheduleComponent,
		DriversComponent,
		UserManageComponent,
		PaymentsComponent,
		NewUserComponent,
		PopupQuestionComponent,
		SetVendorComponent,
		SetDriverComponent,
		ConfirmDialogComponent,
		TicketDetailComponent,
		SubscriptionsComponent,
		GoogleMapComponent,
		ProgressSpinnerComponent,
		CustomMaxDirective,
		CustomMinDirective,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		HttpClientModule,
		FontAwesomeModule,
		MaterialModule,
		ReactiveFormsModule,
		FormsModule,
		NgxPrintModule,
		// ScheduleModule,
		CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
		AgmCoreModule.forRoot({
			apiKey: environment.googlemapskey,
			libraries: ['places'],
		} as unknown),
		NgSelectModule,
		NgxMaskModule.forRoot(),
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptor,
			multi: true,
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule { }
