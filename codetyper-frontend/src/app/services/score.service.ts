import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Score } from '../api/score';

@Injectable({
    providedIn: 'root'
  })
  export class ScoreService {

    constructor(private httpClient: HttpClient) { }

    private apiServerUrl = environment.apiBaseUrl;

    getScore = (id: number): Observable<Score> => {
        return this.httpClient.get<Score>(this.apiServerUrl + "/api/score/" + id, {
            params: { id: id }
        });
    }

    getBySnippet = (codeSnippetId: number): Observable<Score[]> => {
        return this.httpClient.get<Score[]>(this.apiServerUrl + "/api/score/getBySnippet/" + codeSnippetId, {
           params: { codeSnippetId: codeSnippetId } 
        });
    }

    createScore = (user: string, snippetId: number, wpm: number, accuracy: number): Observable<any> => {
        return this.httpClient.post(this.apiServerUrl + "/api/score/createScore", {
            user: user,
            codeSnippetId: snippetId,
            wpm: wpm,
            accuracy: accuracy
        })
    }
  }