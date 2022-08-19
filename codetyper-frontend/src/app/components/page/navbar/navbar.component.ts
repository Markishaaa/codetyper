import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalConstants } from 'src/app/api/global-constants';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  reRoute = GlobalConstants.reRoute;

  constructor(private router: Router) { }

  ngOnInit(): void {
    GlobalConstants.reRoute = (pageName: string) => {
      this.router.navigate([`${pageName}`]);
    }
  }

}
