import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private baseUrl = 'http://localhost:3004';

  constructor(private http: HttpClient) {}

  getCandidateProfile() {
    return this.http.get(`${this.baseUrl}/candidate/candidate-profile`);
  }

  updateCandidateProfile(data: any) {
    return this.http.put(`${this.baseUrl}/user/updateCandidateProfile`, data);
  }

  getProfile() {
    return this.http.get(`${this.baseUrl}/user/profile`);
  }
}
