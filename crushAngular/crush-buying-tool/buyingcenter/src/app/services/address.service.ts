// address.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  street1$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  street2$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  status$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  series$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  purchased$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() {}

  updateStreet1(value: string): void {

    
    this.street1$.next(value);
  }

  updateStreet2(value: string): void {

    this.street2$.next(value);
  }
  updateStatus(value: string): void {

    this.status$.next(value);
  }
  updateSeries(value: string): void {

    this.series$.next(value);
  }
  updatePurchasedStatus(value: boolean): void {

    this.purchased$.next(value);
  }
}
