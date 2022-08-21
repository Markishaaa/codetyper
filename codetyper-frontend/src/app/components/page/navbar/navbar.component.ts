import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalConstants } from 'src/app/api/global-constants';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  reRoute = GlobalConstants.reRoute;

  reload: any;

  constructor(private router: Router, private sharedService: SharedService) { }

  ngOnInit(): void {
    GlobalConstants.reRoute = (pageName: string) => {
      this.router.navigate([`${pageName}`]);
    }

    this.reload = () => {
      this.sharedService.sendClickEvent();
    }
  }

}
