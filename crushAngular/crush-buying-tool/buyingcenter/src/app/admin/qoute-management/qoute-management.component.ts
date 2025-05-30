import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-qoute-management',
  templateUrl: './qoute-management.component.html',
  styleUrls: ['./qoute-management.component.scss']
})
export class QouteManagementComponent implements OnInit {
  childRoute: any = null
  parentRoute: any = null
  constructor(private route: ActivatedRoute, private router: Router) {
    route.url.subscribe(() => {
      this.childRoute = route.snapshot.firstChild.data
      this.parentRoute = route.snapshot.data
    });
  }

  ngOnInit(): void {
  }

}
