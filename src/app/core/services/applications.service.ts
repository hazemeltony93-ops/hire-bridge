import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export interface ApplicationDecisionResponse {
  id: string;
  status: ApplicationStatus;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {
  private baseUrl = 'http://localhost:3004';

  constructor(private http: HttpClient) {}

  getApplications(): Observable<any> {
    return this.http.get(`${this.baseUrl}/candidate/candidate-profile`);
  }

  acceptApplication(id: string): Observable<ApplicationDecisionResponse> {
    return this.updateApplicationStatus(id, 'accepted');
  }

  rejectApplication(id: string): Observable<ApplicationDecisionResponse> {
    return this.updateApplicationStatus(id, 'rejected');
  }

  private updateApplicationStatus(id: string, status: ApplicationStatus): Observable<ApplicationDecisionResponse> {
    return of({
      id,
      status,
      message: `Application ${status}.`
    }).pipe(delay(350));
  }
}
