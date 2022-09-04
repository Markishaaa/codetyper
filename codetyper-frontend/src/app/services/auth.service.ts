import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';
import { User } from '../api/user';

export interface AuthResult {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  private apiServerUrl = environment.apiBaseUrl;

  register = (username: string, email: string, password: string): Observable<any> => {
    return this.httpClient.post<AuthResult>(this.apiServerUrl + "/api/auth/register", {
      username: username,
      email: email,
      password: password
    });
  }

  login = (username: string, password: string): Observable<any> => {
    return this.httpClient.post<AuthResult>(this.apiServerUrl + "/api/auth/login", {
      username: username,
      password: password
    }, {
      withCredentials: true,
      observe: "response" as "response"
    }).pipe(map((resp: any) => {
      return resp;
    }));
  }

  logout = (): Observable<any> => {
    return this.httpClient.post<AuthResult>(this.apiServerUrl + "/api/auth/logout", {
      withCredentials: true,
      observe: "response" as "response"
    }).pipe(map((resp: any) => {
      return resp;
    }));
  }

  getSelf = (): Observable<User> => {
    return this.httpClient.get<User>(this.apiServerUrl + "/api/auth/self", {
      withCredentials: true
    });
  }

}

export const logout = async () => {
  const res = await fetch(`${environment.apiBaseUrl}/api/auth/logout`, {
      method: "POST",
      mode: "cors",
      headers: {
          "Content-Type": "application/json"
      },
      credentials: "include"
  });
};