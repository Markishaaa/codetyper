import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  subs = new SubSink();

  email: string = "";
  username: string = "";
  password: string = "";
  passwordConfirm: string = "";

  error: string = "";

  register: any;
  reRoute: any;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.register = () => {
      if (this.password === this.passwordConfirm) {
        this.subs.add(this.authService.register(this.username, this.email, this.password).subscribe(
          resp => {
            this.router.navigate(["/login"]);
          }
        ));
      }
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
