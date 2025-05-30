import { Component, ViewChild, EventEmitter, Output, OnInit, AfterViewInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { } from 'googlemaps'

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements OnInit, AfterViewInit {

  @Input() addressType: string;
  @Input() formLabel: string;
  @Input() class: string;

  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  @ViewChild('addressText') addressText: any;

  autocompleteInput: string;
  queryWait: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.getPlaceAutocomplete();
  }

  private getPlaceAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(this.addressText.nativeElement,
      {
        componentRestrictions: { country: 'US' },
        // types: [this.addressType]  // 'establishment' / 'address' / 'geocode'
      });

    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      console.log(place)
      this.invokeEvent(place);
    });
  }

  invokeEvent(place: Object) {
    this.setAddress.emit(place);
    this.autocompleteInput = ''
  }

}
