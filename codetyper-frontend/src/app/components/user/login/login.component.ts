import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../register/register.component.scss']
})
export class LoginComponent implements OnInit {

  username: string = "";
  password: string = "";

  login: any;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.login = () => {
      this.authService.login(this.username, this.password).subscribe(
        resp => {
          localStorage.setItem("token", resp.token);

          this.router.navigate(["/"]);
        }
      );
    };
  }

}
