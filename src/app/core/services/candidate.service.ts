import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  private baseUrl = 'http://localhost:3004';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      auth: this.auth.getToken() || ''
    });
  }

  // 👤 GET PROFILE
  getCandidateProfile() {
    return this.http.get(
      `${this.baseUrl}/candidate/candidate-profile`,
      {
        headers: this.getHeaders()
      }
    );
  }

  // 👤 UPDATE PROFILE
  updateCandidateProfile(data: any) {
    return this.http.put(
      `${this.baseUrl}/user/updateCandidateProfile`,
      data,
      {
        headers: this.getHeaders()
      }
    );
  }

  // 👤 BASIC PROFILE (optional)
  getProfile() {
    return this.http.get(
      `${this.baseUrl}/user/profile`,
      {
        headers: this.getHeaders()
      }
    );
  }
}