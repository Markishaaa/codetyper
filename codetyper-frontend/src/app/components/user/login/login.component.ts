import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalConstants } from 'src/app/api/global-constants';
import { AuthService } from 'src/app/services/auth.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../register/register.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  subs = new SubSink();

  username: string = "";
  password: string = "";

  login: any;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.login = () => {
      if (this.username !== "" && this.password !== "") {
        this.authService.login(this.username, this.password).subscribe(
          resp => {
            this.router.navigate(["/"])
              .then(() => window.location.reload());
          }
        );
      };
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
