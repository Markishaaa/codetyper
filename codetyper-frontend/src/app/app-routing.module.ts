import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TypeCodeComponent } from './components/functionalities/type-code/type-code.component';
import { LoginComponent } from './components/user/login/login.component';
import { RegisterComponent } from './components/user/register/register.component';

const routes: Routes = [
  {
    path: "",
    component: TypeCodeComponent
  },
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: "login",
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
