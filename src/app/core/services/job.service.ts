import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobsService {
  private baseUrl = 'http://localhost:3004';

  constructor(private http: HttpClient) {}

  getCandidateJobMatches(): Observable<any> {
    return this.http.get(`${this.baseUrl}/candidate/candidate-profile`);
  }

  applyToJob(applyEndpoint: string, payload: any): Observable<any> {
    return this.http.post(applyEndpoint, payload);
  }
}

