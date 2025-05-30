import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-progress-spinner',
  templateUrl: './progress-spinner.component.html',
  styleUrls: ['./progress-spinner.component.scss']
})
export class ProgressSpinnerComponent implements OnInit {

  constructor() { }

  @Input() value: number = 100;
  @Input() diameter: number = 100;
  @Input() mode: string = "indeterminate";
  @Input() strokeWidth: number = 10;
  @Input() overlay: boolean = false;
  @Input() color: string = "primary";

  ngOnInit(): void {
  }

}
