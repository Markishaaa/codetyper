import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalConstants } from 'src/app/api/global-constants';
import { User } from 'src/app/api/user';
import { AuthService, logout } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  subs = new SubSink();

  reRoute = GlobalConstants.reRoute;

  reload: any;

  user: User | any;
  logout: any;

  constructor(private router: Router, private sharedService: SharedService, private authService: AuthService) { }

  ngOnInit(): void {
    GlobalConstants.reRoute = (pageName: string) => {
      this.router.navigate([`${pageName}`]);
    }

    this.reload = () => {
      this.sharedService.sendClickEvent();
    }

    this.subs.add(this.authService.getSelf().subscribe(data => {
      this.user = data;
      GlobalConstants.user = this.user;
    }));

    this.logout = async () => {
      // this.subs.add(this.authService.logout().subscribe(data => {
      //   GlobalConstants.user = GlobalConstants.guest;
      //   window.location.reload();
      // }));

      GlobalConstants.user = GlobalConstants.guest;
      await logout();
      window.location.reload();
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
