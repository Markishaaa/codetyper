import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CodeSnippet } from '../api/code-snippet';

@Injectable({
  providedIn: 'root'
})
export class CodeSnippetService {

  constructor(private httpClient: HttpClient) { }

  private apiServerUrl = environment.apiBaseUrl;

  getSnippet = (id: number): Observable<CodeSnippet> => {
    return this.httpClient.get<CodeSnippet>(this.apiServerUrl + "/api/snippet/" + id, {
      params: { id: id }
    });
  }

  getRandomSnippet = (): Observable<CodeSnippet> => {
    return this.httpClient.get<CodeSnippet>(this.apiServerUrl + "/api/snippet/randomSnippet");
  }

}
