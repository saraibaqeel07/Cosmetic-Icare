import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { yardInfo } from 'src/app/interfaces/admin-interface';
import { DistanceService } from 'src/app/services/distance.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {
  subData = {}
  subscriptionData = {subscription : ""}
  groupYards = []
  user = '';
  subscribeYards = []
  addressFound: boolean = false

  constructor(private admin: AdminService, private distance: DistanceService, private httpClient: HttpClientService,private auth: AuthService) { }

  findAddress(yard: yardInfo) {
    //only find  when all address fields have a value.
    let addressStr = `${yard.address.street1},+${yard.address.street2},+${yard.address.city},+${yard.address.zip},+${yard.address.state}`.replace(/\s/g, '+')

    this.distance.geocode(addressStr).pipe(catchError((err) => {

      this.addressFound = false;
      return of(false);
    })).subscribe((geo: any) => {
      if (geo) {
        const coords = geo.results[0].geometry;
        yard.address.latitude = coords.location.lat;
        yard.address.longitude = coords.location.lng;
      }
    });
  }

  checkSubscribeYard(yard) {
    const result = _.find(this.subscribeYards, { 'YardName': yard.YardName, 'S3ClientId': yard.S3ClientId })

    return !_.isEmpty(result)
  }

  ngOnInit(): void {
    this.subscriptionData = {subscription : ""}
    this.admin.getSubscription().subscribe((subs) => {
      this.subData = subs
      console.log(subs,'subssubssubs');
      
    });
    this.auth.checkLoggedIn().subscribe((val) => {
		
			this.user = this.auth.getUser().admin;
      console.log(this.user);
      
		});
    this.admin.getSubscriptionsData().subscribe((subsData) => {
 
      this.subscriptionData.subscription=subsData["subscription"]
      
    });
    this.httpClient.getYards().subscribe((yards) => {
      this.subscribeYards = yards
    })
    this.httpClient.getAdminYards().subscribe((yards: any[]) => {
      this.groupYards = yards
      console.log(yards)
    })
  }

  ngOnDestroy() {
  }

}
